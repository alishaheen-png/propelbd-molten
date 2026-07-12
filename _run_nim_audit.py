#!/usr/bin/env python3
import sys, os, pathlib, json, textwrap
sys.path.insert(0, os.path.expanduser('~/PropelBD-Brain-LOCAL/scripts'))
from nim_swarm import swarm

ROOT = pathlib.Path('/Users/Ali/propelbd-websites-v3')

def read(p):
    try:
        return (ROOT / p).read_text(encoding='utf-8')
    except Exception as e:
        return f"[ERROR reading {p}: {e}]"

source_files = {
    'tailwind.config.ts': read('tailwind.config.ts'),
    'app/layout.tsx': read('app/layout.tsx'),
    'app/globals.css': read('app/globals.css'),
    'components/shared/Nav.tsx': read('components/shared/Nav.tsx'),
    'components/shared/SectionHeader.tsx': read('components/shared/SectionHeader.tsx'),
    'components/deal-room/DealRoomContent.tsx': read('components/deal-room/DealRoomContent.tsx')[:4000],
    'components/velocity-gap/VelocityGapContent.tsx': read('components/velocity-gap/VelocityGapContent.tsx')[:4000],
    'components/open-the-doors/OpenTheDoorsContent.tsx': read('components/open-the-doors/OpenTheDoorsContent.tsx')[:4000],
}

critiques = {
    'deal-room': read('_critique_deal-room.md'),
    'velocity-gap': read('_critique_velocity-gap.md'),
    'open-the-doors': read('_critique_open-the-doors.md'),
    'references': read('_critique_references.md'),
}

base_context = f"""PROJECT: PropelBD v3 website build — three landing-page concepts built with Next.js 14, Tailwind, Framer Motion, Bricolage Grotesque, JetBrains Mono.
BRAND LOCK: navy/blue kinetic, Dubai + Abu Dhabi only, NO gold (#C9A84C is SCME only), NO fabricated numbers/achievements/pricing.
ANTI-SLOP: no Inter, no 3-equal-cards, no neon glows, no pure black, no gradient text on big headers, no corporate filler words, no emojis, no Unsplash, no Tailwind CDN.

SOURCE EXCERPTS:
{json.dumps(source_files, indent=2)}

EXISTING CRITIQUES:
{json.dumps({k:v[:2500] for k,v in critiques.items()}, indent=2)}
"""

prompts = [
    base_context + "\n\nYOUR LENS: Why does this look like AI slop? Focus on visual identity, typography, color, layout, and motion. Name the exact failure patterns. Output a ranked list of 10 specific problems with file references. Be brutal.",
    base_context + "\n\nYOUR LENS: Process audit. Did Kimi misuse tools/skills (Next.js, Tailwind, Framer, ui-ux-pro-max, taste, frontend-ui-engineering, incremental-implementation, agent-launch-bible)? What workflow failure produced this result? Output 10 process-level findings.",
    base_context + "\n\nYOUR LENS: Creative direction. The original brief had strong concepts (Deal Room, Velocity Gap, Open The Doors). Why did the built output flatten them into interchangeable dark-mode pages? Output 10 creative-direction failures.",
    base_context + "\n\nYOUR LENS: Compare to the elite references (Linear, DEPT, R/GA, Locomotive, Dogstudio, Cappen, Hello Monday, Vercel, Mercury, Buck, Area 17). What specific techniques from those references are MISSING? Output 10 stealable techniques and why they were not applied.",
]

print("Launching NIM audit swarm...")
results = swarm(prompts, system="You are a senior design/process auditor. Fable hat on. Be brutally honest, specific, and concise.", model="nvidia/llama-3.3-nemotron-super-49b-v1.5", max_workers=4)

out_path = ROOT / '_audit_nim.md'
with open(out_path, 'w') as f:
    f.write("# NIM Audit Swarm — PropelBD v3 Website Failure\n\n")
    for i, r in enumerate(results):
        f.write(f"## Agent {i+1}\n\n")
        f.write(r.get('data') or r.get('raw') or '[no output]')
        f.write("\n\n---\n\n")

print(f"NIM audit saved to {out_path}")
