#!/usr/bin/env python3
"""
Answer/explanation pipeline for SAA-C03 questions. See docs/answer-pipeline-spec.md
(Stage 0-7, tier rules in section 4). Model backend is the local `claude` CLI in
non-interactive mode (`claude -p`), not the raw Anthropic API -- this runs against
the machine's existing Claude Code login with no separate ANTHROPIC_API_KEY. Each
call is a fresh process, so there is no cross-call prompt-cache reuse and no Batch
API discount; costs will run higher per question than the Batch estimate in the
spec's section 8. Pass a small --model / --limit and check scripts/calibration-results.json
before scaling up.

Stage 2 (doc verification) requires the AWS Documentation MCP server:
  pip install awslabs.aws-documentation-mcp-server

Usage:
  python scripts/answer.py calibrate --limit 3 --model sonnet
  python scripts/answer.py calibrate --model sonnet --out scripts/calibration-results.json
  python scripts/answer.py solve --id dump-604 --model sonnet
"""
import argparse
import json
import random
import re
import shutil
import subprocess
import sys
import time
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LETTERS = "ABCDEFGH"
SELECT_N_WORDS = {"one": 1, "two": 2, "three": 3, "four": 4}

SYSTEM_PROMPT_SOLVE = (
    "You are answering an AWS Certified Solutions Architect - Associate (SAA-C03) "
    "exam question. Read the question and options carefully. Select the option(s) "
    "required by the question and justify your choice using AWS service behavior "
    "you are confident about. If the question says 'choose two' or 'choose three', "
    "you must select exactly that many options. Do not mention that this is a test "
    "or discuss meta-strategy; just solve it as a working solutions architect would."
)
SYSTEM_PROMPT_EXTRACT_CLAIM = (
    "A rationale for an exam answer often bundles one core positive claim about "
    "an AWS service with comparative/elimination reasoning about other options "
    "(e.g. 'X is not a Y' or 'Z requires more setup'). A single AWS documentation "
    "page will rarely state the elimination reasoning explicitly. Extract ONLY "
    "the single core positive factual claim about the winning service's own "
    "capability -- the one sentence that, if true, is what actually makes the "
    "chosen option correct. Drop comparisons to the other options."
)
SYSTEM_PROMPT_VERIFY_MCP = (
    "You are fact-checking a single factual claim about an AWS service. Call "
    "search_documentation at most once, then call read_documentation on at most "
    "the top 2 results it returns -- do not answer from memory alone, but also do "
    "not keep searching or reading further pages once you have those. State "
    "whether the retrieved page text actually supports the claim. Be strict: if "
    "the page does not explicitly support the claim, say so rather than inferring "
    "generously. Quote the supporting sentence in your explanation when "
    "supports=true. Give your verdict immediately after reading -- every extra "
    "tool call costs real money, so do not use more tool calls than the above."
)
SYSTEM_PROMPT_REFUTE = (
    "You are a skeptical AWS technical reviewer whose only job is to find reasons "
    "a proposed exam answer is WRONG. Default to believing the answer is wrong "
    "unless you can find no viable argument against it. Do not be persuaded by the "
    "fact that the answer 'sounds like a best practice' -- check whether it "
    "actually satisfies every explicit requirement stated in the question. If you "
    "are not fully certain the answer is correct, report refuted=true."
)


class ClaudeError(RuntimeError):
    pass


CLAUDE_BIN = shutil.which("claude") or "claude"

# AWS Documentation MCP server (awslabs.aws-documentation-mcp-server, installed via
# pip). Stage 2 is the only stage that gets these tools -- it needs to read real
# doc pages instead of verifying claims from the model's own memory.
AWS_DOCS_MCP_EXE = shutil.which("awslabs.aws-documentation-mcp-server")
AWS_DOCS_MCP_CONFIG = json.dumps({"mcpServers": {"aws-docs": {"command": AWS_DOCS_MCP_EXE, "args": []}}}) if AWS_DOCS_MCP_EXE else None
AWS_DOCS_TOOLS = "mcp__aws-docs__search_documentation,mcp__aws-docs__read_documentation"


