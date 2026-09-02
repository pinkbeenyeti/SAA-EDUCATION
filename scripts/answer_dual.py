#!/usr/bin/env python3
"""
Dual-backend answer pipeline: Codex (GPT) and Antigravity (Gemini 3.x) each
solve every question independently at near-zero Claude cost. Claude is only
invoked to arbitrate the questions where the two disagree -- see the cost
comparison in this session (full 10-call Claude pipeline: ~$0.20/question;
arbitration-only call: ~$0.013/question, and only paid on disagreements).

Refutation (stage 2) and shuffle-invariance (stage 3) run against BOTH Codex
and Antigravity -- not Claude -- so the defect-detection the original
Claude-only pipeline got from its refutation stage (docs/answer-pipeline-spec.md
section 4, tier D) is preserved without adding Claude cost. These add 4 more
CLI calls per question (2 refute + 2 shuffle), so wall-clock roughly triples;
$ cost does not, since none of the added calls touch Claude.

Tiers:
  A  Codex and Antigravity agree, refutation failed on both, shuffle-invariant
     on both -- cross-model agreement stands in for the original spec's
     5-vote-unanimous check.
  B  They disagreed on stage 1; Claude arbitrated and confidently picked one
     side; refutation and shuffle checks then passed.
  C  Stage 1 disagreement without confident arbitration, OR one of the two
     refuters found a real objection, OR the answer flipped under shuffle.
  D  BOTH independent refuters argued the predicted answer is wrong --
     likely a defective question with no fully correct option.

Usage:
  python scripts/answer_dual.py run --count 20 --out scripts/p4-results.json
  python scripts/answer_dual.py run --skip-done scripts/p3-results.json
"""
import argparse
import json
import random
import sys
import time
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

# Windows consoles default to the system codepage (e.g. cp949 on Korean
# Windows), which chokes on em-dashes and other punctuation that AI-generated
# rationales routinely contain. Force UTF-8 so interactive runs don't crash
# the way redirected-to-file runs never did (those already picked UTF-8).
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# UNOFFICIAL, REFERENCE-ONLY quota estimates. Neither OpenAI's Codex CLI nor
# Google's Antigravity CLI expose actual remaining-quota via any command --
# these numbers are community-reported estimates for the *paid Pro* tier of
# each product (found via WebSearch, Sep 2026), used only to give a rough
# sense of scale against this pipeline's own token usage. They are NOT the
# real account balance and do not account for usage outside this pipeline.
GOOGLE_AI_PRO_WEEKLY_TOKEN_ESTIMATE = 9_000_000 + 200_000  # input + output, Antigravity Pro
CODEX_QUOTA_NOTE = ("OpenAI meters Codex by message/task COUNT, not tokens, and "
                     "publishes no weekly number even for Pro -- no reliable pct can be computed")

from answer import (  # noqa: E402
    LETTERS, normalize_question, build_solve_prompt, solve_schema,
    load_dump_sample, run_claude, ClaudeError,
)
from backends import run_codex, run_agy, BackendError  # noqa: E402

REFUTE_SYSTEM_PROMPT = (
    "You are a skeptical AWS technical reviewer whose only job is to find "
    "reasons a proposed exam answer is WRONG. Default to believing the answer "
    "is wrong unless you can find no viable argument against it. Do not be "
    "persuaded by the fact that the answer 'sounds like a best practice' -- "
    "check whether it actually satisfies every explicit requirement stated in "
    "the question. If you are not fully certain the answer is correct, report "
    "refuted=true."
)

SOLVE_SYSTEM_PROMPT = "Respond in the required JSON schema."

ARBITRATE_SYSTEM_PROMPT = (
    "You are an AWS Certified Solutions Architect - Associate (SAA-C03) exam "
    "expert arbitrating between two independent AI solvers that disagree on "
    "the correct answer to the same question. Read both proposed answers and "
    "their rationales, then decide the single best answer using AWS service "
    "behavior you are confident about. If you are not confident either "
    "proposed answer is fully correct, say so explicitly (confidence=low, "
    "agrees_with=neither) rather than guessing."
)


