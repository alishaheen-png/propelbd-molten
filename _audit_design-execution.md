# Design-Execution Audit — PropelBD v3 Websites

**Auditor lens:** design-execution  
**Scope:** `app/*`, `components/**/*`, `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`, plus existing critique files.  
**Verdict:** The 2/10 is earned. The build is not a bad concept poorly rendered; it is a single generic dark-mode template copy-pasted three times, decorated with placeholder visuals that read as "I asked an AI to make a premium website." Below are the specific failures.

---

## 1. Typography Mistakes

### 1.1 Hero type is suffocated by the same tight spec everywhere
- **Where:** `tailwind.config.ts:50-51`; `DealRoomContent.tsx:46`; `VelocityGapContent.tsx:45`; `OpenTheDoorsContent.tsx:81`.
- **Failure:** All three heroes use `text-hero` / `text-hero-sm` with `leading-[0.98]` and `tracking-tight`. At `clamp(3rem, 9vw, 8rem)`, a 0.98 line-height makes ascenders/descenders crash. The identical spec across three supposedly distinct concepts is the first giveaway that this is a template swap, not three authored directions.

### 1.2 `font-display` and `font-body` are the same font
- **Where:** `tailwind.config.ts:45-47`.
- **Failure:** Both `display` and `body` resolve to `var(--font-bricolage)`. There is no typographic contrast between headlines and body. The system pretends to have a pair but uses a single grotesque for everything.

### 1.3 Section eyebrows are visual spam
- **Where:** `SectionHeader.tsx:15`; used at `DealRoomContent.tsx:87`, `:115`, `:158`, `:188`; `VelocityGapContent.tsx:84`, `:102`, `:131`, `:154`, `:197`; `OpenTheDoorsContent.tsx:114`, `:143`, `:177`, `:240`, `:290`, `:319`.
- **Failure:** Every single section uses the same `text-xs uppercase tracking-[0.12em] text-accent` eyebrow. The uppercase mono treatment flattens hierarchy and turns navigational labels into wallpaper. No section is allowed to breathe without an all-caps prefix.

### 1.4 Mono font is used for everything, not just data
- **Where:** `BentoBoard.tsx:36-37`; `ProcessLockup.tsx:30`; `VelocityGapContent.tsx:165`, `:176`, `:187`, `:212`, `:305`; `OpenTheDoorsContent.tsx:127`, `:157`, `:168`, `:187`, `:209`, `:230`, `:305`.
- **Failure:** JetBrains Mono is used for eyebrows, card labels, sender names, tier descriptions, and process labels. It reads as infrastructure/terminal, not peer-level BD operator. Reserve mono for numbers and code-like metadata only.

### 1.5 `text-balance` exists but is never applied
- **Where:** `app/globals.css:30-32` defines the utility; no component imports or uses it.
- **Failure:** Headlines like "You don't need a Head of BD. You need deals." will produce orphans at certain widths. The utility was defined and then forgotten.

