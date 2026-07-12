# Tool / Process Audit — PropelBD v3 Websites

**Auditor lens:** Fable (brutal design/process)  
**Scope:** `/Users/Ali/propelbd-websites-v3/` source, build artifacts, git history, concept brief, and critique files  
**Verdict:** The tools were not the problem. The **process was a single-pass scramble that ignored its own brief**, downgraded the spec, and shipped three half-concepts instead of one great one. This is how competent code becomes "AI slop."

---

## What the brief actually required

The concept doc (`/Users/Ali/_claude_inbox/propelbd-website-3-concepts-FINAL-for-claude.md`) was explicit:

- **NO CODE WRITTEN.** Concepts only. Waiting for Claude. (line 11)
- **Claude's Decision Needed: Pick ONE concept** (or authorize a hybrid of D2 + A2). (line 286)
- Tech spec per concept included **GSAP + ScrollTrigger + Lenis**, premium licensed fonts (**Söhne / GT America Mono**), and concept-specific motion systems.
- Anti-slop mandates were listed as binding: no 3-equal-cards, no template fonts, no fake counters, no stock Tailwind blue.

That brief was written to prevent exactly what got built.

---

## The tool/process failures, ranked

### 1. Scope bloat: three pages built when the brief said pick one

**Evidence:** `app/deal-room/page.tsx`, `app/velocity-gap/page.tsx`, `app/open-the-doors/page.tsx` all exist; `app/page.tsx` adds an index of all three.

The concept doc ranked the concepts and asked Claude to choose **one**. Instead, all three were built in parallel. The result is three pages that share the same generic skeleton (`hero > SectionHeader > grid-of-blocks > contact`), because no single concept got the depth it needed. Velocity Gap's trajectory field, Open The Doors' scroll-activated door, and Deal Room's kinetic bento were all **descoped into decoration** so the agent could finish three pages in one pass.

**Process violation:** This is the opposite of `incremental-implementation` and `agent-launch-bible`. One excellent page beats three interchangeable ones.

---

### 2. The stack was silently downgraded from the spec

**Evidence:**

- `package.json` dependencies: `framer-motion`, `next`, `react`, `lucide-react`. **No GSAP, no Lenis, no @gsap/react.**
- `tailwind.config.ts` fonts: `var(--font-bricolage)` and `var(--font-jetbrains)` — free Google Fonts.
- `app/layout.tsx`: imports `Bricolage_Grotesque` and `JetBrains_Mono` from `next/font/google`.

The concept spec called for:

- **Söhne / Söhne Breit / Söhne Buch** for display and body.
- **GT America Mono** for labels and data.
- **GSAP + ScrollTrigger + Lenis** for pinned/scrubbed sections.

The implementation swapped all of that for the cheapest available alternative: Framer Motion and Google Fonts. Bricolage + JetBrains Mono are fine for a startup MVP; they are **not** the premium type system the concept specified. The council specifically flagged Sora/Manrope as too generic in v2 and mandated Söhne. This build repeated the same mistake with different free fonts.

**Process violation:** `frontend-ui-engineering` and `taste` should have escalated the font/motion budget gap, not silently substituted.

---

### 3. Single-pass build with zero iteration loops

**Evidence:** Git history shows **two commits total**:

```
8f72aa4 Ship PropelBD v3 — three landing-page concepts: Deal Room, Velocity Gap, Open The Doors
796b89f Initial commit from Create Next App
```

There are no intermediate commits for:

- Typography tuning
- Motion refinement
- Responsive fixes
- Critique response
- Content revision
- Build/export verification

A 2-commit history (init → ship) is the signature of a rush job. The presence of extensive critique files (`_critique_*.md`) proves someone knew the problems, but the code shows no evidence those critiques were addressed in a second pass.

**Process violation:** `incremental-implementation` requires build → review → refine. This was build → ship.

---

### 4. Unique concepts were homogenized into one generic template