def arbitrate_schema(letters, n):
    return {
        "type": "object",
        "properties": {
            "final_answer": {"type": "array", "items": {"type": "string", "enum": letters}, "minItems": n, "maxItems": n},
            "agrees_with": {"type": "string", "enum": ["codex", "agy", "neither"]},
            "confidence": {"type": "string", "enum": ["high", "low"]},
            "reasoning": {"type": "string"},
        },
        "required": ["final_answer", "agrees_with", "confidence", "reasoning"],
    }


def build_arbitrate_prompt(nq, codex_letters, codex_rationale, agy_letters, agy_rationale):
    opts = "\n".join(f"{l}) {t}" for l, t in nq["options"].items())
    return (
        f"{nq['question']}\n\n{opts}\n\n"
        f"Solver 1 (Codex/GPT) answered {sorted(codex_letters)}: {codex_rationale}\n\n"
        f"Solver 2 (Gemini) answered {sorted(agy_letters)}: {agy_rationale}\n\n"
        "Which is correct? If neither is fully correct, give your own answer."
    )


def merge_usage(acc, usage):
    for k, v in (usage or {}).items():
        if isinstance(v, (int, float)):
            acc[k] = acc.get(k, 0) + v


def solve_via(backend, prompt, system_prompt, schema, codex_model, agy_model, timeout, usage_acc):
    if backend == "codex":
        out, usage = run_codex(prompt, system_prompt, schema, model=codex_model, timeout=timeout)
    else:
        out, usage = run_agy(prompt, system_prompt, schema, model=agy_model, timeout=timeout)
    merge_usage(usage_acc, usage)
    return out


def solve_one(nq, codex_model, agy_model, timeout, codex_usage_acc, agy_usage_acc):
    prompt = build_solve_prompt(nq)
    schema = solve_schema(nq["letters"], nq["select_n"])

    codex_out, codex_usage = run_codex(prompt, SOLVE_SYSTEM_PROMPT, schema, model=codex_model, timeout=timeout)
    merge_usage(codex_usage_acc, codex_usage)
    codex_letters = frozenset(codex_out["answer"])

    agy_out, agy_usage = run_agy(prompt, SOLVE_SYSTEM_PROMPT, schema, model=agy_model, timeout=timeout)
    merge_usage(agy_usage_acc, agy_usage)
    agy_letters = frozenset(agy_out["answer"])

    return codex_letters, codex_out["rationale"], agy_letters, agy_out["rationale"]


def refute_schema():
    return {
        "type": "object",
        "properties": {"refuted": {"type": "boolean"}, "reasoning": {"type": "string"}},
        "required": ["refuted", "reasoning"],
    }


def build_refute_prompt(nq, letters, rationale):
    opts = "\n".join(f"{l}) {t}" for l, t in nq["options"].items())
    return (
        f"{nq['question']}\n\n{opts}\n\n"
        f"Proposed answer: {sorted(letters)} -- {rationale}\n\n"
        "Argue whether this answer is WRONG."
    )


def call_with_retry(fn, *args, retries=1, **kwargs):
    # No conservative fallback on exhaustion -- callers let BackendError/
    # ClaudeError propagate so the whole question is marked "error" and picked
    # back up by a later batch run, instead of a technical hiccup (timeout,
    # transient API error) silently forcing a tier verdict.
    last_err = None
    for _ in range(retries + 1):
        try:
            return fn(*args, **kwargs)
        except (BackendError, ClaudeError) as e:
            last_err = e
    raise last_err


def refute_once(backend, nq, letters, rationale, codex_model, agy_model, timeout, usage_acc):
    prompt = build_refute_prompt(nq, letters, rationale)
    out = call_with_retry(solve_via, backend, prompt, REFUTE_SYSTEM_PROMPT, refute_schema(), codex_model, agy_model, timeout, usage_acc)
    return out["refuted"], out["reasoning"]


