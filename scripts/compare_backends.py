#!/usr/bin/env python3
"""
Stage-1-only quality comparison across CLI backends: claude / codex / antigravity
(Gemini 3.x via the `agy` CLI -- the standalone `gemini` CLI's free-tier OAuth is
dead, see docs/answer-pipeline-spec.md discussion). Reuses the existing Claude
calibration-results.json answers instead of re-calling `claude`, so this costs
zero Claude tokens/API spend -- only Codex/Antigravity are actually invoked.

Usage:
  python scripts/compare_backends.py --count 5
"""
import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from answer import LETTERS, normalize_question, build_solve_prompt, solve_schema, SYSTEM_PROMPT_SOLVE  # noqa: E402
from backends import run_codex, run_agy  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--count", type=int, default=5)
    ap.add_argument("--codex-model", default=None)
    ap.add_argument("--agy-model", default="gemini-3.1-pro-high")
    args = ap.parse_args()

    calib = json.loads((ROOT / "scripts/calibration-set.json").read_text(encoding="utf-8"))
    claude_results = {r["id"]: r for r in json.loads((ROOT / "scripts/calibration-results.json").read_text(encoding="utf-8"))["results"]}

    questions = calib["questions"][: args.count]
    rows = []
    for q in questions:
        nq = normalize_question(q)
        correct_letters = sorted(LETTERS[i] for i in q["correct_answer"])
        prompt = build_solve_prompt(nq)
        schema = solve_schema(nq["letters"], nq["select_n"])

        row = {"id": q["id"], "correct": correct_letters}

        claude_r = claude_results.get(q["id"])
        row["claude"] = claude_r.get("predicted_answer") if claude_r else None

        try:
            out, _usage = run_codex(prompt, SYSTEM_PROMPT_SOLVE, schema, model=args.codex_model)
            row["codex"] = sorted(out["answer"])
            row["codex_rationale"] = out["rationale"]
        except Exception as e:
            row["codex"] = f"ERROR: {e}"

        try:
            out, _usage = run_agy(prompt, SYSTEM_PROMPT_SOLVE, schema, model=args.agy_model)
            row["agy"] = sorted(out["answer"])
            row["agy_rationale"] = out["rationale"]
        except Exception as e:
            row["agy"] = f"ERROR: {e}"

        rows.append(row)
        print(f"[{q['id']}] correct={correct_letters} claude={row['claude']} codex={row['codex']} agy={row['agy']}", flush=True)

    print("\n" + json.dumps(rows, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