**Evidence:**

- `components/shared/SectionHeader.tsx` is reused across all three concepts. Every section follows the same `eyebrow + h2 + optional subtitle` pattern.
- All three heroes share identical structure: `motion.p eyebrow` → `motion.h1` with a highlighted accent span → `motion.p` subhead → `motion.div` CTA (`DealRoomContent.tsx:34-76`, `VelocityGapContent.tsx:33-72`, `OpenTheDoorsContent.tsx:69-106`).
- All three use the same tier/panel grid pattern: one wide top card + two bottom cards (`DealRoomContent.tsx:117-151`, `VelocityGapContent.tsx:155-189`).
- All three use the same contact block layout: left text + right CTA/form.

The concepts were supposed to be distinct:

- **Deal Room:** live revenue command center, asymmetric bento, real UI artifacts.
- **Velocity Gap:** WebGL trajectory field, F-shaped zig-zag process, kinetic-type marquee.
- **Open The Doors:** full-screen door, scroll-activated rooms, parallax depth planes.

The delivered code strips away those differentiating mechanics and pastes the same Tailwind component recipe into each page. That is why all three feel like the same template.

**Process violation:** `ui-ux-pro-max` and `taste` should enforce concept differentiation. Reusing `SectionHeader` everywhere is a code-reuse win and a design-loss catastrophe.

---

### 5. Anti-slop mandates were documented but ignored in code

The concept brief listed binding anti-slop rules. The build violated several:

| Rule | Status | Evidence |
|------|--------|----------|
| **NO 3-equal-cards** | ❌ Broken | `DealRoomContent.tsx:117-151` (2 + 1 + 1 grid), `VelocityGapContent.tsx:155-189` (same), `OpenTheDoorsContent.tsx:178-233` (4-col artifact grid), `app/page.tsx:38-52` (3-equal concept cards) |
| **NO Inter / template fonts** | ❌ Broken | Bricolage + JetBrains are free Google Fonts; not Söhne/GT America Mono |
| **NO stock Tailwind blue** | ⚠️ Partial | `#2357C4` is custom, but the palette is still thin and screensaver-like |
| **NO fake counters / fake live data** | ✅ Honored | No counters |
| **NO Unsplash** | ✅ Honored | No imagery at all — which creates its own void |
| **NO corporate filler** | ✅ Mostly | Copy is direct |

The rules were known. They were ignored because the build prioritized finishing three pages over honoring the guardrails.

**Process violation:** `taste` guardrails exist to prevent this exact drift.

---

### 6. References were collected but not translated

`_critique_references.md` lists 11 elite sites (Linear, DEPT, R/GA, Locomotive, Dogstudio, Cappen, Hello Monday, Vercel, Mercury, Buck, Area 17) with specific stealable techniques:

- "Single-statement heroes with word-by-word reveals."
- "Asymmetry through scale contrast and editorial split-screen layouts, not three-equal-columns."
- "Project lists that behave like typographic indexes."
- "Custom cursor, scroll skew, hover-reveal media."

None of these appear in the built code. The actual hero animation is always the same `opacity: 0, y: 24` → `opacity: 1, y: 0` + 0.1s delay pattern. The references became a bibliography, not a design input.

**Process violation:** Reference analysis must produce concrete build tickets. Listing sources without translating them is academic theater.

---

### 7. Build/export verification failed

**Evidence:**

- `next.config.mjs:3-4` sets `output: "export"` and `distDir: "dist"`.
- `dist/` does **not exist** in the repo (`ls /Users/Ali/propelbd-websites-v3/dist` → `No such file or directory`).
- `.next/` exists, suggesting `next build` may have been run but the export did not land in the configured directory, or the config was changed after the build.

Either way, the shipping state is inconsistent: the code says "export to dist" but the artifact is not there. A proper process would verify the export before calling it shipped.

**Process violation:** Mechanical gates are hard gates. `agent-launch-bible` should require a verified build artifact.