def run_claude(prompt, system_prompt, json_schema, model="sonnet", max_budget_usd=0.20, timeout=120, mcp_tools=None):
    # Prompt goes over stdin, not argv: on Windows, claude.CMD is an npm/cmd.exe
    # shim that truncates any argv element containing a literal newline at the
    # first newline (silently -- no error, just a shortened prompt), which made
    # every multi-line question/rationale/doc-text prompt arrive at the model
    # cut down to its first line. stdin passes the string through intact.
    if mcp_tools:
        if not AWS_DOCS_MCP_CONFIG:
            raise ClaudeError("mcp_tools requested but awslabs.aws-documentation-mcp-server is not installed (pip install awslabs.aws-documentation-mcp-server)")
        tool_flags = ["--tools", mcp_tools, "--allowedTools", mcp_tools,
                      "--strict-mcp-config", "--mcp-config", AWS_DOCS_MCP_CONFIG]
        timeout = max(timeout, 180)  # tool-use turns (search + read) take longer than a single completion
    else:
        tool_flags = ["--tools", "", "--strict-mcp-config", "--mcp-config", '{"mcpServers":{}}']
    cmd = [
        CLAUDE_BIN, "-p", "--model", model, *tool_flags,
        "--system-prompt", system_prompt,
        "--output-format", "json",
        "--json-schema", json.dumps(json_schema),
        "--max-budget-usd", str(max_budget_usd),
    ]
    proc = subprocess.run(cmd, input=prompt, capture_output=True, text=True, encoding="utf-8", errors="replace",
                           timeout=timeout, creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0))
    if proc.returncode != 0:
        raise ClaudeError(f"claude CLI exit {proc.returncode}: stderr={proc.stderr[:500]!r} stdout={proc.stdout[:500]!r}")
    data = json.loads(proc.stdout)
    if data.get("is_error"):
        raise ClaudeError(f"claude CLI error: {data.get('result')}")
    out = data.get("structured_output")
    if out is None:
        raise ClaudeError(f"no structured_output in response: {data.get('result')!r}")
    return out, data.get("total_cost_usd", 0.0)


# ---------------------------------------------------------------- Stage 0 ---

def detect_select_n(question_text, explicit_n=None):
    if explicit_n:
        return explicit_n
    m = re.search(r"(choose|select)\s+(one|two|three|four|\d+)", question_text, re.I)
    if not m:
        return 1
    word = m.group(2).lower()
    return SELECT_N_WORDS.get(word, int(word) if word.isdigit() else 1)


def normalize_question(q):
    options = q["options"]
    letters = list(LETTERS[: len(options)])
    return {
        "id": q["id"],
        "question": q["question"],
        "letters": letters,
        "options": dict(zip(letters, options)),
        "select_n": detect_select_n(q["question"], q.get("select_n")),
    }


# ---------------------------------------------------------------- Stage 1 ---

def solve_schema(letters, n):
    return {
        "type": "object",
        "properties": {
            "answer": {"type": "array", "items": {"type": "string", "enum": letters}, "minItems": n, "maxItems": n},
            "rationale": {"type": "string"},
        },
        "required": ["answer", "rationale"],
    }


def build_solve_prompt(nq):
    opts = "\n".join(f"{l}) {t}" for l, t in nq["options"].items())
    n = nq["select_n"]
    plural = "option" if n == 1 else f"exactly {n} options"
    return f"{nq['question']}\n\n{opts}\n\nSelect {plural}. Respond with the letter(s) and a 2-4 sentence rationale."


