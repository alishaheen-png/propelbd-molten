# Creative-Direction Audit — PropelBD v3 Websites

**Auditor:** Fable (creative-direction lens)  
**Scope:** `/Users/Ali/propelbd-websites-v3/` vs. `/Users/Ali/_claude_inbox/propelbd-website-3-concepts-FINAL-for-claude.md`  
**Verdict:** The brief was better than the build. The concepts had a clear, ownable point of view; the execution flattened them into three interchangeable dark-mode landing pages. The slop is not in the ideas — it is in the gap between the concept document and what actually got shipped.

---

## 1. The brief was strong; the build ignored its best parts

The FINAL concept doc is specific. It names exact frames, type, color, motion, and anti-slop guardrails. The built pages keep the color and the headline, but discard almost every authored device that made the concepts distinctive.

### Deal Room — concept vs. code

| Concept directive (FINAL doc) | What got built | Failure |
|---|---|---|
| Hero: asymmetric split-screen with a **kinetic bento deal board**; cells reconfigure on scroll (`components/deal-room/BentoBoard.tsx` existed but was orphaned from the route) | `ProcessLockup.tsx` at `components/deal-room/ProcessLockup.tsx:12-50`: four floating cards on a beige canvas with a meaningless Bézier connector | The board became a sparse, abstract ornament. The bento concept is referenced in a critique file but not used in the live route, which suggests a late, undocumented pivot. |
| Pipeline: **scroll-scrubbed horizontal flow of uneven deal-stage cards** | `DealRoomContent.tsx:91-107`: four equal-width cards in a `lg:grid-cols-4` row with a hairline rule | Horizontal motion and uneven rhythm — the whole point — are gone. |
| Retainer: **one oversized tier + two satellites** | `DealRoomContent.tsx:117-151`: a 2×2 asymmetric grid that is better than equal cards, but still reads as a bento layout, not a dominant tier with satellites. |
| Operator's Desk: **real UI fragments** (calendar, CRM snippet, voice note, proposal) | Entirely absent | A whole frame was dropped, removing the “revenue system as proof” moment. |
| Roster: **masonry-like asymmetric case-study grid** | Absent | No case studies, no proof. |
| Briefing: **split form with live outreach preview** | `DealRoomContent.tsx:184-224`: generic email/company/message form | The live-preview device — which would have made the CTA memorable — was dropped. |

### Velocity Gap — concept vs. code

| Concept directive | What got built | Failure |
|---|---|---|
| Hero: **BD-specific WebGL trajectory field** with deal nodes that accelerate on scroll; copy left 5 cols, field right 7 cols | `VelocityGapContent.tsx:30-78` places copy in 7 cols and the field in 5, behind a border box; `TrajectoryField.tsx:1-113` uses a faint 2D canvas grid at ~10–20% opacity | The field is decorative wallpaper, not a kinetic system. The concept's spatial ratio was reversed. |
| Empty Chair: cost of not having BD | `VelocityGapContent.tsx:80-97`: executed as a clean text split — this is one of the stronger translations. |  |
| Deals in Motion: **horizontal ticker of deal archetypes** | Absent | Lost a motion-forward proof device. |
| How We Move: **F-shaped zig-zag process** | `VelocityGapContent.tsx:99-126`: a numbered vertical list with giant `01/02/03/04` indexes | Not bad, but it loses the zig-zag editorial rhythm described in the brief. |
| Pipeline Velocity: **animated line graph** | Absent | Good — the concept itself warned this could be fake-data slop. |
| Fractional Seat: **asymmetric pricing/table** | `VelocityGapContent.tsx:152-191`: 2×2 bento grid | No pricing, no table, no asymmetric dominance. |
| Start the Conversation: **kinetic-type marquee + single CTA** | `VelocityGapContent.tsx:193-214`: static headline + mailto button | The marquee energy and final typographic moment are gone. |

### Open The Doors — concept vs. code

| Concept directive | What got built | Failure |
|---|---|---|
| Hero: **single 100vh navy door**, vertical headline up the frame, scroll-to-enter with skippable link | `OpenTheDoorsContent.tsx:35-109`: a flat SVG door on the right side of a standard split hero, horizontal headline, no scroll-to-enter, no skip link | The whole cinematic premise was discarded. The door is now a clipart illustration beside a headline. |
| Room of Unread Introductions: **kinetic typography wall of subject lines at parallax speeds** | `OpenTheDoorsContent.tsx:111-137`: a vertical list with alternating opacity | No parallax speeds, no wall, no typographic scale shift. |
| The Territory: **abstract Dubai–Abu Dhabi naval chart**, deal nodes lighting up | `OpenTheDoorsContent.tsx:139-172`: two city info cards | The chart — a potentially ownable visual — became a features grid. |
| Deal Table: **horizontal-scroll artifact stream with variable widths** | `OpenTheDoorsContent.tsx:174-235`: a 4-column bento grid | Variable widths and horizontal scroll are gone; equal cards return. |
| Operating System: **full-bleed schematic, lines draw on scroll completing a circuit** | `OpenTheDoorsContent.tsx:237-285`: a single horizontal line with four evenly spaced nodes inside a bordered box | No full-bleed, no circuit, no schematic depth. |
| Tension Bar: **single tier/price as a tensioned steel bar** | `OpenTheDoorsContent.tsx:287-313`: a progress bar with three equal columns below it | The “tensioned steel” metaphor is missing; the bar reads as a loading indicator. |
| Closing Room: **ascending elevator shaft, CTA at center** | `OpenTheDoorsContent.tsx:315-335`: standard left/right split CTA | The spatial metaphor — the climax of the concept — is gone. |

