# NIM Audit Swarm — PropelBD v3 Website Failure

## Agent 1

**PropelBD v3 Design Audit: 10 Brutal Truths**  
*Ranked by severity, with exact file references and fixes.*  

---

### **1. Hero Bento Board = Generic SaaS Template**  
**File:** `components/deal-room/BentoBoard.tsx` (line 19-51)  
**Why:** 3x3 grid of "CRM cards" with fake data ("Al Maryah F&B", "DIFC Fund") is visual cotton candy — no narrative, no trust. Looks like a free Figma template.  
**Fix:** Replace with a single bold animated type piece: `Scout → Position → Open → Close` as a kinetic path that moves across the screen. Use one accent color, not four.  

---

### **2. Four-Equal-Cards Pipeline = Process Theater**  
**File:** `components/deal-room/DealRoomContent.tsx` (line 48-63)  
**Why:** Equal-width cards for Scout/Position/Open/Close drain momentum. Hairline grid + `gap-px` is a lazy "premium UI" trope.  
**Fix:** Stagger cards in a 1-2-1 rhythm. Add a connecting line that draws on scroll. Kill the grid dividers.  

---

### **3. TrajectoryField SVG = Faint Mess**  
**File:** `components/velocity-gap/TrajectoryField.tsx`  
**Why:** Canvas nodes are 90% transparent — reads as an accident, not a system. No contrast, no labels, no kinetic intent.  
**Fix:** Increase line alpha to 0.3, add oversized node labels (e.g., "DIFC → ADGM"), use `mix-blend-screen` for glow. Animate nodes pulsing on scroll.  

---

### **4. Vertical Text on Mobile = UX Fail**  
**File:** `components/open-the-doors/OpenTheDoorsContent.tsx` (line 44)  
**Why:** `writing-mode-vertical` on mobile squashes a 12-word headline into a phone-edge readability disaster.  
**Fix:** Kill vertical text. Use horizontal `text-[9vw]` with `max-w-[14ch]` to avoid line collapse.  

---

### **5. Door SVG = PowerPoint 2003**  
**File:** `components/open-the-doors/OpenTheDoorsContent.tsx` (line 53)  
**Why:** CSS rectangle with a circle "knob" is not a door — it’s a geometric placeholder. No material depth, no hinge, no shadow.  
**Fix:** Replace with an SVG door in perspective: 3D bevel, inner shadow, brushed-metal handle. Animate hinge rotation on scroll.  

---

### **6. Monospace Chilling the Voice**  
**File:** `components/velocity-gap/VelocityGapContent.tsx` (line 31,57,98,132,151,162,173,184,192)  
**Why:** JetBrains Mono + `tracking-widest` on every label turns BD into sysadmin UI. Not a peer-level brand.  
**Fix:** Restrict mono to quantitative nodes (e.g., "12 meetings", "Q3"). Use Bricolage for all narrative text.  

---

### **7. Empty Hero Right Panel**  
**File:** `app/velocity-gap/page.tsx` (line 18-39)  
**Why:** Copy in `lg:col-span-5` leaves `lg:col-span-5` as a void. Feels like a missed visual opportunity.  
**Fix:** Shift copy to `lg:col-span-7`, make `TrajectoryField` a bounded right panel with `lg:col-span-5` and 80% width.  

---

### **8. Hero Line-Height Collapse**  
**File:** `app/velocity-gap/page.tsx` (line 23)  
**Why:** `leading-[0.95]` + `tracking-tighter` on Bricolage at `text-hero` causes ascender crashes and forced line breaks.  
**Fix:** Use `leading-[1.1]` + `tracking-tight` (-0.02em). Remove `max-w-[14ch]`. Add `text-balance`.  

---

### **9. Animate-Pulse Scroll Cue = 2015 Called**  
**File:** `components/open-the-doors/OpenTheDoorsContent.tsx` (line 67)  
**Why:** Pulsing "Scroll down" arrow is a nervous, outdated trope. Conflicts with navy/blue restraint.  
**Fix:** Replace with a static `↑` icon + 1px vertical line that shortens on scroll. Animate opacity, not scale.  

---

### **10. Section Formula = Center-Left-Eyebrow-Content**  
**File:** All three concepts (e.g., `DealRoomContent.tsx`, `VelocityGapContent.tsx`, `OpenTheDoorsContent.tsx`)  
**Why:** Every section uses the same pattern: centered header + left-aligned content. No asymmetry, no surprise.  
**Fix:** Break the grid. Use offset headlines, full-bleed visuals, and staggered columns. Steal DEPT’s ticker + hover-reveal pattern.  

---

**Final Verdict:** This design is hiding behind "safe" Tailwind patterns instead of earning its premium BD brief. Kill the cards, kill the pulse, kill the vertical text. Let the type and one visual system (door/trajectory) do the work. Reference Linear’s bold headlines and R/GA’s scale contrast — not SCME’s pricing tiers.

---

## Agent 2

nim-exhausted

---

## Agent 3

nim-exhausted