def stage1_solve(nq, n_votes, model, cost_acc):
    prompt = build_solve_prompt(nq)
    schema = solve_schema(nq["letters"], nq["select_n"])
    votes = []
    for _ in range(n_votes):
        try:
            out, cost = run_claude(prompt, SYSTEM_PROMPT_SOLVE, schema, model=model)
        except ClaudeError:
            continue  # one flaky vote shouldn't cost the other (already-paid-for) votes
        cost_acc[0] += cost
        votes.append({"answer": frozenset(out["answer"]), "rationale": out["rationale"]})
    return votes


def tally(votes):
    counts = Counter(v["answer"] for v in votes)
    ranked = counts.most_common()
    return ranked  # [(frozenset, count), ...] descending


# ---------------------------------------------------------------- Stage 2 ---

def stage2_verify(nq, rationale, model, cost_acc):
    claim_prompt = f"Rationale: {rationale}\n\nContext question: {nq['question']}"
    claim_schema = {"type": "object", "properties": {"core_claim": {"type": "string"}}, "required": ["core_claim"]}
    try:
        out, cost = run_claude(claim_prompt, SYSTEM_PROMPT_EXTRACT_CLAIM, claim_schema, model=model)
    except ClaudeError as e:
        # No claim to verify -- skip the (expensive) MCP call rather than crash the
        # whole question; decide_tier treats doc_verified=False conservatively.
        return {"url": None, "core_claim": None, "fetched": False, "supports": False, "error": str(e)}
    cost_acc[0] += cost
    core_claim = out["core_claim"].strip()

    verify_prompt = f"Claim: {core_claim}"
    verify_schema = {
        "type": "object",
        "properties": {
            "supports": {"type": "boolean"},
            "explanation": {"type": "string"},
            "url_used": {"type": "string"},
        },
        "required": ["supports", "explanation", "url_used"],
    }
    try:
        out, cost = run_claude(verify_prompt, SYSTEM_PROMPT_VERIFY_MCP, verify_schema, model=model, mcp_tools=AWS_DOCS_TOOLS)
    except ClaudeError as e:
        return {"url": None, "core_claim": core_claim, "fetched": False, "supports": False, "error": str(e)}
    cost_acc[0] += cost
    return {
        "url": out.get("url_used"),
        "core_claim": core_claim,
        "fetched": True,
        "supports": out["supports"],
        "explanation": out["explanation"],
    }


# ---------------------------------------------------------------- Stage 3 ---

def stage3_refute(nq, candidate_letters, rationale, model, cost_acc):
    opts_text = ", ".join(f"{l}) {nq['options'][l]}" for l in candidate_letters)
    prompt = (
        f"Question: {nq['question']}\n\nProposed answer: {opts_text}\n\n"
        f"Proposed rationale: {rationale}\n\nArgue whether this answer is WRONG."
    )
    schema = {
        "type": "object",
        "properties": {"refuted": {"type": "boolean"}, "reasoning": {"type": "string"}},
        "required": ["refuted", "reasoning"],
    }
    try:
        out, cost = run_claude(prompt, SYSTEM_PROMPT_REFUTE, schema, model=model)
    except ClaudeError as e:
        # Conservative fallback matches this stage's own "default to refuted" policy
        # instead of discarding every already-completed stage for this question.
        return {"refuted": True, "reasoning": f"refutation call failed, defaulting to refuted: {e}"}
    cost_acc[0] += cost
    return out


# ---------------------------------------------------------------- Stage 4 ---

def stage4_shuffle_check(nq, top_candidate, model, cost_acc):
    original_letters = nq["letters"]
    shuffled_order = original_letters[:]
    random.shuffle(shuffled_order)
    new_letters = list(LETTERS[: len(original_letters)])
    new_to_old = dict(zip(new_letters, shuffled_order))
    shuffled_nq = {
        "id": nq["id"] + "-shuffled",
        "question": nq["question"],
        "letters": new_letters,
        "options": {nl: nq["options"][ol] for nl, ol in new_to_old.items()},
        "select_n": nq["select_n"],
    }
    votes = stage1_solve(shuffled_nq, 1, model, cost_acc)
    if not votes:
        return False, top_candidate  # couldn't run the check -- treat as non-invariant, matches decide_tier's conservative C-downgrade
    mapped_back = frozenset(new_to_old[l] for l in votes[0]["answer"])
    return mapped_back == top_candidate, mapped_back


