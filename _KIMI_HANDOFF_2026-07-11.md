# KIMI HANDOFF — finish PropelBD v3 (continue, don't restart)

## State (verified, not guessed)
- Repo: `/Users/Ali/propelbd-websites-v3` (Next.js). Last commit `8f72aa4` shipped 3 concepts (Deal Room / Velocity Gap / Open The Doors).
- 55 files uncommitted right now (tailwind.config.ts, tsconfig.json, all 3 page/component trees, dist/ removed). No dev server running. Work stalled mid-fix, not shipped, not lost — pick it up.
- Yesterday's audit (`_audit_synthesis.md`) verdict: brief was ignored — built 3 half-baked concepts instead of ONE per spec. Root causes: no typography contrast, generic SaaS-template visuals, zero motion.

## The single highest-leverage fix (from audit, still true)
Pick ONE concept — recommend **Velocity Gap** (has `TrajectoryField.tsx`, closest to a real motion narrative already) — and finish IT to spec. Kill the other two from nav/routing, don't delete the code (keep as `/archive`).

## Do this, in order
1. `git diff` first — see exactly what's mid-flight before touching anything (some of the audit's typography fix may already be half-applied).
2. Finish typography per audit #3: distinct display vs body font pairing, fix `tailwind.config.ts:45-51`, fix `DealRoomContent.tsx:46` mono misuse (applies to Velocity Gap equivalent).
3. Kill generic bento/SVG filler (`BentoBoard.tsx` class of components) — replace with bespoke narrative visuals for Velocity Gap only.
4. Motion: wire `hyperframes-animation` (installed, GSAP-default) for the scroll-scrubbed horizontal flow the concept doc originally specced — this is the piece that was "orphaned/absent" per audit #5. Motion/brand polish is the sanctioned in-house lane per council §6b (`_session_2026-07-11/VIBE_CODING_MAP.md`); the old "$0 vs emergent.sh $167/mo" cost framing is RETIRED by that council pass — do not lean on it or expand scope under it.
5. `npm run build` clean, visual QA in browser (both breakpoints), THEN commit.

## Guardrail
Single concept only. Do not resurrect Deal Room / Open The Doors as live routes. Do not restart from scratch — audit says process, not concept quality, was the failure; the concept documents were good.
**§6b boundary (2026-07-11 reconcile):** NO new pages, routes, backend, or structural expansion — this handoff is a motion/typography/single-concept FINISH on existing structure only. Any future PropelBD site starts per §6b: Bolt.new/Lovable free-tier scaffold → export → Claude+hyperframes motion pass.

Claude's role here: audit + stamp after you ship, not build. Ping when a build exists to review.
