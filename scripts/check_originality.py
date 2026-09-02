#!/usr/bin/env python3
"""Anti-plagiarism gate for generated questions (stage 3 of the original-
question pipeline). The drafting prompt tells the backend to invent a scenario
from scratch, but that instruction is not a guarantee -- Codex/Gemini may have
memorized real ExamTopics-style questions during training and reproduce one
close enough to count as a copy. This script is the actual safety net: it
diffs every generated question's English stem against all 674 real dump
questions using word-shingle (n-gram) overlap, and flags anything suspiciously
similar so it never reaches a human review queue or data.js.

This only ever READS dump.js (never writes/ships it) purely as a local
comparison corpus -- consistent with the project rule that dump-derived text
must never influence what gets published, only gate against accidental reuse.

Usage:
  python scripts/check_originality.py --drafts scripts/gen-drafts.json --out scripts/gen-originality.json
"""
import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SHINGLE_N = 6
FLAG_THRESHOLD = 0.30  # Jaccard similarity of word-shingle sets


def normalize_words(text):
    return re.findall(r"[a-z0-9]+", text.lower())


def shingles(words, n=SHINGLE_N):
    if len(words) < n:
        return {tuple(words)} if words else set()
    return {tuple(words[i:i + n]) for i in range(len(words) - n + 1)}


def jaccard(a, b):
    if not a or not b:
        return 0.0
    inter = len(a & b)
    union = len(a | b)
    return inter / union if union else 0.0


def load_dump_shingle_index():
    text = (ROOT / "dump.js").read_text(encoding="utf-8")
    m = re.search(r"const SAA_DUMP\s*=\s*(\[.*\]);?\s*$", text, re.S)
    all_q = json.loads(m.group(1))
    index = []
    for q in all_q:
        full_text = q["stem"] + " " + " ".join(q.get("options", []))
        words = normalize_words(full_text)
        index.append((q["id"], shingles(words)))
    return index


def check_draft(draft, dump_index):
    full_text = draft["question_en"] + " " + " ".join(draft.get("options_en", []))
    words = normalize_words(full_text)
    draft_shingles = shingles(words)

    best_id, best_score = None, 0.0
    for qid, dump_shingles in dump_index:
        score = jaccard(draft_shingles, dump_shingles)
        if score > best_score:
            best_id, best_score = qid, score

    return {
        "id": draft["id"],
        "most_similar_dump_id": best_id,
        "similarity": round(best_score, 4),
        "flagged": best_score >= FLAG_THRESHOLD,
    }


def main():
    global FLAG_THRESHOLD
    ap = argparse.ArgumentParser()
    ap.add_argument("--drafts", default="scripts/gen-drafts.json")
    ap.add_argument("--out", default="scripts/gen-originality.json")
    ap.add_argument("--threshold", type=float, default=FLAG_THRESHOLD)
    args = ap.parse_args()

    FLAG_THRESHOLD = args.threshold

    drafts = json.loads((ROOT / args.drafts).read_text(encoding="utf-8"))
    print(f"loading dump.js comparison corpus ...")
    dump_index = load_dump_shingle_index()
    print(f"checking {len(drafts)} drafts against {len(dump_index)} dump questions (shingle size {SHINGLE_N}, flag >= {FLAG_THRESHOLD}) ...")

    results = [check_draft(d, dump_index) for d in drafts]
    flagged = [r for r in results if r["flagged"]]

    (ROOT / args.out).write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\n{len(flagged)}/{len(results)} flagged as too similar to an existing dump question:")
    for r in flagged:
        print(f"  {r['id']} ~ {r['most_similar_dump_id']} (similarity {r['similarity']})")
    print(f"\nwritten to {args.out}")


if __name__ == "__main__":
    main()