---

### 8. Workspace hygiene is sloppy

**Evidence:** `components/openTheDoors/OpenTheDoorsContent.tsx` exists and is **empty** (0 bytes). It sits alongside the real file at `components/open-the-doors/OpenTheDoorsContent.tsx`.

This is a leftover from a bad file creation or case confusion. It did not block the build, but it signals a careless workspace — exactly the kind of unreviewed residue that accumulates when shipping in one pass.

**Process violation:** Clean before ship.

---

### 9. Decision gates were bypassed

The concept doc explicitly ended with:

> "Claude's Decision Needed: Pick ONE concept... Authorize code build — Kimi Code should not write production website code until Claude approves concept + brand details."  
> — `propelbd-website-3-concepts-FINAL-for-claude.md:286-289`

The code exists. Either Claude approved and the spec was still downgraded, or the gate was ignored. Either way, the build proceeded without the required clarity on:

- One concept vs. three
- Font licensing budget
- Pricing tiers (the original asked for AED 8K / 15K / 25K confirmation; the build uses made-up names like "Advisory / Embedded / Revenue Partner" with no prices)
- GSAP/Lenis motion scope

**Process violation:** `agent-launch-bible` decision gates were ignored.

---

### 10. The README is still the Create Next App template

**Evidence:** `README.md:1-35` is unmodified stock text, including "This project uses next/font to automatically optimize and load Geist."

The project does not use Geist. Leaving the default README is a small signal of a larger problem: no one reviewed the repo as a deliverable. If the README is wrong, the rest of the package was not polished either.

---

## Top 5 root causes

1. **Scope discipline collapsed.** Building three concepts in parallel made it impossible to give any of them the craft the brief demanded.
2. **The spec was downgraded silently.** Premium fonts and GSAP/Lenis were swapped for free Google Fonts and Framer Motion without escalating the gap.
3. **No iterative review.** Two commits (init → ship) means no refinement, no critique response, no quality passes.
4. **Design references were not operationalized.** Elite references became a reading list, not a build checklist.
5. **Decision gates were ignored or weakly enforced.** The build started before the concept, font, pricing, and motion decisions were locked.

---

## Top 5 process fixes

1. **Pick one concept, delete the other two, and build it to 9/10.** Do not ship parallel half-concepts. The concept doc already ranked Deal Room #1 — start there.
2. **Either fund the spec or escalate.** If Söhne/GT America Mono licensing or GSAP/Lenis dev time is not approved, say so explicitly. Do not silently substitute inferior tools.
3. **Run build → critique → refine loops, each as a git commit.** No more init → ship. Every significant visual/motion/content revision gets a commit. Verify the export target (`dist/`) exists and is correct before shipping.
4. **Translate references into concrete tickets.** For each reference, write one ticket: e.g. "Hero word-by-word reveal like Linear", "Asymmetric 60/40 hero split like Area 17", "Process as typographic index like R/GA". Build against the ticket, not the moodboard.
5. **Enforce anti-slop gates before merge.** Create a pre-ship checklist from the concept brief: no 3-equal-cards, no template fonts, no fake data, one concept only, premium type + motion stack. Fail the build if any gate is red.

---

## Mechanical proof summary

- Git commits: **2** (`git log --oneline`)
- Concept pages built: **3** (against "pick one" instruction)
- GSAP/Lenis in `package.json`: **none**
- Söhne/GT America Mono in `package.json` or layout: **none**
- `dist/` directory per `next.config.mjs`: **missing**
- Empty duplicate component file: `components/openTheDoors/OpenTheDoorsContent.tsx`
- Stock README: **still present**

The code is not terrible. It compiles, it is consistent, it is readable. But it is the product of a process that prioritized volume over discernment, and that is why it looks like AI slop.

---

AUDIT_TOOL-PROCESS::DONE::2026-07-10T10:52:53Z