def shuffle_question(nq):
    shuffled_order = nq["letters"][:]
    random.shuffle(shuffled_order)
    new_letters = list(LETTERS[: len(nq["letters"])])
    new_to_old = dict(zip(new_letters, shuffled_order))
    shuffled_nq = {
        "id": nq["id"] + "-shuffled",
        "question": nq["question"],
        "letters": new_letters,
        "options": {nl: nq["options"][ol] for nl, ol in new_to_old.items()},
        "select_n": nq["select_n"],
    }
    return shuffled_nq, new_to_old


def shuffle_check_once(backend, nq, predicted, codex_model, agy_model, timeout, usage_acc):
    shuffled_nq, new_to_old = shuffle_question(nq)
    prompt = build_solve_prompt(shuffled_nq)
    schema = solve_schema(shuffled_nq["letters"], shuffled_nq["select_n"])
    out = call_with_retry(solve_via, backend, prompt, SOLVE_SYSTEM_PROMPT, schema, codex_model, agy_model, timeout, usage_acc)
    mapped_back = frozenset(new_to_old[l] for l in out["answer"])
    invariant = mapped_back == frozenset(predicted)
    return invariant, sorted(mapped_back)


REFUTE_TIEBREAK_SYSTEM_PROMPT = (
    "You are an AWS Certified Solutions Architect - Associate (SAA-C03) exam "
    "expert breaking a tie between two independent reviewers who disagree on "
    "whether a proposed exam answer is actually wrong. Read both arguments on "
    "their technical merits and decide who is right."
)


def tiebreak_schema():
    return {
        "type": "object",
        "properties": {"refuted": {"type": "boolean"}, "reasoning": {"type": "string"}},
        "required": ["refuted", "reasoning"],
    }


def build_tiebreak_prompt(nq, letters, rationale, codex_refuted, codex_reasoning, agy_refuted, agy_reasoning):
    opts = "\n".join(f"{l}) {t}" for l, t in nq["options"].items())
    return (
        f"{nq['question']}\n\n{opts}\n\n"
        f"Proposed answer: {sorted(letters)} -- {rationale}\n\n"
        f"Reviewer 1 (Codex) says refuted={codex_refuted}: {codex_reasoning}\n\n"
        f"Reviewer 2 (Gemini) says refuted={agy_refuted}: {agy_reasoning}\n\n"
        "Is the proposed answer actually wrong?"
    )


def resolve_refutation(nq, predicted, predicted_rationale, codex_model, agy_model, claude_model, timeout, verify_timeout, cost_acc, codex_usage_acc, agy_usage_acc):
    """Returns (final_refuted, detail_dict). Raises on unresolved technical failure."""
    detail = {}
    for backend in ("codex", "agy"):
        usage_acc = codex_usage_acc if backend == "codex" else agy_usage_acc
        refuted, reasoning = refute_once(backend, nq, predicted, predicted_rationale, codex_model, agy_model, verify_timeout, usage_acc)
        detail[backend] = {"refuted": refuted, "reasoning": reasoning}

    if detail["codex"]["refuted"] == detail["agy"]["refuted"]:
        return detail["codex"]["refuted"], detail

    prompt = build_tiebreak_prompt(nq, predicted, predicted_rationale,
                                    detail["codex"]["refuted"], detail["codex"]["reasoning"],
                                    detail["agy"]["refuted"], detail["agy"]["reasoning"])
    verdict, cost = call_with_retry(run_claude, prompt, REFUTE_TIEBREAK_SYSTEM_PROMPT, tiebreak_schema(),
                                     model=claude_model, timeout=timeout)
    cost_acc[0] += cost
    detail["claude_tiebreak"] = verdict
    detail["claude_tiebreak_cost_usd"] = round(cost, 4)
    return verdict["refuted"], detail


