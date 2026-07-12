#!/usr/bin/env python3
import sys, os, pathlib, json
sys.path.insert(0, os.path.expanduser('~/PropelBD-Brain-LOCAL/scripts'))
from qwen_monster import solve

ROOT = pathlib.Path('/Users/Ali/propelbd-websites-v3')

def read(p):
    try:
        return (ROOT / p).read_text(encoding='utf-8')
    except Exception as e:
        return f"[ERROR reading {p}: {e}]"

source_files = {
    'tailwind.config.ts': read('tailwind.config.ts'),
    'app/layout.tsx': read('app/layout.tsx'),
    'components/shared/Nav.tsx': read('components/shared/Nav.tsx'),
    'components/shared/SectionHeader.tsx': read('components/shared/SectionHeader.tsx'),
    'deal-room': read('components/deal-room/DealRoomContent.tsx')[:3500],
    'velocity-gap': read('components/velocity-gap/VelocityGapContent.tsx')[:3500],
    'open-the-doors': read('components/open-the-doors/OpenTheDoorsContent.tsx')[:3500],
}

context = f"""PropelBD v3 websites were built with Next.js 14 + Tailwind + Framer Motion. Ali rated them 2/10 and called them "terrible AI slop". 

Source excerpts:
{json.dumps(source_files, indent=2)}

Existing critiques (first 2000 chars each):
{json.dumps({k: read(f'_critique_{k}.md')[:2000] for k in ['deal-room', 'velocity-gap', 'open-the-doors']}, indent=2)}
"""

prompt = context + """

You are a senior design auditor. Fable hat on. Give a BRUTAL root-cause analysis: why do these sites look like AI slop? Focus on the highest-leverage failures (not every tiny issue). Output 10 specific, actionable findings with file references. Then give a 3-paragraph verdict on whether the root cause is (a) bad creative direction, (b) bad execution/tools, or (c) both. Be direct.
"""

print("Launching Qwen audit...")
result = solve('reason_local', prompt)

out_path = ROOT / '_audit_qwen.md'
text = result.get('text') or result.get('data') or result.get('answer') or result.get('raw') or json.dumps(result, indent=2)
with open(out_path, 'w') as f:
    f.write("# Qwen Audit — PropelBD v3 Website Failure\n\n")
    f.write(str(text))

print(f"Qwen audit saved to {out_path}")
