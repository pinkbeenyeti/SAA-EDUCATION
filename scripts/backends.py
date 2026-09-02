#!/usr/bin/env python3
"""
Non-Claude CLI backend adapters (Codex, Antigravity/Gemini) shared by
answer_dual.py and compare_backends.py. See docs/answer-pipeline-spec.md and
the compare_backends.py quality check (5/5 match vs. the full Claude pipeline
on the calibration set) for why these are trusted as first-pass solvers.
"""
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

CODEX_BIN = shutil.which("codex") or "codex"
AGY_BIN = shutil.which("agy") or "agy"

# Both CLIs are launched from a Git Bash / mintty pty with no inherited Win32
# console, so Windows pops a fresh console window for every single subprocess
# call (visible as cmd windows flashing open/closed during a batch run).
# CREATE_NO_WINDOW suppresses that; harmless no-op on non-Windows since it
# just evaluates to subprocess's own default of 0 there.
_NO_WINDOW = getattr(subprocess, "CREATE_NO_WINDOW", 0)


class BackendError(RuntimeError):
    pass


def _strict(schema):
    # OpenAI structured outputs (codex exec --output-schema) reject any schema
    # missing an explicit additionalProperties: false.
    schema = dict(schema)
    schema["additionalProperties"] = False
    return schema


def run_codex(prompt, system_prompt, json_schema, model=None, timeout=120):
    # codex.cmd is an npm/cmd.exe shim on Windows: an argv element containing a
    # literal newline is silently truncated at the first newline. Multi-line
    # question/options text must go over stdin instead, with only the (already
    # single-line) system prompt passed as argv.
    with tempfile.TemporaryDirectory() as td:
        schema_path = Path(td) / "schema.json"
        out_path = Path(td) / "out.txt"
        schema_path.write_text(json.dumps(_strict(json_schema)), encoding="utf-8")
        cmd = [CODEX_BIN, "exec", "--skip-git-repo-check", "-s", "read-only", "--json",
               "--output-schema", str(schema_path), "-o", str(out_path)]
        if model:
            cmd += ["-m", model]
        cmd.append(system_prompt.replace("\n", " "))
        try:
            proc = subprocess.run(cmd, input=prompt, capture_output=True, text=True,
                                   encoding="utf-8", errors="replace", timeout=timeout,
                                   creationflags=_NO_WINDOW)
        except subprocess.TimeoutExpired as e:
            raise BackendError(f"codex timed out after {timeout}s") from e
        if proc.returncode != 0 or not out_path.exists():
            raise BackendError(f"codex exit {proc.returncode}: stderr={proc.stderr[-800:]!r}")
        usage = {}
        for line in proc.stdout.splitlines():
            line = line.strip()
            if not line.startswith("{"):
                continue
            try:
                event = json.loads(line)
            except json.JSONDecodeError:
                continue
            if event.get("type") == "turn.completed":
                usage = event.get("usage", {})
        return json.loads(out_path.read_text(encoding="utf-8")), usage


def run_agy(prompt, system_prompt, json_schema, model="gemini-3.7-flash-high", timeout=120):
    # agy is a native binary (not an npm shim) so embedded newlines in argv are
    # safe -- confirmed by compare_backends.py test runs.
    full_prompt = f"{system_prompt}\n\n{prompt}"
    with tempfile.TemporaryDirectory() as td:
        schema_path = Path(td) / "schema.json"
        schema_path.write_text(json.dumps(_strict(json_schema)), encoding="utf-8")
        cmd = [AGY_BIN, "-p", full_prompt, "--model", model, "--output-format", "json",
               "--json-schema", str(schema_path), "--dangerously-skip-permissions"]
        try:
            proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8",
                                   errors="replace", timeout=timeout, creationflags=_NO_WINDOW)
        except subprocess.TimeoutExpired as e:
            raise BackendError(f"agy timed out after {timeout}s") from e
        if proc.returncode != 0:
            raise BackendError(f"agy exit {proc.returncode}: stderr={proc.stderr[-800:]!r}")
        try:
            data = json.loads(proc.stdout)
        except json.JSONDecodeError as e:
            raise BackendError(f"agy non-JSON stdout: {proc.stdout[-800:]!r}") from e
        if data.get("status") != "SUCCESS":
            raise BackendError(f"agy status={data.get('status')}: {data}")
        return data["structured_output"], data.get("usage", {})
