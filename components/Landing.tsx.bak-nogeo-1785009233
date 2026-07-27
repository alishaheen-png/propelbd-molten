"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/* PropelBD — THE FORGE (v2, alive).
   One WebGL particle organism (MoltenOrganism) lives behind the page and is
   forged by scroll: dust -> scatter -> targeting reticle -> funnel -> outreach
   arcs -> orbit -> engine core -> split -> constellation (321) -> molten vortex.
   Chapters are CSS-sticky (no pin-spacer fights with Lenis). Organism state is
   scrubbed; text is threshold-tweened and never plays backwards. Text sits on
   scrims + repulsor airspace (data-repel). Founder card is gone — this is a
   site to deploy, not a company card. Reduced-motion: chapters flatten to a
   plain readable page (globals.css). */

const MoltenOrganism = dynamic(() => import("./MoltenOrganism"), { ssr: false });

const ACCENT = "#FF5A1F";
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
// Ali-gated offer terms (Hormozi risk-reversal). Flip to true on Ali's word — copy ships instantly.
const SHOW_GUARANTEE = false;
const SHOW_PAY_PER_MEETING = false;

const ENGINE_BEATS = [
  ["Targeting", "ICP, geography, STP — who to chase and why.", "The organism locks a reticle on the market."],
  ["Lead-gen", "Verified pipeline, not scraped guesses.", "A wide rain of prospects narrows to a stream."],
  ["Outreach", "Sequences that get replies, built to your voice.", "Arcs fire outward — the bright ones come back."],
  ["Sales", "Trained to close what the engine surfaces.", "Orbits tighten. Captured buyers lock in."],
  ["Backend", "The strategy and data that keeps it compounding.", "Every part nests into one running core."],
] as const;

/* Section kicker. Deliberately NOT a numbered 01/02/03 cadence across the site
   (that reads as AI scaffolding). Numbers survive only inside the Engine, which
   is a genuine ordered sequence. Elsewhere: a short named marker with a leading
   ember tick — a brand system, not a reflex. */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 font-mono text-[13px] uppercase tracking-[0.18em] text-[#AEACA3]">
      <span aria-hidden className="h-px w-6" style={{ backgroundColor: ACCENT }} />
      {children}
    </span>
  );
}