def decide_tier_v2(cross_model_agree, claude_verdict, final_refuted, shuffle_invariant_by):
    if final_refuted:
        return "D", "predicted answer was refuted (codex+antigravity agreed, or claude tie-break sided with refutation) -- likely a defective question"
    if not all(shuffle_invariant_by.values()):
        bad = [k for k, v in shuffle_invariant_by.items() if not v]
        return "C", f"answer not shuffle-invariant for: {bad}"
    if cross_model_agree:
        return "A", "codex+antigravity agreement, refutation failed, shuffle-invariant both backends"
    if claude_verdict and claude_verdict.get("confidence") == "high" and claude_verdict.get("agrees_with") != "neither":
        return "B", "claude-arbitrated with high confidence, refutation failed, shuffle-invariant both backends"
    return "C", "disagreement without confident arbitration"


def run_pipeline_dual(question, codex_model, agy_model, claude_model, timeout, verify_timeout, cost_acc):
    nq = normalize_question(question)
    codex_usage_acc, agy_usage_acc = {}, {}
    codex_letters, codex_rationale, agy_letters, agy_rationale = solve_one(
        nq, codex_model, agy_model, timeout, codex_usage_acc, agy_usage_acc)
    cross_model_agree = codex_letters == agy_letters

    claude_verdict = None
    question_cost = 0.0
    if cross_model_agree:
        predicted = codex_letters
        predicted_rationale = codex_rationale
    else:
        prompt = build_arbitrate_prompt(nq, codex_letters, codex_rationale, agy_letters, agy_rationale)
        schema = arbitrate_schema(nq["letters"], nq["select_n"])
        claude_verdict, cost = run_claude(prompt, ARBITRATE_SYSTEM_PROMPT, schema, model=claude_model, timeout=timeout)
        question_cost += cost
        cost_acc[0] += cost
        predicted = frozenset(claude_verdict["final_answer"])
        predicted_rationale = claude_verdict["reasoning"]

    refute_cost_acc = [0.0]
    final_refuted, refute_detail = resolve_refutation(nq, predicted, predicted_rationale, codex_model, agy_model,
                                                        claude_model, timeout, verify_timeout, refute_cost_acc,
                                                        codex_usage_acc, agy_usage_acc)
    question_cost += refute_cost_acc[0]
    cost_acc[0] += refute_cost_acc[0]

    shuffle_invariant_by = {}
    shuffle_answers = {}
    if final_refuted:
        tier, tier_reason = decide_tier_v2(cross_model_agree, claude_verdict, final_refuted, {})
    else:
        for backend in ("codex", "agy"):
            usage_acc = codex_usage_acc if backend == "codex" else agy_usage_acc
            invariant, shuffle_answer = shuffle_check_once(backend, nq, predicted, codex_model, agy_model, verify_timeout, usage_acc)
            shuffle_invariant_by[backend] = invariant
            shuffle_answers[backend] = shuffle_answer
        tier, tier_reason = decide_tier_v2(cross_model_agree, claude_verdict, final_refuted, shuffle_invariant_by)

    return {
        "id": nq["id"],
        "predicted_answer": sorted(predicted),
        "tier": tier,
        "tier_reason": tier_reason,
        "codex_answer": sorted(codex_letters),
        "codex_rationale": codex_rationale,
        "agy_answer": sorted(agy_letters),
        "agy_rationale": agy_rationale,
        "claude_arbitrated": claude_verdict is not None,
        "claude_verdict": claude_verdict,
        "refuted_final": final_refuted,
        "refute_detail": refute_detail,
        "shuffle_invariant_by": shuffle_invariant_by,
        "shuffle_answers": shuffle_answers,
        "cost_usd": round(question_cost, 4),
        "codex_usage": codex_usage_acc,
        "agy_usage": agy_usage_acc,
    }