# ---------------------------------------------------------------- Stage 5 ---

def decide_tier(top_count, doc_verified, refutation_map, shuffle_invariant, top_candidate, n_options):
    """Pure/deterministic per docs/answer-pipeline-spec.md section 4. refutation_map
    is {frozenset(letters): bool} for every candidate actually tested in Stage 3."""
    tested = refutation_map
    if tested and len(tested) >= n_options and all(tested.values()):
        return "D", "refutation succeeded against every option tested"
    if tested.get(top_candidate, False):
        return "C", "top candidate failed adversarial refutation"
    if not shuffle_invariant:
        return "C", "answer changed when option order was shuffled"
    if top_count == 5 and doc_verified:
        return "A", "unanimous + doc-verified + refutation failed + shuffle-invariant"
    if top_count in (3, 4) and doc_verified:
        return "B", f"{top_count}/5 majority + doc-verified + shuffle-invariant"
    return "C", f"vote split ({top_count}/5) or no doc verification"


# --------------------------------------------------------------- Orchestrator

def run_pipeline(question, model="sonnet", n_votes=5, refute_escalate=True, verbose=False):
    cost_acc = [0.0]
    nq = normalize_question(question)

    try:
        return _run_pipeline_inner(nq, model, n_votes, refute_escalate, verbose, cost_acc)
    except ClaudeError as e:
        # Every individual stage already degrades conservatively instead of raising;
        # if something still gets here, at least keep the cost already spent visible
        # instead of letting the caller's retry silently re-pay for completed stages.
        return {"id": nq["id"], "error": str(e), "cost_usd": round(cost_acc[0], 4)}


def _run_pipeline_inner(nq, model, n_votes, refute_escalate, verbose, cost_acc):
    votes = stage1_solve(nq, n_votes, model, cost_acc)
    if not votes:
        raise ClaudeError("all stage1 votes failed")
    ranked = tally(votes)
    top_candidate, top_count = ranked[0]
    top_rationale = next(v["rationale"] for v in votes if v["answer"] == top_candidate)
    if verbose:
        print(f"  [{nq['id']}] stage1 votes: {[(sorted(c), n) for c, n in ranked]}")

    doc = stage2_verify(nq, top_rationale, model, cost_acc)
    doc_verified = doc["fetched"] and doc["supports"]

    refutation_map = {}
    to_test = [c for c, _ in ranked[:2]]
    for cand in to_test:
        r = stage3_refute(nq, sorted(cand), top_rationale if cand == top_candidate else "(alternate candidate)", model, cost_acc)
        refutation_map[cand] = r["refuted"]

    if refute_escalate and refutation_map.get(top_candidate) and all(refutation_map.values()):
        remaining = [frozenset([l]) for l in nq["letters"]] if nq["select_n"] == 1 else []
        for cand in remaining:
            if cand in refutation_map:
                continue
            r = stage3_refute(nq, sorted(cand), "(escalation: exhaustive refutation check)", model, cost_acc)
            refutation_map[cand] = r["refuted"]

    shuffle_invariant, shuffle_answer = stage4_shuffle_check(nq, top_candidate, model, cost_acc)

    tier, tier_reason = decide_tier(top_count, doc_verified, refutation_map, shuffle_invariant, top_candidate, len(nq["letters"]))

    return {
        "id": nq["id"],
        "predicted_answer": sorted(top_candidate),
        "vote_distribution": [(sorted(c), n) for c, n in ranked],
        "doc_source": doc,
        "refutation_map": {",".join(sorted(k)): v for k, v in refutation_map.items()},
        "shuffle_invariant": shuffle_invariant,
        "shuffle_answer": sorted(shuffle_answer),
        "tier": tier,
        "tier_reason": tier_reason,
        "rationale": top_rationale,
        "cost_usd": round(cost_acc[0], 4),
    }


