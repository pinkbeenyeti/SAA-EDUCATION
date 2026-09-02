#!/usr/bin/env python3
"""Drafts brand-new, ORIGINAL SAA-C03 practice questions for a target concept.

This is stage 1 of the original-question pipeline (see scripts/plan_generation.py
for stage 0, which concept to target; scripts/answer_dual.py's `verify-pool` for
stage 2, blind dual verification; scripts/check_originality.py for stage 3, the
anti-plagiarism gate). It NEVER reads dump.js -- the only grounding material it
gives the drafting backend is this project's own hand-authored, already-vetted
concepts.js content (summary/desc/points/pattern), which is original prose about
what the AWS concept IS, not a reworded exam question.

The drafting model is explicitly instructed to invent its own scenario from
scratch and never reproduce a memorized real exam question. That instruction
alone is not a legal guarantee (the model may have seen ExamTopics-style
questions during training) -- scripts/check_originality.py is the actual
safety net, run downstream against every draft before it is ever shown to a
human or considered for merging into data.js.

Usage:
  python scripts/generate_questions.py --concept ec2 --count 5 --out scripts/gen-drafts.json
  python scripts/generate_questions.py --plan scripts/gen-plan.json --top 5 --per-concept 3 --out scripts/gen-drafts.json
"""
import argparse
import json
import random
from pathlib import Path

from js_data import load_js_const
from backends import run_codex, run_agy, BackendError

ROOT = Path(__file__).resolve().parent.parent

SCENARIO_FLAVORS = [
    "a healthcare records startup", "a regional airline's booking platform",
    "a mobile game studio", "a university's online learning portal",
    "a logistics company tracking shipments", "a retail chain's inventory system",
    "a fintech company processing payments", "a media company streaming video",
    "a manufacturing IoT sensor network", "a government agency's public records site",
    "a SaaS analytics dashboard vendor", "a food delivery marketplace",
    "an insurance claims processing system", "a real-estate listing platform",
    "a renewable-energy monitoring company",
]

DRAFT_SYSTEM_PROMPT = (
    "You are an experienced AWS Certified Solutions Architect - Associate "
    "(SAA-C03) exam item writer. Write exactly ONE brand-new, ORIGINAL "
    "multiple-choice practice question that tests the given AWS concept. "
    "You must invent your own fictional scenario, company, and numbers from "
    "scratch. Do not reproduce, closely paraphrase, or reference any specific "
    "real exam question you may recall from training data (including ones "
    "from ExamTopics or other exam-dump sites) -- write something genuinely "
    "new that merely exercises the same underlying AWS knowledge. The "
    "question must have EXACTLY 4 options and EXACTLY ONE correct answer "
    "(never 'select two/three'). Put the correct answer at a RANDOM option "
    "position, not always the same index. Write natural, fluent Korean and "
    "English versions of everything (not a literal machine translation of "
    "each other) in the realistic SAA-C03 scenario style: a short paragraph "
    "describing a company's requirement, then a question asking for the best "
    "solution."
)


def draft_schema():
    return {
        "type": "object",
        "properties": {
            "question_ko": {"type": "string"},
            "question_en": {"type": "string"},
            "options_ko": {"type": "array", "items": {"type": "string"}, "minItems": 4, "maxItems": 4},
            "options_en": {"type": "array", "items": {"type": "string"}, "minItems": 4, "maxItems": 4},
            "correct_index": {"type": "integer", "minimum": 0, "maximum": 3},
            "explanation_ko": {"type": "string"},
            "explanation_en": {"type": "string"},
            "difficulty": {"type": "string", "enum": ["Easy", "Medium", "Hard"]},
        },
        "required": ["question_ko", "question_en", "options_ko", "options_en",
                     "correct_index", "explanation_ko", "explanation_en", "difficulty"],
    }


def build_draft_prompt(concept_id, concept, flavor, avoid_repeats):
    points_text = "\n".join(f"- {p['en']}: {p['body_en']}" for p in concept.get("points", []))
    pattern = concept.get("pattern_en", "")
    avoid = ""
    if avoid_repeats:
        avoid = ("\n\nAlready-used scenario premises for this concept in this batch -- use a "
                  "DIFFERENT angle/requirement than these:\n" + "\n".join(f"- {a}" for a in avoid_repeats))
    return (
        f"Target AWS concept: {concept_id}\n"
        f"Summary: {concept.get('summary_en', '')}\n"
        f"Explanation: {concept.get('desc_en', '')}\n"
        f"Key exam-relevant facts:\n{points_text}\n"
        + (f"Canonical pattern: {pattern}\n" if pattern else "")
        + f"\nWrite the scenario around: {flavor}."
        + avoid
    )


