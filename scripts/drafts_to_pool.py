#!/usr/bin/env python3
"""Converts scripts/gen-drafts.json (bilingual draft schema from
generate_questions.py) into the plain {id, question, options, select_n} pool
shape scripts/answer_dual.py verify-pool expects. Verification runs against
the English side only -- the pipeline's tiering only cares whether the
scenario has one unambiguous correct answer, which is language-independent by
construction (both language versions describe the same scenario).

Usage:
  python scripts/drafts_to_pool.py --drafts scripts/gen-drafts.json --out scripts/gen-pool.json
"""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--drafts", default="scripts/gen-drafts.json")
    ap.add_argument("--out", default="scripts/gen-pool.json")
    args = ap.parse_args()

    drafts = json.loads((ROOT / args.drafts).read_text(encoding="utf-8"))
    pool = [
        {
            "id": d["id"],
            "question": d["question_en"],
            "options": d["options_en"],
            "select_n": 1,
        }
        for d in drafts
    ]
    (ROOT / args.out).write_text(json.dumps(pool, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"{len(pool)} questions written to {args.out}")


if __name__ == "__main__":
    main()
