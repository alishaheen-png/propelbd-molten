#!/usr/bin/env python3
import sys, os, pathlib, json
sys.path.insert(0, os.path.expanduser('~/PropelBD-Brain-LOCAL/scripts'))
from nim_swarm import swarm

ROOT = pathlib.Path('/Users/Ali/propelbd-websites-v3')

def read(p):
    try:
        return (ROOT / p).read_text(encoding='utf-8')
    except Exception as e:
        return f"[ERROR reading {p}: {e}]"

audits = {
    'Kimi Design Execution': read('_audit_design-execution.md')[:2000],
    'Kimi Tool Process': read('_audit_tool-process.md')[:2000],
    'Kimi Creative Direction': read('_audit_creative-direction.md')[:2000],
    'NIM Swarm': read('_audit_nim.md')[:2000],
    'Qwen': read('_audit_qwen.md')[:1200],
}

context = f"""PropelBD v3 websites were rated 2/10 and called "terrible AI slop". Parallel audits from Kimi, NIM, and Qwen analyzed the failure.

AUDIT FINDINGS:
{json.dumps(audits, indent=2)}
"""

prompt = context + """

You are the final synthesizer. Fable hat on. Produce a concise root-cause report in this exact format:

## Verdict
One sentence: the primary failure is [CREATIVE DIRECTION / TOOL&PROCESS / EXECUTION / BOTH] because ...

## Top 5 Root Causes
1. [cause] — [one-line evidence]
2. ...
3. ...
4. ...
5. ...

## Single Highest-Leverage Fix for Claude
[what Claude should do first]

## 5 Instructions for Claude
1. ...
2. ...
3. ...
4. ...
5. ...

Be decisive. No filler. No hedging.
"""

print("Running synthesis...")
results = swarm([prompt], system="You are a senior synthesis auditor. Be brutally honest and concise.", model="nvidia/llama-3.3-nemotron-super-49b-v1.5", max_workers=1)

out_path = ROOT / '_audit_synthesis.md'
with open(out_path, 'w') as f:
    f.write("# Final Synthesis — PropelBD v3 Website Failure\n\n")
    f.write(results[0].get('data') or results[0].get('raw') or '[no output]')

print(f"Synthesis saved to {out_path}")
