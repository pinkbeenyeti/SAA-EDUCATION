#!/usr/bin/env python3
"""Ranks concepts by how urgently they need brand-new, original practice
questions written for the public QUESTION_BANK (data.js).

Priority is NOT based on dump.js content (that stays local-only and never
informs what gets published) -- it's based on two pieces of data that are
already original/structural and safely public:
  - `w` (weight) on each knowledge.js node: how many of the 674 sampled dump
    questions touch that concept. This is just a co-occurrence COUNT, not
    dump text, and it already ships in the public mindmap -- using it here
    only to approximate "how exam-relevant is this concept", the same way
    the AWS exam guide's own domain weightings would.
  - how many QUESTION_BANK entries in data.js already tag that concept.

target(concept) = proportional share of TOTAL_TARGET by weight (min 1).
gap(concept)     = max(0, target - current_coverage).
Concepts are ranked by gap, tie-broken by weight (heavier = higher priority).

Usage:
  python scripts/plan_generation.py --total-target 150
  python scripts/plan_generation.py --total-target 150 --out scripts/gen-plan.json
"""
import argparse
import json
import math
from pathlib import Path

from js_data import load_js_const

ROOT = Path(__file__).resolve().parent.parent


def build_plan(total_target):
    nodes = load_js_const("knowledge.js", "KNOWLEDGE_GRAPH")["nodes"]
    bank = load_js_const("data.js", "QUESTION_BANK")

    current = {}
    for q in bank:
        for cid in q.get("conceptIds", []):
            current[cid] = current.get(cid, 0) + 1

    total_weight = sum(n["w"] for n in nodes)
    plan = []
    for n in nodes:
        target = max(1, round(total_target * n["w"] / total_weight))
        cur = current.get(n["id"], 0)
        gap = max(0, target - cur)
        plan.append({
            "id": n["id"],
            "label": n["label"],
            "cat": n["cat"],
            "weight": n["w"],
            "current_coverage": cur,
            "target_coverage": target,
            "gap": gap,
        })
    plan.sort(key=lambda p: (-p["gap"], -p["weight"]))
    return plan


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--total-target", type=int, default=150,
                     help="rough total size the public QUESTION_BANK should eventually reach")
    ap.add_argument("--out", default=None)
    ap.add_argument("--top", type=int, default=25)
    args = ap.parse_args()

    plan = build_plan(args.total_target)

    print(f"{'concept':<16} {'cat':<12} {'weight':>6} {'have':>5} {'target':>6} {'gap':>4}")
    for p in plan[: args.top]:
        print(f"{p['id']:<16} {p['cat']:<12} {p['weight']:>6} {p['current_coverage']:>5} {p['target_coverage']:>6} {p['gap']:>4}")

    total_gap = sum(p["gap"] for p in plan)
    print(f"\ntotal questions needed to hit target coverage everywhere: {total_gap}")
    print(f"concepts with zero public coverage today: {sum(1 for p in plan if p['current_coverage'] == 0)}/{len(plan)}")

    if args.out:
        out_path = ROOT / args.out
        out_path.write_text(json.dumps(plan, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"\nfull plan written to {out_path}")


if __name__ == "__main__":
    main()