def run_batch(pool, args):
    """Shared solve/refute/shuffle/tier loop -- used both for dump-sourced
    questions (cmd_run) and for arbitrary generated-question pools
    (cmd_verify_pool). Verification does not care where a question came from;
    it only needs the normalize_question shape {id, question, options, select_n}."""
    batch = pool[args.offset: args.offset + args.batch_size] if args.batch_size else pool[args.offset:]

    skip_ids = set()
    if args.skip_done:
        prior = json.loads(Path(args.skip_done).read_text(encoding="utf-8"))
        skip_ids = {r["id"] for r in prior.get("results", []) if r.get("tier") and not r.get("error")}
        print(f"skipping {len(skip_ids)} questions already resolved in {args.skip_done}", file=sys.stderr)

    out_path = ROOT / args.out
    out = json.loads(out_path.read_text(encoding="utf-8")) if out_path.exists() else {"summary": {}, "results": []}
    by_id = {r["id"]: r for r in out["results"]}

    cost_acc = [0.0]
    t0 = time.time()
    for i, q in enumerate(batch):
        if q["id"] in skip_ids:
            continue
        existing = by_id.get(q["id"])
        if existing and not existing.get("error"):
            print(f"[{args.offset+i+1}/{len(pool)}] {q['id']} already done, skipping", flush=True)
            continue
        print(f"[{args.offset+i+1}/{len(pool)}] {q['id']} ...", flush=True)
        try:
            r = run_pipeline_dual(q, args.codex_model, args.agy_model, args.claude_model, args.timeout, args.verify_timeout, cost_acc)
        except (BackendError, ClaudeError) as e:
            print(f"  FAILED: {e}", file=sys.stderr)
            r = {"id": q["id"], "error": str(e)}
        by_id[q["id"]] = r
        cu, au = r.get("codex_usage", {}), r.get("agy_usage", {})
        codex_tok = cu.get("input_tokens", 0) + cu.get("output_tokens", 0) + cu.get("reasoning_output_tokens", 0)
        agy_tok = au.get("total_tokens", 0) or (au.get("input_tokens", 0) + au.get("output_tokens", 0))
        print(f"  tier={r.get('tier')} predicted={r.get('predicted_answer')} arbitrated={r.get('claude_arbitrated')} "
              f"claude_cost=${r.get('cost_usd', 0):.4f} codex_tok={codex_tok} agy_tok={agy_tok}")
        out["results"] = list(by_id.values())
        out_path.write_text(json.dumps(out, indent=2), encoding="utf-8")

    done = [r for r in out["results"] if not r.get("error")]
    tier_dist = Counter(r.get("tier") for r in done)
    n_arbitrated = sum(1 for r in done if r.get("claude_arbitrated"))
    out["summary"] = {
        "codex_model": args.codex_model,
        "agy_model": args.agy_model,
        "claude_model": args.claude_model,
        "sample_size": len(pool),
        "n_done": len(done),
        "n_failed": sum(1 for r in out["results"] if r.get("error")),
        "n_arbitrated_by_claude": n_arbitrated,
        "agreement_rate": round(1 - n_arbitrated / len(done), 3) if done else None,
        "tier_distribution": dict(tier_dist),
        "total_claude_cost_usd": round(sum(r.get("cost_usd", 0.0) for r in out["results"]), 4),
        "total_codex_tokens": sum(
            r.get("codex_usage", {}).get("input_tokens", 0) + r.get("codex_usage", {}).get("output_tokens", 0)
            + r.get("codex_usage", {}).get("reasoning_output_tokens", 0)
            for r in out["results"]
        ),
        "total_agy_tokens": sum(
            r.get("agy_usage", {}).get("total_tokens", 0)
            or (r.get("agy_usage", {}).get("input_tokens", 0) + r.get("agy_usage", {}).get("output_tokens", 0))
            for r in out["results"]
        ),
        "duration_s": round(time.time() - t0, 1),
    }
    total_agy_tok = out["summary"]["total_agy_tokens"]
    out["summary"]["quota_reference_estimate_UNOFFICIAL"] = {
        "note": "rough reference only -- see GOOGLE_AI_PRO_WEEKLY_TOKEN_ESTIMATE comment in answer_dual.py; not the real account balance",
        "agy_pct_of_google_ai_pro_weekly_estimate": round(100 * total_agy_tok / GOOGLE_AI_PRO_WEEKLY_TOKEN_ESTIMATE, 2),
        "codex_pct_of_pro_weekly": None,
        "codex_note": CODEX_QUOTA_NOTE,
    }
    out_path.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print("\n" + json.dumps(out["summary"], indent=2))
    print(f"\nwritten to {out_path}")
    return out


