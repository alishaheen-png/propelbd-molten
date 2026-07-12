# Velocity Gap — Visual / Design / UX Critique

Scope: `dist/velocity-gap.html` + source in `app/velocity-gap/page.tsx`, `components/velocity-gap/VelocityGapContent.tsx`, `components/velocity-gap/TrajectoryField.tsx`, `components/shared/Nav.tsx`, `components/shared/Footer.tsx`, `tailwind.config.ts`.

Verdict: This is the strongest of the three concepts structurally, but it still reads like a polished starter template rather than a premium fractional-BD brand. The biggest killers are an empty hero, overused monospace, borrowed SCME tier names, and decorative "data" elements that ask for trust without earning it.

---

## 1. Hero has a visual-shaped void on the right

- **Element:** Hero grid at `app/velocity-gap/page.tsx:18-39`. Copy sits in `lg:col-span-5`; the `TrajectoryField` canvas is full-bleed behind the text at very low opacity.
- **Why it fails:** It looks like a left-aligned headline floating in a blank dark box. The canvas nodes are so faint they do not register as an intentional visual, so the layout feels unfinished rather than intentionally asymmetric.
- **Fix:** Compose the hero as a real split: copy in `lg:col-span-7` (or 8) and `TrajectoryField` as a bounded right panel in `lg:col-span-5` (or 4). Increase canvas contrast (line alpha 0.25–0.4, larger labels, `mix-blend-screen`) so the network actually reads as a kinetic system.

## 2. Headline is clamped too tight

- **Element:** `h1` class `font-display text-hero font-semibold text-ink leading-[0.95] tracking-tighter max-w-[14ch]` at `app/velocity-gap/page.tsx:23`.
- **Why it fails:** Line-height 0.95 and `tracking-tighter` on Bricolage at `clamp(3rem,8vw,7rem)` make ascenders/descenders crash. `max-w-[14ch]` forces an ugly break ("Head of" orphan) and prevents the line from reading with natural rhythm.
- **Fix:** Use `leading-[1.05]` or `leading-[1.1]`, swap `tracking-tighter` for `tracking-tight` (~ -0.02em), remove `max-w-[14ch]`, and add `text-balance`. Let the headline breathe.

## 3. Monospace is used everywhere, chilling the voice

- **Element:** Eyebrows, CTAs, Founder-math labels, tier rhythms, and chart caption all use `font-mono` (`VelocityGapContent.tsx:31,57,98,132,151,162,173,184,192`; `app/velocity-gap/page.tsx:22,30-32`).
- **Why it fails:** JetBrains Mono reads as infra/terminal, not peer-level BD operator. Piling `uppercase tracking-widest` on top turns every label into a warning sticker.
- **Fix:** Reserve mono for quantitative data only (node labels, chart axes, numbers). Render eyebrows and CTAs in Bricolage; drop `uppercase tracking-widest` to `tracking-wide` or normal, and use sentence/title case.

## 4. Palette is near-black, not navy/blue kinetic

- **Element:** `bg-base-deep` `#08101F`, `bg-surface-soft` `#0E1829`, `bg-base` `#0A1422` in `tailwind.config.ts:13-21`.
- **Why it fails:** The page reads as charcoal/black with a thin blue accent. There is no atmospheric depth, no motion, and no sense of the "navy/blue kinetic" brand.
- **Fix:** Shift base to a richer deep navy (e.g., `#0B1A3A` for deep sections). Add a subtle radial accent glow behind the hero (not on text), a faint grid or noise texture, and double the canvas opacity so the blue network defines the mood.

## 5. "How We Move" is four equal cards with a token stagger

- **Element:** Process grid `.grid-cols-1.md:grid-cols-2.gap-4` with `md:mt-12` on odd items at `VelocityGapContent.tsx:84-105`.
- **Why it fails:** This is the anti-slop "3-equal-cards" pattern, just with four. The stagger is a superficial trick; every card shares identical border, radius, padding, and type scale.
- **Fix:** Replace with an editorial vertical flow: each step as a row containing a huge `01/02/03/04` index, a bold verb, and a short sentence, connected by a vertical accent line. On desktop, a horizontal timeline works; on mobile, stack cleanly.

## 6. Tier block borrows SCME names and uses a bento-equal layout

- **Element:** `tiers` array `"Gold"`, `"Diamond"`, `"Platinum"` and the `md:grid-cols-2` bento at `VelocityGapContent.tsx:22-26,139-177`.
- **Why it fails:** Gold / Diamond / Platinum is SCME canon, not PropelBD. The layout is still a 3-equal-ish bento; with no pricing and one-line scopes it looks like placeholder packaging.
- **Fix:** Rename tiers to PropelBD-specific names (e.g., "Scout", "Stack", "Scale" or "Advisory", "Embedded", "Revenue Lead"). Restructure asymmetrically: one highlighted primary tier in a wider column with real scope bullets, or a clean comparison table.

## 7. Pipeline Velocity chart is a fake chart

- **Element:** SVG Bézier curve + fill labelled "Deal velocity over a quarter" at `VelocityGapContent.tsx:107-137`.
- **Why it fails:** No axes, no units, no actual data. It reads as a meaningless growth-graph decoration — exactly the corporate filler this brand should avoid, and it risks looking like fabricated proof.
- **Fix:** Remove it or replace with a credible system diagram: a week-by-week milestone strip ("Week 0: ICP map", "Week 4: first meetings", "Week 12: signed SOW") tied to real deliverables. If you do not have metrics, do not draw a chart.

## 8. Sector ticker is ghost text that adds no value

- **Element:** Marquee at `VelocityGapContent.tsx:5-13,73-82,200-207` with `text-ink/10` sector names duplicated three times.
- **Why it fails:** 10% opacity on a dark background is nearly invisible. The sectors are unverified and the motion looks like a substitute for proof.
- **Fix:** Delete it. If sectors matter, build a static "Where we play" module with high-contrast market names (Dubai/Abu Dhabi focused) and one proof line per market.

## 9. The bottom CTA is a mailto dressed as a booking link

- **Element:** `mailto:ali@propelbd.co?subject=20-minute%20BD%20call` styled as "Book a 20-minute call" at `VelocityGapContent.tsx:191-196`.
- **Why it fails:** The label promises a calendar action; the href dumps the user into an email compose. On a premium B2B page that mismatch feels cheap. The same button label is repeated in the nav and hero, so users learn to ignore it.
- **Fix:** Make it a real scheduling link (Calendly, Savvycal, etc.) and change the bottom label to "Pick a time". Add a secondary text link "Or email ali@propelbd.co" for users who prefer mail.

## 10. No trust/proof layer before the ask

- **Element:** The page flows directly from tiers into the contact section (`VelocityGapContent.tsx:181-197`) and a bare footer (`components/shared/Footer.tsx:1-12`).
- **Why it fails:** A fractional BD agency is asking for a call without establishing credibility. The page tells, never shows.
- **Fix:** Insert a proof section before contact: a founder quote, a short "Recent wins" list (real, anonymized if necessary), or logos of markets/networks. Add a contact email and LinkedIn link to the footer.

---

## Brand-lock check

- No gold (#C9A84C) found in CSS.
- However, the tier names "Gold / Diamond / Platinum" are SCME vocabulary and must change.
- Markets are correctly limited to Dubai and Abu Dhabi (`components/shared/Footer.tsx:9`).
- No fabricated numbers/achievements beyond generic "six months to recruit" and an unlabelled chart; the chart is the biggest risk.