---

## Agent 4

**10 Stealable Techniques Missing in PropelBD v3 + Why They’re Absent**  

---

### **1. Single-Statement Hero with Staggered Word Animation (Linear)**  
**Missing Because:** Heroes include multiple elements (illustrations, CTAs, subtitles) instead of focusing on one bold statement.  
**Elite Technique:** A single headline split into word tokens that stagger-fade in (e.g., Linear’s hero).  
**Why Not Applied:** Overcompensation with visual filler (e.g., dashboard bento, trajectory SVG) dilutes focus. The brand’s “no gold, no fluff” directive was misinterpreted as “add more parts.”  

---

### **2. Compressed Sans Headline with No Supporting Visual (DEPT, R/GA)**  
**Missing Because:** Headlines are paired with illustrations or bento boards, reducing typographic authority.  
**Elite Technique:** A massive, compressed sans-serif headline (e.g., DEPT’s “Invention at the intersection…” ) as the *only* hero element.  
**Why Not Applied:** Team defaulted to “safe” hero layouts with dual-column text+visual, fearing empty space would look incomplete.  

---

### **3. Asymmetrical Vertical Rhythm (R/GA, Area 17)**  
**Missing Because:** Sections use rigid 12-col grids with centered content, creating symmetrical templates.  
**Elite Technique:** Staggered columns, uneven spacing, and off-center anchors (e.g., R/GA’s work index) to imply motion.  
**Why Not Applied:** Tailwind’s grid system and lack of layout experimentation led to formulaic spacing (e.g., `lg:grid-cols-4`, `gap-12`).  

---

### **4. Horizontal Scroll Index (DEPT’s Client Ticker)**  
**Missing Because:** All content is vertical, missing opportunities for kinetic, scroll-driven storytelling.  
**Elite Technique:** A horizontal scroll section for artifacts, testimonials, or process steps (e.g., DEPT’s client ticker).  
**Why Not Applied:** Fear of UX complexity and lack of scroll-driven animation logic in Framer Motion implementation.  

---

### **5. Scale Contrast in Tier/Process Lists (R/GA, Cappen)**  
**Missing Because:** Pipeline and tier cards use uniform sizing, flattening hierarchy.  
**Elite Technique:** Varying font sizes and spacing to imply priority (e.g., R/GA’s project names at 3rem vs. descriptors at 0.8rem).  
**Why Not Applied:** Over-reliance on Tailwind’s `grid-cols-*` and `gap-8` created visually democratic layouts.  

---

### **6. Subtle Scroll Cue (Locomotive, Dogstudio)**  
**Missing Because:** “Scroll to enter” uses `animate-pulse`, a tired trope.  
**Elite Technique:** A static, all-caps mono label with a 1px vertical line that shortens on scroll (e.g., Locomotive’s projects page).  
**Why Not Applied:** Team defaulted to Tailwind’s `animate-pulse` utility without considering brand-appropriate alternatives.  

---

### **7. Monochrome Imagery with Single Accent Pop (Mercury, Hello Monday)**  
**Missing Because:** Illustrations (e.g., TrajectoryField) use multiple blues without a focal accent.  
**Elite Technique:** Near-monochrome visuals (navy/white) with one accent color for interactive elements (e.g., Mercury’s case studies).  
**Why Not Applied:** Overuse of `accent` and `muted` colors in illustrations created visual noise, violating “navy/blue kinetic” lock.  

---

### **8. Fluid Type Scaling (Vercel, Cappen)**  
**Missing Because:** `clamp()` scales break on small screens (e.g., `text-hero` at 3rem min).  
**Elite Technique:** Dynamic type scales using `calc()` or `env()` for smoother responsive transitions.  
**Why Not Applied:** Team relied on Tailwind’s `text-{size}` and `clamp()` without testing edge cases (e.g., mobile vertical rotation).  

---

### **9. Negative Space as Deliberate Focus Tool (Buck, Area 17)**  
**Missing Because:** Sections like Velocity Gap’s hero feel “empty” rather than intentionally sparse.  
**Elite Technique:** Use empty space to spotlight a single element (e.g., Buck’s case study headers).  
**Why Not Applied:** Fear of “wasted space” led to filling grids with copy/visuals, even when unnecessary.  

---

### **10. Micro-Interactions on Hover (Hello Monday, Locomotive)**  
**Missing Because:** CTAs only change `bg-opacity` or scale slightly; no color shifts or reveals.  
**Elite Technique:** Hover states with color transitions (e.g., navy → accent) or subtle reveals (e.g., underline slide).  
**Why Not Applied:** Over-reliance on Tailwind’s `hover:` and `active:` utilities without custom transitions.  

---

**Root Cause:** The team prioritized Tailwind’s speed and Framer’s ease over editorial design rigor. Elite references demand *deliberate asymmetry*, *typographic confidence*, and *systematic motion*—all missing here. Fix requires killing “safe” patterns and embracing constraint (e.g., one hero statement, one accent color, one grid variation).

---