export default function Landing() {
  const root = useRef<HTMLDivElement>(null);
  const beatsWrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set("[data-reveal], [data-hero], .problem-line", { opacity: 1, y: 0 });
        gsap.set(".beat-block", { opacity: 1 });
        return;
      }

      // Lenis smooth scroll wired into ScrollTrigger
      const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      const ticker = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      // hero ignite — split-char forge: letters surface like cooling metal
      const h1 = root.current?.querySelector<HTMLElement>("h1[data-hero]");
      if (h1 && !h1.dataset.split) {
        h1.dataset.split = "1";
        const splitNode = (node: Node): void => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent) {
            const frag = document.createDocumentFragment();
            for (const word of node.textContent.split(/(\s+)/)) {
              if (!word) continue;
              if (/^\s+$/.test(word)) { frag.appendChild(document.createTextNode(" ")); continue; }
              const w = document.createElement("span");
              w.className = "forge-word";
              w.setAttribute("aria-hidden", "true");
              for (const ch of word) {
                const s = document.createElement("span");
                s.className = "forge-char";
                s.textContent = ch;
                w.appendChild(s);
              }
              frag.appendChild(w);
            }
            node.parentNode?.replaceChild(frag, node);
          } else if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName !== "BR") {
            Array.from(node.childNodes).forEach(splitNode);
          }
        };
        Array.from(h1.childNodes).forEach(splitNode);
      }
      // preloader — forge ignition. First visit only per tab; repeat visits go
      // straight to the hero (no ritual on every reload).
      const pl = root.current?.querySelector<HTMLElement>(".preloader");
      const seen = sessionStorage.getItem("pbd-pl") === "1";
      let heroDelay = 0.25;
      if (pl && !seen) {
        sessionStorage.setItem("pbd-pl", "1");
        heroDelay = 1.5;
        const bar = pl.querySelector<HTMLElement>(".preloader-bar");
        const word = Array.from(pl.querySelectorAll<HTMLElement>(".preloader-char"));
        const tl = gsap.timeline();
        tl.set(pl, { display: "flex" })
          .from(word, { opacity: 0, y: 14, duration: 0.4, stagger: 0.045, ease: "power2.out" })
          .to(bar, { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, 0.1)
          .to(word, { color: ACCENT, textShadow: "0 0 32px rgba(255,90,31,0.5)", duration: 0.35, stagger: 0.03 }, "-=0.35")
          .to(pl, { clipPath: "inset(0 0 100% 0)", duration: 0.6, ease: "power3.inOut" }, "+=0.08")
          .set(pl, { display: "none" });
      } else if (pl) {
        gsap.set(pl, { display: "none" });
      }

      const nav = gsap.timeline({ delay: heroDelay });
      nav.from("[data-hero]:not(h1)", { opacity: 0, y: 26, duration: 0.9, stagger: 0.09, ease: "power3.out" });
      nav.from(".forge-char", {
        opacity: 0, y: 30, filter: "blur(6px)", duration: 0.7,
        stagger: { each: 0.016, from: "start" }, ease: "power3.out",
      }, 0.1);
      nav.to(".ignite .forge-char", { color: ACCENT, textShadow: "0 0 46px rgba(255,90,31,0.55), 0 0 12px rgba(255,90,31,0.7)", duration: 0.9, stagger: 0.04, ease: "power2.out" }, "-=0.5");
      nav.add(() => { document.querySelector(".ignite")?.classList.add("ignited"); });

      // RESTRAINT (council verdict — kill motion competing with the embers):
      // magnetic CTA-lean, scroll-velocity marquee skew, and a redundant DOM
      // cursor-trail were cut here. DESIGN.md locks "must NOT move: the wordmark,
      // the primary CTA" — magnetic lean broke that rule outright. The cursor-ember
      // DOM div duplicated what the WebGL organism's own uMouse/uMouseUV reactivity
      // already renders (shader-side swirl + field heat bloom) — one spectacle, not
      // two. Stillness around the embers is the contrast; the void frames them.
      const magCleanups: (() => void)[] = [];

      // section reveals — emerge, don't appear; never reverse
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          opacity: 0, y: 14, duration: 0.65, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
        });
      });

      // PROBLEM — three lines surface at thresholds of the sticky chapter
      const problemSec = root.current?.querySelector<HTMLElement>("#problem");
      if (problemSec) {
        const lines = Array.from(problemSec.querySelectorAll<HTMLElement>(".problem-line"));
        gsap.set(lines, { opacity: 0, y: 14 });
        const played = lines.map(() => false);
        let closerPlayed = false;
        ScrollTrigger.create({
          trigger: problemSec,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            [0.12, 0.38, 0.62].forEach((t, i) => {
              if (!played[i] && self.progress > t && lines[i]) {
                played[i] = true;
                gsap.to(lines[i], { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" });
              }
            });
            if (!closerPlayed && self.progress > 0.82) {
              closerPlayed = true;
              const closer = problemSec.querySelector(".problem-closer");
              if (closer) gsap.to(closer, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
            }
          },
        });
      }

      // ENGINE — five beats crossfade with chapter progress
      const engineSec = root.current?.querySelector<HTMLElement>("#engine");
      if (engineSec && beatsWrap.current) {
        const blocks = Array.from(beatsWrap.current.querySelectorAll<HTMLElement>(".beat-block"));
        const rail = Array.from(engineSec.querySelectorAll<HTMLElement>(".beat-tick"));
        const setters = blocks.map((b) => gsap.quickSetter(b, "opacity"));
        const xSetters = blocks.map((b) => gsap.quickSetter(b, "x", "px"));
        ScrollTrigger.create({
          trigger: engineSec,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            const p = self.progress;
            blocks.forEach((_, i) => {
              const c = (i + 0.5) / blocks.length;
              const d = Math.abs(p - c) * blocks.length;
              // tight window: one beat readable at a time, clean dead-zone between
              const o = Math.max(0, 1 - Math.pow(d * 2.2, 6));
              setters[i](o);
              xSetters[i]((c - p) * 220); // beats step in from the right, exit left
            });
            const active = Math.min(blocks.length - 1, Math.floor(p * blocks.length));
            rail.forEach((t, i) => {
              t.classList.toggle("filled", i <= active);
              t.classList.toggle("active", i === active);
            });
          },
        });
      }

      // PROOF — numbers count up once when the band enters
      const proofSec = root.current?.querySelector<HTMLElement>("#proof");
      if (proofSec) {
        const counters = Array.from(proofSec.querySelectorAll<HTMLElement>("[data-count]"));
        counters.forEach((c) => {
          const target = Number(c.dataset.count || "0");
          const suffix = c.dataset.suffix || "";
          const proxy = { v: 0 };
          let last = -1;
          gsap.to(proxy, {
            v: target, duration: 1.4, ease: "power2.out",
            scrollTrigger: { trigger: proofSec, start: "top 72%", toggleActions: "play none none none" },
            onUpdate: () => {
              const v = Math.round(proxy.v);
              if (v === last) return;
              last = v;
              c.textContent = `${v.toLocaleString()}${suffix}`;
            },
          });
        });
      }

      // (pointer-following proof-cell glow cut — restraint pass: the numbers carry
      // the section on typographic weight alone, no competing micro-interaction)

      // scroll progress hairline (orientation for a long cinematic scroll)
      const prog = root.current?.querySelector<HTMLElement>(".scroll-progress");
      if (prog) {
        ScrollTrigger.create({
          trigger: document.documentElement,
          start: 0,
          end: () => document.documentElement.scrollHeight - window.innerHeight,
          onUpdate: (self) => { prog.style.transform = `scaleX(${self.progress})`; },
        });
      }

      // CTA molten pulse
      const cta = root.current?.querySelector<HTMLElement>("#contact a[data-cta-heat]");
      if (cta) {
        gsap.to(cta, {
          boxShadow: "0 0 44px rgba(255,90,31,0.4)", repeat: -1, yoyo: true, duration: 2.4, ease: "sine.inOut",
          scrollTrigger: { trigger: "#contact", start: "top 70%" },
        });
      }

      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => {
        magCleanups.forEach((fn) => fn());
        gsap.ticker.remove(ticker);
        lenis.destroy();
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative min-h-screen bg-[#0B0B0C] text-[#ECEAE3] antialiased overflow-clip">
      {/* THE ORGANISM — fixed WebGL canvas behind everything */}
      <MoltenOrganism />

      {/* grain + page-edge vignette (focus stays center; buys contrast at margins) */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] opacity-[0.05] mix-blend-soft-light"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[1]"
        style={{ background: "radial-gradient(130% 130% at 50% 50%, transparent 58%, rgba(0,0,0,0.42) 100%)" }} />

      {/* scroll progress hairline */}
      <div aria-hidden className="scroll-progress fixed inset-x-0 top-0 z-[60] h-[2px] origin-left"
        style={{ backgroundColor: ACCENT, transform: "scaleX(0)" }} />

      {/* preloader — forge ignition ritual (first visit per tab; JS reveals it) */}
      <div aria-hidden className="preloader fixed inset-0 z-[80] hidden flex-col items-center justify-center gap-6 bg-[#0B0B0C]">
        <div className="font-display text-2xl font-bold tracking-[0.3em]">
          {"PROPELBD".split("").map((c, i) => (
            <span key={i} className="preloader-char inline-block">{c}</span>
          ))}
        </div>
        <div className="h-px w-40 overflow-hidden bg-[#1C1C1F]">
          <div className="preloader-bar h-full w-full origin-left scale-x-0" style={{ backgroundColor: ACCENT }} />
        </div>
      </div>

      {/* NAV */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#161619] bg-[#0B0B0C]/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="font-display text-lg font-bold tracking-tight">Propel<span style={{ color: ACCENT }}>BD</span></a>
          <a href="#contact" className="group inline-flex min-h-[44px] items-center gap-2 border border-[#2A2A2E] px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.16em] transition-colors duration-200 hover:border-[#FF5A1F] cursor-pointer">
            Book a deep dive session <span className="transition-transform group-hover:translate-x-0.5" style={{ color: ACCENT }}>→</span>
          </a>
        </div>
      </nav>

      <main id="top" className="relative z-10">
        {/* ============ HERO — DUST ============ */}
        <section data-forge="0:0.9" className="relative flex min-h-[100dvh] flex-col justify-center pb-24 pt-28">
          <div className="mx-auto w-full max-w-[1180px] px-5 md:px-8">
            <div data-repel className="scrim max-w-[46rem] py-10">
              <div data-hero><Label>Fractional AI-BD · Dubai · Abu Dhabi</Label></div>
              <h1 data-hero aria-label="The revenue engine your business is missing." className="text-shadow-editorial mt-6 font-display font-bold leading-[0.95] tracking-[-0.02em]" style={{ fontSize: "clamp(2.7rem, 8vw, 6.6rem)" }}>
                The revenue engine<br />your business is<br /><span className="ignite">missing.</span>
              </h1>
              <div data-hero className="mt-5 font-mono text-[12px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
                AI-run · Operator-deep · Revenue-first
              </div>
              <p data-hero className="mt-7 max-w-[42ch] text-[18px] leading-[1.7] text-[#C9C7BF] md:text-[20px]">
                PropelBD installs the AI-powered business-development engine for UAE companies
                behind on AI — lead-gen, outreach, sales, the backend strategy. We build it,
                prove it works, then it runs.
              </p>
              <div data-hero className="mt-10 flex flex-wrap items-center gap-4">
                <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3.5 font-mono text-[13px] uppercase tracking-[0.14em] text-[#0B0B0C] transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer" style={{ backgroundColor: ACCENT }}>
                  Book a deep dive session →
                </a>
              </div>
              <p data-hero className="mt-9 border-t border-[#1C1C1F] pt-5 font-mono text-[12px] uppercase leading-[2] tracking-[0.14em] text-[#A5A39B]">
                <span className="text-[#ECEAE3]">10,000+</span> leads generated for clients · <span className="text-[#ECEAE3]">6+</span> deals closed across engagements · <span className="text-[#ECEAE3]">verified</span> pipeline, not scraped
              </p>
            </div>
          </div>
          <div aria-hidden className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.3em] text-[#8B897F]">
            Scroll to forge
          </div>
        </section>

        {/* ============ 01 PROBLEM — SCATTER ============ */}
        <section id="problem" data-forge="0.9:2" className="forge-tall relative h-[230vh]">
          <div className="forge-sticky sticky top-0 flex h-screen items-center">
            <div className="mx-auto w-full max-w-[1180px] px-5 md:px-8">
              <div data-repel className="scrim max-w-[44rem] py-10">
                <Label>The problem</Label>
                <h2 className="text-shadow-editorial mt-6 max-w-[18ch] font-display font-bold leading-[1.02] tracking-[-0.02em]" style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)" }}>
                  Your pipeline runs on <span className="text-[#A5A39B]">referrals and luck.</span>
                </h2>
                <div className="mt-10 space-y-6">
                  {[
                    ["No system", "New business shows up when someone remembers you. There's no engine underneath it."],
                    ["Behind on AI", "The tools that could find and warm your next 100 buyers exist — you just haven't deployed them."],
                    ["No time to build", "You could figure it out. But you're running the business, not building a revenue engine."],
                  ].map(([t, d], i) => (
                    <div key={i} className="problem-line grid grid-cols-[auto_1fr] items-baseline gap-x-5 md:grid-cols-[3rem_13rem_1fr] md:gap-x-8">
                      <div className="font-mono text-[13px] text-[#A5A39B]">{String(i + 1).padStart(2, "0")}</div>
                      <div className="font-display text-lg font-semibold tracking-tight md:text-xl">{t}</div>
                      <p className="col-start-2 text-[17px] leading-[1.7] text-[#C9C7BF] md:col-start-3">{d}</p>
                    </div>
                  ))}
                </div>
                <p className="problem-closer mt-10 max-w-[34ch] font-display text-xl font-semibold leading-snug tracking-[-0.01em] text-[#ECEAE3] opacity-0 md:text-2xl" style={{ transform: "translateY(14px)" }}>
                  The cost isn’t the software. It’s the buyers closing with someone else while you wait.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ 02 ENGINE — ASSEMBLY (5 beats) ============ */}
        <section id="engine" data-forge="2:6" className="forge-tall relative h-[420vh]">
          <div className="forge-sticky sticky top-0 flex h-screen items-center">
            <div className="mx-auto w-full max-w-[1180px] px-5 md:px-8">
              <div className="grid gap-10 md:grid-cols-[minmax(0,30rem)_1fr]">
                <div data-repel className="scrim py-10">
                  <Label>The engine</Label>
                  <h2 className="text-shadow-editorial mt-6 font-display font-bold leading-[1.02] tracking-[-0.02em]" style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)" }}>
                    One system.<br /><span style={{ color: ACCENT }}>Five moving parts.</span>
                  </h2>
                  {/* beat rail */}
                  <div className="mt-8 flex items-center gap-3">
                    {ENGINE_BEATS.map((_, i) => (
                      <span key={i} className="beat-tick block h-1.5 w-8 rounded-full bg-[#2A2A2E] transition-colors duration-300" />
                    ))}
                  </div>
                  {/* beats — absolutely stacked, crossfaded by scroll */}
                  <div ref={beatsWrap} className="relative mt-10 min-h-[13rem]">
                    {ENGINE_BEATS.map(([t, d, sub], i) => (
                      <div key={i} className="beat-block absolute inset-x-0 top-0 opacity-0">
                        <div className="font-mono text-[13px]" style={{ color: ACCENT }}>{String(i + 1).padStart(2, "0")} / 05</div>
                        <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">{t}</h3>
                        <p className="mt-4 max-w-[38ch] text-[17px] leading-[1.7] text-[#C9C7BF]">{d}</p>
                        <p className="mt-3 max-w-[42ch] text-[14px] italic leading-[1.6] text-[#A5A39B]">{sub}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* right side belongs to the organism */}
                <div aria-hidden className="hidden md:block" />
              </div>
            </div>
          </div>
        </section>

        {/* ============ 03 THE OFFER ============ */}
        <section id="offer" data-forge="6:6.5" className="relative py-28 md:py-36">
          <div className="mx-auto w-full max-w-[1180px] px-5 md:px-8">
            <div data-repel className="scrim max-w-[46rem]">
              <Label>The offer</Label>
              <h2 data-reveal className="text-shadow-editorial mt-6 max-w-[20ch] font-display font-bold leading-[1.02] tracking-[-0.02em]" style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)" }}>
                The engine, installed. <span style={{ color: ACCENT }}>You keep the map</span> either way.
              </h2>
              <p data-reveal className="mt-5 max-w-[56ch] text-[16px] leading-[1.7] text-[#AEACA3]">
                Built, deployed, tested and proven: 10,000+ leads generated for clients
                and 6+ deals closed across our engagements.
              </p>
              <div className="mt-10 space-y-5">
                {[
                  ["Deep dive session first", "We map where your pipeline leaks. The map is yours to keep."],
                  ["ICP and verified buyer list", "Decision-makers mapped and verified. Not scraped spam."],
                  ["Outbound engine, live", "Sequences in your voice, tracking, reporting. Built, then running under our hand."],
                  ["Qualified meetings on your calendar", "Revenue is the only scoreboard we report against."],
                  ["Senior operators, end to end", "The team that scopes your engine is the team that runs it."],
                ].map(([t, d], i) => (
                  <div key={i} data-reveal className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 border-b border-[#1C1C1F] pb-5">
                    <span className="font-mono text-[13px]" style={{ color: ACCENT }}>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="font-display text-xl font-semibold tracking-tight md:text-2xl">{t}</h3>
                      <p className="mt-2 max-w-[54ch] text-[16px] leading-[1.7] text-[#C9C7BF]">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
              {SHOW_GUARANTEE && (
                <p data-reveal className="mt-8 border-l-2 pl-5 font-display text-xl font-semibold leading-snug text-[#ECEAE3] md:text-2xl" style={{ borderColor: ACCENT }}>
                  If we don’t book at least one qualified meeting in the first 30 days,
                  cancel — and keep the map.
                </p>
              )}
              {SHOW_PAY_PER_MEETING && (
                <p data-reveal className="mt-4 max-w-[54ch] text-[16px] leading-[1.7] text-[#C9C7BF]">
                  Prefer pure performance? A pay-per-qualified-meeting option is available
                  after the session.
                </p>
              )}
              <div data-reveal className="mt-9 flex flex-wrap items-center gap-5">
                <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3.5 font-mono text-[13px] uppercase tracking-[0.14em] text-[#0B0B0C] transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer" style={{ backgroundColor: ACCENT }}>
                  Book a deep dive session →
                </a>
                <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#A5A39B]">Built once · runs for good</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============ 04 WHY — SPLIT ============ */}
        <section id="how" data-forge="6.5:7" className="forge-tall relative h-[180vh]">
          <div className="forge-sticky sticky top-0 flex h-screen items-center">
            <div className="mx-auto w-full max-w-[1180px] px-5 md:px-8">
              <div data-repel className="scrim py-10">
                <Label>Why us</Label>
                <div className="mt-8 space-y-9">
                  {[
                    ["Agencies report hours.", "We report pipeline."],
                    ["Decks, theater, activity.", "Meetings that land."],
                    ["Paid to look busy.", "Revenue is the only scoreboard."],
                  ].map(([a, b], i) => (
                    <div key={i} data-reveal className="border-b border-[#1C1C1F] pb-9">
                      <div className="flex items-baseline gap-4">
                        <span className="vs-chip vs-them">Every other agency</span>
                        <p className="font-display text-lg font-normal leading-[1.2] text-[#8B897F] line-through decoration-[#3A2A20] decoration-2 md:text-xl">{a}</p>
                      </div>
                      <div className="mt-3 flex items-baseline gap-4">
                        <span className="vs-chip vs-us">PropelBD</span>
                        <p className="text-shadow-editorial font-display text-2xl font-semibold leading-[1.15] tracking-[-0.015em] text-[#ECEAE3] md:text-3xl">{b}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ 04 PROOF — WHO WE'VE WORKED WITH ============ */}
        <section id="proof" data-forge="7:8" className="relative py-28 md:py-36">
          <div className="mx-auto w-full max-w-[1180px] px-5 md:px-8">
            <div data-repel className="scrim">
              <Label>Proof</Label>
              <h2 data-reveal className="text-shadow-editorial mt-6 max-w-[22ch] font-display font-bold leading-[1.02] tracking-[-0.02em]" style={{ fontSize: "clamp(2rem, 4.6vw, 3.4rem)" }}>
                Who we’ve been in the <span style={{ color: ACCENT }}>engine room</span> with.
              </h2>
            </div>

            {/* revolving credential band — real logos, monochrome at rest, color on hover */}
            <div data-reveal className="marquee mt-12 border-y border-[#1C1C1F] py-9" aria-label="Companies we have worked with">
              <div className="marquee-track">
                {[0, 1].map((half) => (
                  <div key={half} className="marquee-half" aria-hidden={half === 1}>
                    {[0, 1].map((rep) => (
                      <div key={rep} className="flex items-center gap-[4.5rem]">
                        <img src={`${BASE}/logos/supperclub.png`} alt={half === 0 && rep === 0 ? "SupperClub Global" : ""} className="logo-tile h-14 w-auto" loading="lazy" />
                        <span className="logo-word">Hassan Allam Properties</span>
                        <img src={`${BASE}/logos/flapkap.svg`} alt={half === 0 && rep === 0 ? "FlapKap" : ""} className="logo-tile logo-mono h-9 w-auto" loading="lazy" />
                        <span className="logo-word">Bold Routes</span>
                        <span className="logo-word">Qedreh &amp; Mansaf</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div data-repel className="scrim mt-12 max-w-[46rem]">
              <p data-reveal className="max-w-[56ch] text-[17px] leading-[1.7] text-[#C9C7BF]">
                First for our anchor client SupperClub, now across every engagement — we stand up
                the outbound engine, the targeting, and the B2B pipeline. The meetings land.
              </p>
              <div data-reveal className="glow-grid mt-8 grid gap-px overflow-hidden border border-[#26262A] bg-[#26262A] sm:grid-cols-3">
                {[
                  ["10000", "+", "verified leads generated for clients"],
                  ["6", "+", "deals closed across engagements"],
                  ["16", "", "corporate targets in live pipeline"],
                ].map(([n, suffix, d]) => (
                  <div key={d} className="glow-cell bg-[#0B0B0C]/80 p-6">
                    <div data-count={n} data-suffix={suffix} className="tnum font-display text-3xl font-bold tracking-tight md:text-4xl" style={{ color: ACCENT }}>{n}{suffix}</div>
                    <p className="mt-2 text-[15px] leading-[1.65] text-[#B3B1A8]">{d}</p>
                  </div>
                ))}
              </div>
              <p data-reveal className="mt-5 font-mono text-[12px] uppercase tracking-[0.18em] text-[#A5A39B]">
                Every particle behind this section is a decision-maker we have mapped
              </p>
            </div>
          </div>
        </section>

        {/* ============ 06 WHO ============ */}
        <section data-forge="8:8.2" className="relative py-28 md:py-36">
          <div className="mx-auto w-full max-w-[1180px] px-5 md:px-8">
            <div data-repel className="scrim max-w-[44rem]">
              <Label>Who it’s for</Label>
              <h2 data-reveal className="text-shadow-editorial mt-6 max-w-[24ch] font-display font-bold leading-[1.02] tracking-[-0.02em]" style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)" }}>
                UAE companies <span className="text-[#A5A39B]">behind on AI.</span>
              </h2>
              <p data-reveal className="mt-7 max-w-[54ch] text-[18px] leading-[1.7] text-[#C9C7BF]">
                Real products, real customers, no repeatable pipeline. If growth still depends
                on referrals, this is for you.
              </p>
              <p data-reveal className="mt-5 max-w-[54ch] text-[16px] leading-[1.7] text-[#AEACA3]">
                Not for funded AI-native startups that already live in this world.
              </p>
            </div>
          </div>
        </section>

        {/* ============ FAQ — OBJECTIONS, PRE-HANDLED ============ */}
        <section data-forge="8.2:8.4" className="relative py-24 md:py-28">
          <div className="mx-auto w-full max-w-[1180px] px-5 md:px-8">
            <div data-repel className="scrim max-w-[44rem]">
              <Label>FAQ</Label>
              <div className="mt-8 space-y-1">
                {[
                  ["Why not just hire a BD person?", "A senior BD hire in the UAE runs well past our retainer once you add ramp time, tooling, and management. The engine arrives built and run for you — and if it does not fit, you stop. No severance, no rehiring cycle."],
                  ["How fast do we see something real?", "The deep dive session lands before any commitment. Once we start, the first verified buyer lists and live outreach move in weeks, not quarters — you watch the pipeline fill in the same tracker we work from."],
                  ["What do you need from us?", "One decision-maker, roughly an hour a week, and honest answers about who your best customers are. We handle the rest — lists, sequences, tooling, follow-up discipline."],
                  ["Are we locked in?", "No long lock-in. The work compounds, so clients stay because it works — and everything built for you, the lists, the sequences, the map, stays yours."],
                  ["Does AI mean automated spam?", "The opposite. AI does the mapping and the grunt work; every message ships in your voice, aimed at a verified decision-maker, reviewed before it leaves. Volume without spray."],
                ].map(([q, a], i) => (
                  <details key={i} data-reveal className="faq-item group border-b border-[#1C1C1F]">
                    <summary className="flex cursor-pointer items-baseline justify-between gap-6 py-5 font-display text-lg font-semibold tracking-tight text-[#ECEAE3] md:text-xl [&::-webkit-details-marker]:hidden">
                      {q}
                      <span aria-hidden className="shrink-0 font-mono text-[15px] transition-transform duration-200 group-open:rotate-45" style={{ color: ACCENT }}>+</span>
                    </summary>
                    <p className="max-w-[58ch] pb-6 text-[16px] leading-[1.7] text-[#C9C7BF]">{a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ CTA — IGNITION ============ */}
        <section id="contact" data-forge="8.4:9" className="relative flex min-h-[100dvh] items-center py-28">
          <div className="mx-auto w-full max-w-[1180px] px-5 md:px-8">
            <div data-repel className="scrim ember-border mx-auto max-w-[40rem] px-6 py-12 text-center md:px-12">
              <h2 data-reveal className="text-shadow-editorial font-display font-bold leading-[1.0] tracking-[-0.02em]" style={{ fontSize: "clamp(2.4rem, 6vw, 4.6rem)" }}>
                Let’s build your <span style={{ color: ACCENT }}>engine.</span>
              </h2>
              <p data-reveal className="mx-auto mt-7 max-w-[44ch] text-[18px] leading-[1.7] text-[#C9C7BF]">
                A 20-minute call: we map where your revenue is leaking and what we’d
                build first. You keep the map. No deck. No pitch theater.
              </p>
              {/* Primary booking action. Placeholder Cal.com link — Ali swaps the real URL. */}
              <a data-reveal data-cta-heat href="https://cal.com/propelbd/deep-dive" target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex items-center gap-2 px-8 py-4 font-mono text-[13px] uppercase tracking-[0.14em] text-[#0B0B0C] transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer" style={{ backgroundColor: ACCENT }}>
                Book a deep dive session →
              </a>
              <p data-reveal className="mt-8 text-[15px] leading-[1.65] text-[#AEACA3]">
                The people who build your engine run your engine — and answer for it.
              </p>
              <p data-reveal className="mt-3 font-mono text-[12px] uppercase tracking-[0.18em] text-[#8B897F]">
                Replies within one business day
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#161619] bg-[#0B0B0C]/60">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="font-display text-base font-bold">Propel<span style={{ color: ACCENT }}>BD</span></div>
          <div className="font-display text-[15px] italic text-[#A5A39B]">Your business, rebuilt to scale.</div>
          <a href="mailto:a.shaheen7853@gmail.com" className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#A5A39B] underline-offset-4 hover:text-[#ECEAE3] hover:underline">a.shaheen7853@gmail.com</a>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#A5A39B]">
            © 2026 PropelBD · Dubai · Abu Dhabi · <a href={`${BASE}/privacy`} className="underline-offset-4 hover:text-[#ECEAE3] hover:underline">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