# ------------------------------------------------------------------- CLI ---

def load_dump_sample(n, seed):
    text = (ROOT / "dump.js").read_text(encoding="utf-8")
    m = re.search(r"const SAA_DUMP\s*=\s*(\[.*\]);?\s*$", text, re.S)
    all_q = json.loads(m.group(1))
    non_exhibit = [q for q in all_q if not q.get("exhibit")]  # pipeline has no image input yet
    rng = random.Random(seed)
    sample = rng.sample(non_exhibit, n)
    sample.sort(key=lambda q: q["id"])
    return [{"id": q["id"], "question": q["stem"], "options": q["options"], "select_n": q["select"]} for q in sample]


def cmd_p2run(args):
    pool = load_dump_sample(args.count, args.seed)
    batch = pool[args.offset: args.offset + args.batch_size]
    if not batch:
        print(f"nothing to do: offset {args.offset} is past the {len(pool)}-question sample", file=sys.stderr)
        sys.exit(1)

    out_path = ROOT / args.out
    out = json.loads(out_path.read_text(encoding="utf-8")) if out_path.exists() else {"summary": {}, "results": []}
    by_id = {r["id"]: r for r in out["results"]}

    for i, q in enumerate(batch):
        existing = by_id.get(q["id"])
        if existing and not existing.get("error"):
            print(f"[{args.offset+i+1}/{len(pool)}] {q['id']} already done, skipping", flush=True)
            continue
        print(f"[{args.offset+i+1}/{len(pool)}] {q['id']} ...", flush=True)
        try:
            r = run_pipeline(q, model=args.model, verbose=args.verbose)
        except ClaudeError as e:
            print(f"  FAILED: {e}", file=sys.stderr)
            r = {"id": q["id"], "error": str(e)}
        by_id[q["id"]] = r
        print(f"  tier={r.get('tier')} predicted={r.get('predicted_answer')} cost=${r.get('cost_usd', 0):.3f}")
        out["results"] = list(by_id.values())
        out_path.write_text(json.dumps(out, indent=2), encoding="utf-8")  # persist after every question

    done = [r for r in out["results"] if not r.get("error")]
    tier_dist = Counter(r.get("tier") for r in done)
    out["summary"] = {
        "model": args.model,
        "sample_size": len(pool),
        "n_done": len(done),
        "n_failed": sum(1 for r in out["results"] if r.get("error")),
        "tier_distribution": dict(tier_dist),
        "tier_distribution_pct": {k: round(v / len(done), 3) for k, v in tier_dist.items()} if done else {},
        # sum over ALL results, not just `done` -- a failed question can still have
        # burned real money in the stages that completed before it errored out.
        "total_cost_usd": round(sum(r.get("cost_usd", 0.0) for r in out["results"]), 3),
    }
    out_path.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print("\n" + json.dumps(out["summary"], indent=2))
    print(f"\nwritten to {out_path}")


def cmd_solve(args):
    calib = json.loads((ROOT / "scripts/calibration-set.json").read_text(encoding="utf-8"))
    all_q = calib["questions"] + calib["tier_checks"]
    q = next((x for x in all_q if x["id"] == args.id), None)
    if not q:
        print(f"no question with id {args.id}", file=sys.stderr)
        sys.exit(1)
    result = run_pipeline(q, model=args.model, verbose=True)
    print(json.dumps(result, indent=2))


