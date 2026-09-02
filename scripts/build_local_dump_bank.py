#!/usr/bin/env python3
"""Merges dump.js (raw ExamTopics questions) with the answer_dual.py pipeline's
verified answers (p3-results.json, p4-full-results.json) into dump-answered.js
-- a LOCAL-ONLY practice bank in the same schema as data.js's QUESTION_BANK,
so it plugs straight into the existing Exam Simulator and concept-question
modal with zero UI changes.

dump-answered.js is gitignored, same as dump.js/dump-ko.js/the source PDF: the
question text is still ExamTopics' copyrighted dump, just with an answer key
now attached, so it must never be shipped in the public site or committed.
This is strictly a local study/QA aid. Re-run any time p3/p4 results change.

Only single-answer (select == 1), non-exhibit, tier A/B (high-confidence)
questions are included -- the live Exam Simulator engine only supports a
single correct-answer index, and tier C/D questions are ambiguous or likely
defective, not fit for practice.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def load_dump():
    text = (ROOT / "dump.js").read_text(encoding="utf-8")
    m = re.search(r"const SAA_DUMP\s*=\s*(\[.*\]);?\s*$", text, re.S)
    return {q["id"]: q for q in json.loads(m.group(1))}


def load_knowledge_graph():
    text = (ROOT / "knowledge.js").read_text(encoding="utf-8")
    m = re.search(r"const KNOWLEDGE_GRAPH\s*=\s*(\{.*\});", text, re.S)
    kg = json.loads(m.group(1))
    concept_ids_by_num = {}
    for node in kg["nodes"]:
        for num in node["qs"]:
            concept_ids_by_num.setdefault(num, []).append(node["id"])
    return concept_ids_by_num


def load_results(*paths):
    """Later paths win on id collisions; both are non-overlapping by
    construction (p4 was run with --skip-done p3-results.json)."""
    merged = {}
    for p in paths:
        path = ROOT / p
        if not path.exists():
            continue
        for r in json.loads(path.read_text(encoding="utf-8")).get("results", []):
            if r.get("tier") and not r.get("error"):
                merged[r["id"]] = r
    return merged


def best_rationale(r):
    verdict = r.get("claude_verdict")
    if verdict and verdict.get("reasoning"):
        return verdict["reasoning"]
    return r.get("codex_rationale") or r.get("agy_rationale") or ""


def main():
    dump = load_dump()
    concept_ids_by_num = load_knowledge_graph()
    results = load_results("scripts/p3-results.json", "scripts/p4-full-results.json")

    bank = []
    skipped_multi = skipped_tier = 0
    for qid, r in results.items():
        q = dump.get(qid)
        if not q or q.get("exhibit"):
            continue
        if q["select"] != 1:
            skipped_multi += 1
            continue
        if r["tier"] not in ("A", "B"):
            skipped_tier += 1
            continue
        letter = sorted(r["predicted_answer"])[0]
        answer_idx = ord(letter) - ord("A")
        if not (0 <= answer_idx < len(q["options"])):
            continue
        rationale = best_rationale(r)
        bank.append({
            "id": qid,
            "conceptIds": concept_ids_by_num.get(q["num"], []),
            "difficulty": "Medium",
            "question_ko": q["stem"],
            "question_en": q["stem"],
            "options_ko": q["options"],
            "options_en": q["options"],
            "answer": answer_idx,
            "explanation_ko": rationale,
            "explanation_en": rationale,
            "_tier": r["tier"],
        })

    bank.sort(key=lambda x: x["id"])
    out_path = ROOT / "dump-answered.js"
    header = (
        "/**\n"
        " * LOCAL-ONLY practice bank: ExamTopics dump questions + this project's\n"
        " * own AI-verified answer key (Codex + Antigravity cross-model agreement,\n"
        " * refutation, shuffle-invariance -- see scripts/answer_dual.py).\n"
        " *\n"
        " * Gitignored on purpose -- do not ship this in the public site. The\n"
        " * question text is still ExamTopics' copyrighted dump; only the answer\n"
        " * key and explanations are ours. Regenerate with\n"
        " * scripts/build_local_dump_bank.py whenever p3/p4-results.json change.\n"
        " *\n"
        " * Note: no Korean translation is available for these (dump-ko.js was\n"
        " * lost), so question_ko/options_ko fall back to the English original.\n"
        " */\n"
    )
    with out_path.open("w", encoding="utf-8") as f:
        f.write(header)
        f.write("const LOCAL_DUMP_BANK = ")
        json.dump(bank, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")

    print(f"included: {len(bank)}")
    print(f"skipped (multi-select): {skipped_multi}")
    print(f"skipped (tier C/D): {skipped_tier}")
    tiers = {}
    for b in bank:
        tiers[b["_tier"]] = tiers.get(b["_tier"], 0) + 1
    print("tier breakdown:", tiers)
    print(f"written to {out_path}")


if __name__ == "__main__":
    main()
