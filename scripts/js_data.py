#!/usr/bin/env python3
"""Loads a `const NAME = {...}` / `const NAME = [...]` literal out of one of the
project's browser-facing .js data files (concepts.js, knowledge.js, data.js) by
actually running the file through Node and dumping the value as JSON, instead of
regexing it out by hand. Safe here because these files only ever contain plain
object/array/string/number literals (no functions, no browser globals) -- they
are written to be `<script>`-tag-loaded directly into a global.
"""
import json
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def load_js_const(filename, varname, timeout=30):
    src = (ROOT / filename).read_text(encoding="utf-8")
    js = src + f"\nprocess.stdout.write(JSON.stringify({varname}));"
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
        f.write(js)
        tmp = f.name
    try:
        proc = subprocess.run(["node", tmp], capture_output=True, text=True,
                               encoding="utf-8", errors="replace", timeout=timeout)
        if proc.returncode != 0:
            raise RuntimeError(f"node failed evaluating {varname} from {filename}: {proc.stderr[-800:]}")
        return json.loads(proc.stdout)
    finally:
        Path(tmp).unlink(missing_ok=True)