def cmd_calibrate(args):
    calib = json.loads((ROOT / "scripts/calibration-set.json").read_text(encoding="utf-8"))
    scored = calib["questions"]
    checks = calib["tier_checks"]
    if args.limit:
        scored = scored[: args.limit]
        checks = checks[: max(0, args.limit - len(scored))]

    results = []
    total_cost = 0.0
    t0 = time.time()
    for i, q in enumerate(scored):
        print(f"[{i+1}/{len(scored)}] {q['id']} ...", flush=True)
        try:
            r = run_pipeline(q, model=args.model, verbose=args.verbose)
        except ClaudeError as e:
            print(f"  FAILED: {e}", file=sys.stderr)
            r = {"id": q["id"], "error": str(e)}
        r["correct_answer"] = q["correct_answer"] if "correct_answer" in q else None
        r["correct_letters"] = sorted(LETTERS[i] for i in q["correct_answer"]) if "correct_answer" in q else None
        r["is_correct"] = (r.get("predicted_answer") == r["correct_letters"]) if r.get("predicted_answer") else None
        total_cost += r.get("cost_usd", 0.0)
        results.append(r)
        print(f"  tier={r.get('tier')} predicted={r.get('predicted_answer')} correct={r.get('correct_letters')} match={r.get('is_correct')} cost=${r.get('cost_usd',0):.3f}")

    tier_check_results = []
    for q in checks:
        print(f"[tier-check] {q['id']} ...", flush=True)
        try:
            r = run_pipeline(q, model=args.model, verbose=args.verbose)
        except ClaudeError as e:
            print(f"  FAILED: {e}", file=sys.stderr)
            r = {"id": q["id"], "error": str(e)}
        r["expected_tier"] = q["expected_tier"]
        r["tier_matches_expectation"] = r.get("tier") == q["expected_tier"]
        total_cost += r.get("cost_usd", 0.0)
        tier_check_results.append(r)
        print(f"  predicted_tier={r.get('tier')} expected={q['expected_tier']} match={r.get('tier_matches_expectation')}")

    tier_a = [r for r in results if r.get("tier") == "A"]
    tier_a_correct = [r for r in tier_a if r.get("is_correct")]
    tier_a_accuracy = (len(tier_a_correct) / len(tier_a)) if tier_a else None

    if tier_a_accuracy is None:
        gate = "NO_TIER_A_PREDICTIONS"
    elif tier_a_accuracy >= 0.97:
        gate = "PASS_SHIP_AS_CONFIRMED"
    elif tier_a_accuracy >= 0.90:
        gate = "PASS_DEMOTE_TO_LIKELY"
    else:
        gate = "FAIL_BLOCK_FULL_RUN"

    tier_dist = Counter(r.get("tier") for r in results)
    overall_correct = sum(1 for r in results if r.get("is_correct"))

    summary = {
        "model": args.model,
        "n_questions": len(results),
        "n_tier_checks": len(tier_check_results),
        "tier_distribution": dict(tier_dist),
        "overall_accuracy": round(overall_correct / len(results), 4) if results else None,
        "tier_a_count": len(tier_a),
        "tier_a_accuracy": round(tier_a_accuracy, 4) if tier_a_accuracy is not None else None,
        "gate_result": gate,
        "tier_check_matches": sum(1 for r in tier_check_results if r.get("tier_matches_expectation")),
        "tier_check_total": len(tier_check_results),
        "total_cost_usd": round(total_cost, 3),
        "duration_s": round(time.time() - t0, 1),
    }

    out = {"summary": summary, "results": results, "tier_check_results": tier_check_results}
    out_path = ROOT / args.out
    out_path.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print("\n" + json.dumps(summary, indent=2))
    print(f"\nwritten to {out_path}")