def cmd_run(args):
    pool = load_dump_sample(args.count, args.seed) if args.count else load_dump_sample(674, args.seed)
    run_batch(pool, args)


def cmd_verify_pool(args):
    """Runs the exact same blind dual-solve/refute/shuffle verification as
    cmd_run, but sourced from an arbitrary JSON pool file instead of the dump
    sample -- used to verify brand-new, originally-authored questions from
    scripts/generate_questions.py. The pool file must be a JSON list of
    {id, question, options, select_n} objects (options is a plain list of
    strings, matching normalize_question's expected shape)."""
    pool = json.loads((ROOT / args.pool).read_text(encoding="utf-8"))
    run_batch(pool, args)


CURRENCY_SYSTEM_PROMPT = (
    "You are an AWS certification content auditor reviewing an SAA-C03 exam "
    "practice question for staleness. Determine whether the scenario, the AWS "
    "services/features it references, and the given correct answer are still "
    "accurate and current per AWS best practices as of 2026. Flag: services or "
    "features that have been deprecated or discontinued, a best practice that "
    "has since been superseded by a newer AWS service or feature (so a "
    "different option would now be the better answer), or terminology AWS no "
    "longer uses. Do not flag stylistic issues, only technical staleness."
)


def currency_schema():
    return {
        "type": "object",
        "properties": {
            "is_current": {"type": "boolean"},
            "concerns": {"type": "array", "items": {"type": "string"}},
            "reasoning": {"type": "string"},
        },
        "required": ["is_current", "concerns", "reasoning"],
    }


def build_currency_prompt(nq, predicted, rationale):
    opts = "\n".join(f"{l}) {t}" for l, t in nq["options"].items())
    return (
        f"{nq['question']}\n\n{opts}\n\n"
        f"Given correct answer: {sorted(predicted)} -- {rationale}\n\n"
        "Is this question's scenario, the AWS services/features it references, "
        "and the given answer still current and correct for the 2026 SAA-C03 exam?"
    )


