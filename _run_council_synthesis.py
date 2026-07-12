#!/usr/bin/env python3
import sys, os, pathlib, json
sys.path.insert(0, os.path.expanduser('~/PropelBD-Brain-LOCAL/scripts'))
from nim_workflow import council

ROOT = pathlib.Path('/Users/Ali/propelbd-websites-v3')

def read(p):
    try:
        return (ROOT / p).read_text(encoding='utf-8')
    except Exception as e:
        return f"[ERROR reading {p}: {e}]"

audits = {
    'Kimi Design Execution': read('_audit_design-execution.md')[:2500],
    'Kimi Tool Process': read('_audit_tool-process.md')[:2500],
    'Kimi Creative Direction': read('_audit_creative-direction.md')[:2500],
    'NIM Swarm': read('_audit_nim.md')[:2500],
    'Qwen': read('_audit_qwen.md')[:1500],
}

question = f"""PropelBD v3 websites were rated 2/10 by the founder and called "terrible AI slop". 
We ran parallel audits (Kimi, NIM, Qwen). Here are the findings:

{json.dumps(audits, indent=2)}

YOUR TASK:
1. Identify the TOP 5 root causes of the failure.
2. Judge whether the primary failure is CREATIVE DIRECTION, TOOL/PROCESS, or EXECUTION.
3. Name the SINGLE highest-leverage fix Claude should apply first when he takes over.
4. Give 5 concrete next-step instructions for Claude.

Be decisive. No hedging. Output JSON with keys: top_5_root_causes (list), primary_failure (one of CREATIVE/TOOL/EXECUTION/BOTH), highest_leverage_fix (string), instructions_for_claude (list of 5 strings), confidence (1-10)."""

print("Launching LLM council synthesis...")
result = council(question, frames=['skeptic', 'execution-realist', 'creative-director', 'process-engineer', 'contrarian'], free_chairman=True)

out_path = ROOT / '_audit_council_synthesis.md'
with open(out_path, 'w') as f:
    f.write("# LLM Council Synthesis — PropelBD v3 Website Failure\n\n")
    f.write("```json\n")
    f.write(json.dumps(result, indent=2))
    f.write("\n```\n")

print(f"Council synthesis saved to {out_path}")
