#!/usr/bin/env python3
"""Stage 5 (final gate) of the original-question pipeline: takes drafts that
passed BOTH blind dual-verification (tier A/B in verify-pool's output) AND the
originality check (not flagged), and appends them to data.js's QUESTION_BANK
in its exact schema.

Defaults to --dry-run (prints what would be added, writes nothing) since this
is new, never-human-reviewed public content -- unlike the ExamTopics dump,
these questions have no track record. Pass --commit once you've read through
the dry-run output and are happy with it.

Usage:
  python scripts/merge_generated.py --drafts scripts/gen-drafts.json \\
      --verified scripts/gen-verified.json --originality scripts/gen-originality.json
  python scripts/merge_generated.py ... --commit
"""
import argparse
import json
import re
import sys
from pathlib import Path

from js_data import load_js_const

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
LETTERS = "ABCD"


def select_accepted(drafts, verified, originality, min_tier):
    tier_rank = {"A": 0, "B": 1, "C": 2, "D": 3}
    verified_by_id = {r["id"]: r for r in verified.get("results", verified) if isinstance(r, dict)}
    orig_by_id = {r["id"]: r for r in originality}

    accepted, rejected = [], []
    for d in drafts:
        v = verified_by_id.get(d["id"])
        o = orig_by_id.get(d["id"])
        if not v or v.get("error"):
            rejected.append((d["id"], "not verified yet or verification errored")); continue
        if tier_rank.get(v.get("tier"), 9) > tier_rank[min_tier]:
            rejected.append((d["id"], f"tier {v.get('tier')} below minimum {min_tier}")); continue
        letter = sorted(v["predicted_answer"])[0]
        verified_index = ord(letter) - ord("A")
        if verified_index != d["correct_index"]:
            rejected.append((d["id"], f"verified answer {letter} disagrees with drafter's claimed correct_index {d['correct_index']}")); continue
        if not o:
            rejected.append((d["id"], "no originality-check result")); continue
        if o.get("flagged"):
            rejected.append((d["id"], f"originality-flagged (similarity {o.get('similarity')} to {o.get('most_similar_dump_id')})")); continue
        accepted.append(d)
    return accepted, rejected


def to_bank_entry(draft, next_num, concept_cat_by_id):
    concept_id = draft["concept_id"]
    return {
        "id": f"gen{next_num}",
        "service_id": concept_id,
        "conceptIds": [concept_id],
        "domain_id": concept_cat_by_id.get(concept_id, concept_id),
        "difficulty": draft.get("difficulty", "Medium"),
        "question_ko": draft["question_ko"],
        "question_en": draft["question_en"],
        "options_ko": draft["options_ko"],
        "options_en": draft["options_en"],
        "answer": draft["correct_index"],
        "explanation_ko": draft["explanation_ko"],
        "explanation_en": draft["explanation_en"],
    }


def render_js_entry(entry, indent="  "):
    def s(v):
        return json.dumps(v, ensure_ascii=False)
    lines = [indent + "{"]
    lines.append(f"{indent}  id: {s(entry['id'])},")
    lines.append(f"{indent}  service_id: {s(entry['service_id'])},")
    lines.append(f"{indent}  conceptIds: {json.dumps(entry['conceptIds'], ensure_ascii=False)},")
    lines.append(f"{indent}  domain_id: {s(entry['domain_id'])},")
    lines.append(f"{indent}  difficulty: {s(entry['difficulty'])},")
    lines.append(f"{indent}  question_ko: {s(entry['question_ko'])},")
    lines.append(f"{indent}  question_en: {s(entry['question_en'])},")
    lines.append(f"{indent}  options_ko: {json.dumps(entry['options_ko'], ensure_ascii=False, indent=2).replace(chr(10), chr(10) + indent + '  ')},")
    lines.append(f"{indent}  options_en: {json.dumps(entry['options_en'], ensure_ascii=False, indent=2).replace(chr(10), chr(10) + indent + '  ')},")
    lines.append(f"{indent}  answer: {entry['answer']},")
    lines.append(f"{indent}  explanation_ko: {s(entry['explanation_ko'])},")
    lines.append(f"{indent}  explanation_en: {s(entry['explanation_en'])}")
    lines.append(indent + "}")
    return "\n".join(lines)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--drafts", default="scripts/gen-drafts.json")
    ap.add_argument("--verified", default="scripts/gen-verified.json")
    ap.add_argument("--originality", default="scripts/gen-originality.json")
    ap.add_argument("--min-tier", choices=["A", "B"], default="A")
    ap.add_argument("--commit", action="store_true", help="actually write into data.js; default is dry-run")
    args = ap.parse_args()

    drafts = json.loads((ROOT / args.drafts).read_text(encoding="utf-8"))
    verified = json.loads((ROOT / args.verified).read_text(encoding="utf-8"))
    originality = json.loads((ROOT / args.originality).read_text(encoding="utf-8"))
    nodes = load_js_const("knowledge.js", "KNOWLEDGE_GRAPH")["nodes"]
    concept_cat_by_id = {n["id"]: n["cat"] for n in nodes}

    accepted, rejected = select_accepted(drafts, verified, originality, args.min_tier)

    print(f"{len(accepted)} accepted, {len(rejected)} rejected")
    for qid, reason in rejected:
        print(f"  REJECT {qid}: {reason}")

    if not accepted:
        print("nothing to merge")
        return

    data_path = ROOT / "data.js"
    text = data_path.read_text(encoding="utf-8")
    m = re.search(r"(const QUESTION_BANK = \[)(.*?)(\n\];)", text, re.S)
    if not m:
        raise RuntimeError("could not locate QUESTION_BANK array in data.js")
    existing_ids = re.findall(r'id:\s*"gen(\d+)"', text)
    next_num = (max((int(n) for n in existing_ids), default=0)) + 1

    entries = []
    for d in accepted:
        entries.append(to_bank_entry(d, next_num, concept_cat_by_id))
        next_num += 1

    rendered = ",\n".join(render_js_entry(e) for e in entries)
    print(f"\n--- {'WILL BE' if args.commit else 'WOULD BE (dry-run)'} appended to data.js ---\n")
    print(rendered[:2000] + ("\n...(truncated)" if len(rendered) > 2000 else ""))

    if not args.commit:
        print("\n(dry-run only -- pass --commit to actually write this into data.js)")
        return

    new_text = text[:m.end(2)] + ",\n" + rendered + text[m.end(2):]
    data_path.write_text(new_text, encoding="utf-8")
    print(f"\n{len(entries)} questions appended to data.js (ids gen{entries[0]['id'][3:]}..gen{entries[-1]['id'][3:]})")


if __name__ == "__main__":
    main()