def cmd_verify_currency(args):
    """Spot-checks already-tiered questions against 2026 AWS best practice --
    a separate concern from tier (which only means 'the answer key is right'),
    since a question can have a provably correct answer while still describing
    a scenario or service that has since gone stale."""
    pool = load_dump_sample(args.count, args.seed) if args.count else load_dump_sample(674, args.seed)
    by_pool_id = {q["id"]: q for q in pool}

    results_path = ROOT / args.results
    all_results = json.loads(results_path.read_text(encoding="utf-8"))["results"]
    candidates = [r for r in all_results if r.get("tier") in ("A", "B", "D") and not r.get("error")]
    if args.sample and args.sample < len(candidates):
        random.seed(args.seed)
        candidates = random.sample(candidates, args.sample)

    out_path = ROOT / args.out
    out = json.loads(out_path.read_text(encoding="utf-8")) if out_path.exists() else {"results": []}
    by_id = {r["id"]: r for r in out["results"]}

    for i, r in enumerate(candidates):
        qid = r["id"]
        existing = by_id.get(qid)
        if existing and not existing.get("error"):
            continue
        q = by_pool_id.get(qid)
        if not q:
            continue
        nq = normalize_question(q)
        rationale = r.get("codex_rationale") or (r.get("claude_verdict") or {}).get("reasoning", "")
        prompt = build_currency_prompt(nq, r["predicted_answer"], rationale)
        print(f"[{i+1}/{len(candidates)}] {qid} ...", flush=True)
        try:
            verdict = call_with_retry(solve_via, "codex", prompt, CURRENCY_SYSTEM_PROMPT, currency_schema(),
                                       args.codex_model, args.agy_model, args.timeout, {})
        except (BackendError, ClaudeError) as e:
            print(f"  FAILED: {e}", file=sys.stderr)
            by_id[qid] = {"id": qid, "error": str(e)}
        else:
            by_id[qid] = {"id": qid, **verdict}
            print(f"  is_current={verdict['is_current']} concerns={verdict['concerns']}")
        out["results"] = list(by_id.values())
        out_path.write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")

    done = [r for r in out["results"] if not r.get("error")]
    stale = [r for r in done if r.get("is_current") is False]
    out["summary"] = {"n_checked": len(done), "n_flagged_stale": len(stale)}
    out_path.write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\n{len(stale)}/{len(done)} flagged as potentially outdated")
    print(f"written to {out_path}")


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)

    p_run = sub.add_parser("run")
    p_run.add_argument("--count", type=int, default=674)
    p_run.add_argument("--seed", type=int, default=7)
    p_run.add_argument("--offset", type=int, default=0)
    p_run.add_argument("--batch-size", type=int, default=0)
    p_run.add_argument("--out", default="scripts/p4-results.json")
    p_run.add_argument("--skip-done", default=None, help="path to an existing results json (e.g. p3-results.json) whose resolved ids should be skipped")
    p_run.add_argument("--codex-model", default=None)
    p_run.add_argument("--agy-model", default="gemini-3.7-flash-high")
    p_run.add_argument("--claude-model", default="sonnet")
    p_run.add_argument("--timeout", type=int, default=120)
    p_run.add_argument("--verify-timeout", type=int, default=180, help="timeout for refute/shuffle-check calls, which need more reasoning than a plain solve")
    p_run.set_defaults(func=cmd_run)

    p_pool = sub.add_parser("verify-pool", help="run the same dual-solve/refute/shuffle verification against a pool of newly-generated (non-dump) questions")
    p_pool.add_argument("--pool", required=True, help="JSON file: list of {id, question, options, select_n}")
    p_pool.add_argument("--offset", type=int, default=0)
    p_pool.add_argument("--batch-size", type=int, default=0)
    p_pool.add_argument("--out", default="scripts/gen-verified.json")
    p_pool.add_argument("--skip-done", default=None)
    p_pool.add_argument("--codex-model", default=None)
    p_pool.add_argument("--agy-model", default="gemini-3.7-flash-high")
    p_pool.add_argument("--claude-model", default="sonnet")
    p_pool.add_argument("--timeout", type=int, default=120)
    p_pool.add_argument("--verify-timeout", type=int, default=180)
    p_pool.set_defaults(func=cmd_verify_pool)

    p_verify = sub.add_parser("verify-currency")
    p_verify.add_argument("--count", type=int, default=674)
    p_verify.add_argument("--seed", type=int, default=7)
    p_verify.add_argument("--results", default="scripts/p4-full-results.json", help="answer-pipeline output to spot-check")
    p_verify.add_argument("--out", default="scripts/currency-check.json")
    p_verify.add_argument("--sample", type=int, default=15, help="0 = check every tiered question")
    p_verify.add_argument("--codex-model", default=None)
    p_verify.add_argument("--agy-model", default="gemini-3.7-flash-high")
    p_verify.add_argument("--timeout", type=int, default=120)
    p_verify.set_defaults(func=cmd_verify_currency)

    args = ap.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