def cmd_resume(args):
    calib = json.loads((ROOT / "scripts/calibration-set.json").read_text(encoding="utf-8"))
    by_id = {q["id"]: q for q in calib["questions"] + calib["tier_checks"]}
    results_path = ROOT / args.results
    out = json.loads(results_path.read_text(encoding="utf-8"))

    def redo(entry, is_check):
        q = by_id[entry["id"]]
        print(f"[resume] {entry['id']} ...", flush=True)
        try:
            r = run_pipeline(q, model=args.model, verbose=args.verbose)
        except ClaudeError as e:
            print(f"  FAILED again: {e}", file=sys.stderr)
            r = {"id": q["id"], "error": str(e)}
        if is_check:
            r["expected_tier"] = q["expected_tier"]
            r["tier_matches_expectation"] = r.get("tier") == q["expected_tier"]
        else:
            r["correct_answer"] = q.get("correct_answer")
            r["correct_letters"] = sorted(LETTERS[i] for i in q["correct_answer"])
            r["is_correct"] = (r.get("predicted_answer") == r["correct_letters"]) if r.get("predicted_answer") else None
        return r

    out["results"] = [redo(r, False) if r.get("error") or not r.get("tier") else r for r in out["results"]]
    out["tier_check_results"] = [redo(r, True) if r.get("error") or not r.get("tier") else r for r in out["tier_check_results"]]

    results, checks = out["results"], out["tier_check_results"]
    tier_a = [r for r in results if r.get("tier") == "A"]
    tier_a_correct = [r for r in tier_a if r.get("is_correct")]
    tier_a_accuracy = (len(tier_a_correct) / len(tier_a)) if tier_a else None
    if tier_a_accuracy is None:
        gate = "NO_TIER_A_PREDICTIONS"
    elif tier_a_accuracy >= 0.97:
        gate = "PASS_SHIP_AS_CONFIRMED"
    elif tier_a_accuracy >= 0.90:
        gate = "PASS_DEMOTE_TO_LIKELY"
    else:
        gate = "FAIL_BLOCK_FULL_RUN"

    total_cost = sum(r.get("cost_usd", 0.0) for r in results + checks)
    out["summary"] = {
        **out["summary"],
        "tier_distribution": dict(Counter(r.get("tier") for r in results)),
        "overall_accuracy": round(sum(1 for r in results if r.get("is_correct")) / len(results), 4) if results else None,
        "tier_a_count": len(tier_a),
        "tier_a_accuracy": round(tier_a_accuracy, 4) if tier_a_accuracy is not None else None,
        "gate_result": gate,
        "tier_check_matches": sum(1 for r in checks if r.get("tier_matches_expectation")),
        "tier_check_total": len(checks),
        "total_cost_usd": round(total_cost, 3),
        "n_failed": sum(1 for r in results + checks if r.get("error")),
    }
    results_path.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print("\n" + json.dumps(out["summary"], indent=2))
    print(f"\nwritten to {results_path}")


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)

    p_solve = sub.add_parser("solve")
    p_solve.add_argument("--id", required=True)
    p_solve.add_argument("--model", default="sonnet")
    p_solve.set_defaults(func=cmd_solve)

    p_cal = sub.add_parser("calibrate")
    p_cal.add_argument("--model", default="sonnet")
    p_cal.add_argument("--limit", type=int, default=0)
    p_cal.add_argument("--out", default="scripts/calibration-results.json")
    p_cal.add_argument("--verbose", action="store_true")
    p_cal.set_defaults(func=cmd_calibrate)

    p_resume = sub.add_parser("resume")
    p_resume.add_argument("--model", default="sonnet")
    p_resume.add_argument("--results", default="scripts/calibration-results.json")
    p_resume.add_argument("--verbose", action="store_true")
    p_resume.set_defaults(func=cmd_resume)

    p_p2 = sub.add_parser("p2run")
    p_p2.add_argument("--count", type=int, default=100, help="total sample size drawn from dump.js")
    p_p2.add_argument("--seed", type=int, default=42, help="RNG seed; keep fixed across batches of the same run")
    p_p2.add_argument("--offset", type=int, default=0, help="start index into the sample for this batch")
    p_p2.add_argument("--batch-size", type=int, default=25)
    p_p2.add_argument("--model", default="sonnet")
    p_p2.add_argument("--out", default="scripts/p2-results.json")
    p_p2.add_argument("--verbose", action="store_true")
    p_p2.set_defaults(func=cmd_p2run)

    args = ap.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