def reshuffle_options(draft):
    """The drafting model is asked to place the correct answer at a random
    index, but in practice tends to default to the same position batch after
    batch (observed: index 2 three times in a row) -- that's a real flaw if
    left uncorrected, since a large enough bank would let someone guess from
    option position alone. Don't rely on the model's cooperation: shuffle the
    options ourselves and remap correct_index deterministically in code."""
    order = list(range(4))
    random.shuffle(order)
    old_correct = draft["correct_index"]
    draft["options_en"] = [draft["options_en"][i] for i in order]
    draft["options_ko"] = [draft["options_ko"][i] for i in order]
    draft["correct_index"] = order.index(old_correct)
    return draft


def draft_one(concept_id, concept, flavor, avoid_repeats, backend, codex_model, agy_model, timeout):
    prompt = build_draft_prompt(concept_id, concept, flavor, avoid_repeats)
    if backend == "codex":
        out, _usage = run_codex(prompt, DRAFT_SYSTEM_PROMPT, draft_schema(), model=codex_model, timeout=timeout)
    else:
        out, _usage = run_agy(prompt, DRAFT_SYSTEM_PROMPT, draft_schema(), model=agy_model, timeout=timeout)
    return reshuffle_options(out)


def draft_for_concept(concept_id, concept, count, backend, codex_model, agy_model, timeout, start_index=1):
    drafts = []
    used_flavors = []
    for i in range(count):
        flavor = SCENARIO_FLAVORS[(start_index - 1 + i) % len(SCENARIO_FLAVORS)]
        avoid = [d["question_en"][:120] for d in drafts]
        print(f"  [{concept_id}] drafting {i+1}/{count} (flavor: {flavor}) ...", flush=True)
        try:
            draft = draft_one(concept_id, concept, flavor, avoid, backend, codex_model, agy_model, timeout)
        except BackendError as e:
            print(f"    FAILED: {e}")
            continue
        idx = start_index + i
        draft["id"] = f"gen-{concept_id}-{idx:04d}"
        draft["concept_id"] = concept_id
        drafts.append(draft)
    return drafts


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--concept", help="single concept id to draft for (e.g. ec2)")
    ap.add_argument("--plan", help="scripts/gen-plan.json from plan_generation.py -- draft for the top-N gapped concepts instead of one")
    ap.add_argument("--top", type=int, default=5, help="with --plan: how many top-priority concepts to draft for")
    ap.add_argument("--per-concept", type=int, default=0, help="with --plan: fixed drafts per concept; 0 (default) = use each concept's own gap from the plan, capped by --cap")
    ap.add_argument("--cap", type=int, default=5, help="with --plan and --per-concept 0: max drafts for any single concept regardless of its gap")
    ap.add_argument("--count", type=int, default=5, help="with --concept: how many drafts for that one concept")
    ap.add_argument("--backend", choices=["codex", "agy"], default="agy")
    ap.add_argument("--codex-model", default=None)
    ap.add_argument("--agy-model", default="gemini-3.7-flash-high")
    ap.add_argument("--timeout", type=int, default=120)
    ap.add_argument("--out", default="scripts/gen-drafts.json")
    args = ap.parse_args()

    concepts = load_js_const("concepts.js", "CONCEPT_DETAIL")

    targets = []
    if args.plan:
        plan = json.loads((ROOT / args.plan).read_text(encoding="utf-8"))
        gapped = [p for p in plan if p["gap"] > 0][: args.top]
        if args.per_concept > 0:
            targets = [(p["id"], args.per_concept) for p in gapped]
        else:
            targets = [(p["id"], min(p["gap"], args.cap)) for p in gapped]
    elif args.concept:
        targets = [(args.concept, args.count)]
    else:
        ap.error("pass either --concept or --plan")

    out_path = ROOT / args.out
    existing = json.loads(out_path.read_text(encoding="utf-8")) if out_path.exists() else []
    existing_by_concept_max = {}
    for d in existing:
        cid = d.get("concept_id")
        n = int(d["id"].rsplit("-", 1)[-1]) if cid else 0
        existing_by_concept_max[cid] = max(existing_by_concept_max.get(cid, 0), n)

    all_drafts = list(existing)
    for concept_id, count in targets:
        concept = concepts.get(concept_id)
        if not concept:
            print(f"skip: no concepts.js entry for '{concept_id}'")
            continue
        start_index = existing_by_concept_max.get(concept_id, 0) + 1
        drafts = draft_for_concept(concept_id, concept, count, args.backend,
                                    args.codex_model, args.agy_model, args.timeout, start_index)
        all_drafts.extend(drafts)
        out_path.write_text(json.dumps(all_drafts, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"\n{len(all_drafts) - len(existing)} new drafts added, {len(all_drafts)} total")
    print(f"written to {out_path}")


if __name__ == "__main__":
    main()