---

## 2. The concepts themselves were not the problem

The concepts have clear potential:

- **Ownable metaphors:** deal room, velocity gap, doors/rooms. They are concrete and BD-specific.
- **Premium type direction:** Söhne + GT America Mono would have separated PropelBD from every Inter/Geist startup page.
- **Asymmetric, editorial layouts:** each concept avoids the 3-equal-card trap in its brief.
- **Real artifacts:** the brief explicitly asks for real UI fragments, term sheets, SOWs, voice notes — not stock 3D renders.
- **Restrained navy/blue kinetic palette:** the color logic is consistent and on-brand.

The built output, however, defaults to:

- `Bricolage Grotesk` + `JetBrains Mono` instead of the briefed Söhne family (`tailwind.config.ts:45-47`, `app/layout.tsx:5-17`).
- Generic Framer `opacity: 0, y: 24` fades on every element (`DealRoomContent.tsx:34-63`, `VelocityGapContent.tsx:33-72`, `OpenTheDoorsContent.tsx:69-106`).
- Repeated `SectionHeader` pattern: eyebrow + `text-display` heading + optional subtitle (`components/shared/SectionHeader.tsx:1-20`), used in almost every section.
- Bento grids standing in for more ambitious frames.
- Mailto CTAs instead of real scheduling or briefing interactions.

In short: the build treated the concept doc as a mood board, not a blueprint.

---

## 3. Where creative direction actually failed

### A. The three-site strategy killed focus

The brief explicitly asked Claude to **pick one concept** (or a D2+A2 hybrid). Instead, all three were built to roughly 70% completion. That diffused the creative energy and forced shared components (`Nav.tsx`, `Footer.tsx`, `SectionHeader.tsx`) to be generic enough to work everywhere. A single concept, pushed to 100%, would have looked intentional; three half-realized concepts look like a template store.

### B. Type direction collapsed into a free-font fallback

The brief specified `Söhne` and `GT America Mono` and flagged font licensing as a required decision. The build uses `Bricolage Grotesk` and `JetBrains Mono` from Google Fonts. Bricolage is friendly and slightly quirky; it does not carry the peer-level operator severity the brief described. JetBrains Mono is a code font, not a data-mono voice. The failure is not the fonts themselves — it is that the creative decision was skipped.

### C. Motion was downgraded from narrative to decoration

The brief calls for GSAP ScrollTrigger pinned sections, scrubbed transforms, bento recomposition, and scroll-bound scene transitions. The build uses only Framer Motion entrance fades and one canvas loop. There are no pinned sections, no scroll-scrubbed reconfigurations, no parallax planes. Motion became “make things appear,” not “tell the story.”

### D. Placeholder abstractions replaced real proof

The brief repeatedly demands real artifacts. The build uses invented client names (`Al Maryah F&B`, `DIFC Fund`, `JLT SaaS`) and document labels (`Term sheet v2`, `SOW — fractional BD`) without dates, sizes, or context that would make them feel like a live desk. The result is “fake real” — worse than obviously synthetic, because it asks for trust it has not earned.

### E. The metaphor-to-message ratio drifted

In Open The Doors, the door/room metaphor dominates the concept but the build never commits to it. In Velocity Gap, the trajectory field is present but invisible. In Deal Room, the “system” metaphor is stated in the headline but the visual system is a few floating cards. Each page starts with a strong metaphor and then immediately retreats to safe, explainable layout.

---

## 4. Top 5 root causes (creative-direction)

1. **Concept fidelity was not enforced.** The build cherry-picked easy parts of the brief and discarded the authored frames that required craft.
2. **Type and asset decisions were deferred to defaults.** Söhne/GT America Mono were never licensed or replaced with an equivalent intentional choice.
3. **Motion was treated as polish, not structure.** GSAP scroll-bound choreography in the brief became generic Framer entrance fades.
4. **Three concepts were built instead of one.** The work was spread across pages, forcing shared generic components and preventing any single concept from being fully realized.
5. **Proof was faked rather than sourced.** Real UI fragments, case studies, and founder presence — all required by the brief — were omitted or replaced with plausible-looking placeholders.

---

## 5. Top 5 creative fixes

1. **Pick one concept and finish it.** Kill two of the three routes. Rebuild the chosen one frame-by-frame against the brief, treating the concept doc as a shot list, not inspiration.
2. **Resolve the type system before any more layout.** Either license Söhne + GT America Mono or choose a free alternative with the same severity (e.g., Darker Grotesk + IBM Plex Mono). Ban Bricolage for this brand.
3. **Rebuild motion as scroll-bound narrative.** Use GSAP ScrollTrigger for the hero pin, pipeline horizontal scrub, bento recomposition, and door swing. Framer Motion is fine for micro-interactions; it cannot carry the story.
4. **Replace every placeholder with real artifacts.** Screenshot a real calendar, a real CRM list, a real SOW, or a real voice-note UI. If real client names cannot be shown, anonymize actual deal data rather than inventing it.
5. **Add a single proof layer before any CTA.** A founder quote, a “recent wins” list, or a market-map diagram must appear before the contact section. The pages currently ask for a call without establishing credibility.

---

## Bottom line

The 2/10 rating is harsh but not wrong. The concepts in the FINAL brief were a 7–8/10 direction. The built output is a 3–4/10 execution of that direction. The slop is not conceptual — it is the institutional drift from a precise brief into safe, reusable, dark-mode components. Fix the fidelity gap, not the brand strategy.

AUDIT_CREATIVE-DIRECTION::DONE::2026-07-10T10:53:36Z