### 1.6 Giant index numbers are rendered as decoration, not hierarchy
- **Where:** `VelocityGapContent.tsx:113-114`.
- **Failure:** The `01/02/03/04` indices use `text-index font-semibold text-surface-elevated`. `surface-elevated` (#162238) on `surface` (#0E1726) is barely visible. The numbers are supposed to anchor the process but they dissolve into the background.

---

## 2. Color Mistakes

### 2.1 Palette is a single flat navy sheet
- **Where:** `tailwind.config.ts:11-42`.
- **Failure:** `base #0A1422`, `base-deep #050C18`, `surface #0E1726`, `surface-soft #0E1829`, `surface-muted #142338`, `border #1E324E` are so close in value that alternating sections creates mud, not depth. The page reads as one continuous dark plane with thin rules.

### 2.2 Accent blue is timid and misassigned
- **Where:** `tailwind.config.ts:24-29`; `DealRoomContent.tsx:38`, `:68`, `:101`, `:123`, `:188`, `:215`; `VelocityGapContent.tsx:37`, `:65`, `:141`, `:161`, `:204`; `OpenTheDoorsContent.tsx:73`, `:99`, `:127`, `:157`, `:185`, `:207`, `:229`, `:248`, `:294`.
- **Failure:** `#2357C4` is used for tiny eyebrows, thin borders, hover states, and node dots. Primary CTAs are `bg-ink text-base` (white on navy). The accent never gets a dominant moment, so the eye has nowhere to land.

### 2.3 "Door" color tokens are dead
- **Where:** `tailwind.config.ts:15`, `:23`, `:33`, `:38`.
- **Failure:** `base.door`, `surface.door`, `ink.door`, and `muted.door` are defined but never used in `OpenTheDoorsContent.tsx` (it uses `bg-surface`, `text-ink`, `text-muted`). These tokens are speculative palette noise.

### 2.4 Hardcoded colors duplicate the token system
- **Where:** `app/globals.css:17-18` sets `background-color: #0A1422` and `color: #F4F6FA`.
- **Failure:** These values duplicate `base.DEFAULT` and `ink.DEFAULT`. If the tailwind tokens change, the global CSS stays orphaned.

### 2.5 Stage colors in the bento are arbitrary
- **Where:** `BentoBoard.tsx:12-17`.
- **Failure:** "Replied" = muted, "Confirmed" = accent, "Sent" = accent-light, "Legal" = ink. There is no logical temperature or progression; it looks like a color key picked to fill space.

---

## 3. Layout Mistakes

### 3.1 All three pages are the same layout with different hero widgets
- **Where:** `app/deal-room/page.tsx:12-21`; `app/velocity-gap/page.tsx:12-21`; `app/open-the-doors/page.tsx:12-21`.
- **Failure:** Every page uses `Nav` → `main bg-base-deep text-ink pt-16 md:pt-20` → `Footer`. The hero is always `min-h-[calc(100dvh-5rem)]`, `max-w-[1400px]`, `grid grid-cols-1 lg:grid-cols-12`, identical padding. Three concepts, one chassis.

### 3.2 Hero visual in Deal Room is fake-dashboard theater
- **Where:** `components/deal-room/BentoBoard.tsx:5-51`.
- **Failure:** A 3×3 grid of pretend CRM cards ("Al Maryah F&B", "DIFC Fund", "JLT SaaS") is generic SaaS filler from 2023. It explains nothing about PropelBD and the stage labels are self-referential noise.

### 3.3 ProcessLockup uses unanchored absolute coordinates
- **Where:** `components/deal-room/ProcessLockup.tsx:5-49`.
- **Failure:** Step boxes are absolutely positioned with percentage `left`/`top`. The connecting SVG path (`M 60 60 C 160 40...`) is hardcoded in pixel space and does not actually connect the boxes at any viewport. It is fake geometry.

### 3.4 Open The Doors "door" is a CSS rectangle
- **Where:** `OpenTheDoorsContent.tsx:44-65`.
- **Failure:** The hero door is an SVG with five rectangles and a circle. No shadow, no panel depth, no material, no perspective. It reads as a wireframe abstraction, not a premium visual metaphor.

### 3.5 Deal Table grid math is arbitrary
- **Where:** `OpenTheDoorsContent.tsx:178-233`.
- **Failure:** A 4-column grid with card spans of `2 + 1 + 1` on row one and `2 + 2` on row two. The asymmetric spans have no narrative purpose; they are bento-for-bento's-sake. The "Document" label repeats six times with no value.

### 3.6 Operating System diagram is a straight line with hardcoded positions
- **Where:** `OpenTheDoorsContent.tsx:241-282`.
- **Failure:** `viewBox="0 0 700 200"` with nodes at x=80, 260, 440, 620. Not responsive. The line is straight, the labels sit 40px below, and the whole thing looks like a timeline graphic from a PowerPoint template.

### 3.7 Markets section uses magic-number margins
- **Where:** `VelocityGapContent.tsx:140`.
- **Failure:** `lg:mr-8` and `lg:ml-8` on alternating city cards create uneven gutters for no compositional reason.

### 3.8 Duplicate component directory with an empty file
- **Where:** `components/open-the-doors/OpenTheDoorsContent.tsx` and `components/open-theDoors/OpenTheDoorsContent.tsx` (0 bytes).
- **Failure:** Sloppy file structure. The empty duplicate proves the build was not reviewed.

---

## 4. Motion Mistakes

### 4.1 Every element uses the same Framer entrance
- **Where:** `DealRoomContent.tsx:34-63`, `:93-105`, `:119-150`, `:161-178`, `:188-192`; `VelocityGapContent.tsx:33-72`, `:105-123`, `:134-145`, `:156-188`, `:197-199`; `OpenTheDoorsContent.tsx:69-106`, `:117-134`, `:149-169`, `:179-232`, `:243-279`, `:293-299`.
- **Failure:** `initial={{ opacity: 0, y: 24/32 }}` → `whileInView={{ opacity: 1, y: 0 }}` with the same `cubic-bezier(0.19, 1, 0.22, 1)`. It is the default agency-website motion and feels algorithmic, not authored.

### 4.2 Canvas animation ignores accessibility and performance
- **Where:** `components/velocity-gap/TrajectoryField.tsx:14-113`.
- **Failure:** `requestAnimationFrame` runs continuously with sine calculations. There is no `prefers-reduced-motion` check inside the component and no pausing when off-screen. The CSS media query in `globals.css:35-43` cannot stop a canvas rAF loop.

### 4.3 Bento cards scale in like a loading screen
- **Where:** `BentoBoard.tsx:27-41`.
- **Failure:** Cards scale in with a 0.08s stagger. The sequence reads as "please wait while AI loads your dashboard," not as editorial content.

### 4.4 Email stream uses arbitrary directional motion
- **Where:** `OpenTheDoorsContent.tsx:119-122`.
- **Failure:** `x: i % 2 === 0 ? -40 : 40`. Odd and even emails slide from opposite directions for no narrative reason.

### 4.5 Tension Bar fills to 100% with no meaning
- **Where:** `OpenTheDoorsContent.tsx:292-299`.
- **Failure:** A progress bar animates to full width, but there is no progression being measured. It is decorative motion pretending to be data.

---

## 5. Component Mistakes

### 5.1 Nav has no background or blur on scroll
- **Where:** `components/shared/Nav.tsx:7-19`.
- **Failure:** Fixed transparent header. As soon as the user scrolls, nav text overlaps body content with no backdrop. Looks unfinished.

### 5.2 Footer is a bare minimum stub
- **Where:** `components/shared/Footer.tsx:1-17`.
- **Failure:** Logo, one-line description, markets, email. No social proof, no LinkedIn, no navigation, no legal. For a premium B2B service, this is a trust vacuum.

### 5.3 SectionHeader enforces monotony
- **Where:** `components/shared/SectionHeader.tsx:1-19`.
- **Failure:** One component drives every section heading. Same eyebrow, same `text-display`, same `max-w-[55ch]`. The page cannot develop rhythm because every section starts with the same typographic sentence structure.

### 5.4 Contact form has no function
- **Where:** `DealRoomContent.tsx:196-222`.
- **Failure:** `onSubmit={(e) => e.preventDefault()}` does nothing. No validation, no error states, no success feedback, no API integration. It is a visual prop.

### 5.5 CTAs are visually identical across all contexts
- **Where:** `Nav.tsx:12-17`; `DealRoomContent.tsx:66-75`; `VelocityGapContent.tsx:65-71`; `OpenTheDoorsContent.tsx:99-105`, `:204-211`, `:325-331`.
- **Failure:** Every button is `bg-ink text-base rounded-editorial px-6 py-3`. Primary, secondary, nav, hero, footer, and contact CTAs all share the same shape and weight. No hierarchy.

---

## Top 5 Root Causes

1. **One template, three skins.** The same 12-column hero, same `SectionHeader`, same motion recipe, and same button are reused across all three concepts. There is no visual differentiation between "Deal Room," "Velocity Gap," and "Open The Doors."

2. **Decorative data everywhere.** Fake CRM cards, fake network nodes, fake progress bars, fake charts, and a non-functional contact form. The pages ask for trust without offering proof.

3. **No typographic system.** A single font does all the work, line-height is uniformly claustrophobic, and every section uses the same uppercase mono eyebrow. Hierarchy is flattened.

4. **Accent color is afraid of itself.** `#2357C4` is relegated to eyebrows and thin borders. CTAs, the most important interactive elements, do not use it. The palette reads as flat navy mud.

5. **Motion is copy-paste, not narrative.** The same `opacity/y` entrance is applied to every element. There is no scroll-linked storytelling, no ambient hierarchy, and no accessibility guard for the canvas animation.

---

## Top 5 Concrete Fixes

1. **Author three distinct page architectures.** Give each concept its own hero structure, section rhythm, and visual device. Do not share `SectionHeader` or the 12-column split across all three. Delete or refactor the shared component if it enforces sameness.

2. **Replace fake visuals with real narrative objects.** Kill the bento CRM, the hardcoded SVG path, and the straight-line process diagram. Use one bold editorial device per page: a kinetic type lock-up for Deal Room, a real network/system diagram for Velocity Gap, and a crafted door illustration for Open The Doors.

3. **Build a real type system.** Separate display and body fonts (or at least weights/styles). Raise hero line-height to `1.0–1.05`, drop `tracking-tight` on large sizes, and vary eyebrows between uppercase mono, sentence-case sans, and simple rules.

4. **Make the accent work for its money.** Use `#2357C4`/`#3A71E0` for primary CTAs and one focal element per section. Stop using it for every eyebrow. Add a subtle radial glow or gradient behind the hero to create atmospheric depth without violating the no-gradient-text rule.

5. **Kill the default motion recipe.** Vary entrances by content type: mask-reveal for headlines, horizontal slide for timeline nodes, scale-only for cards. Add `prefers-reduced-motion` handling inside `TrajectoryField.tsx` and pause the canvas when off-screen.

---

AUDIT_DESIGN-EXECUTION::DONE::2026-07-10T10:53:56Z
