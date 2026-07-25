"use client";

/* NEURAL EMBER — concept C.
   Isolated component tree (components/NeuralEmber*.tsx + components/neuralember/*).
   NEVER imports/edits Landing.tsx, MoltenOrganism.tsx, globals.css — every style
   here is scoped under .neuralember- via <style jsx>.

   Structure (see _session_2026-07-25/neuralember/STAGE1_BRIEF.md for the full
   rationale) — a horror-tension arc, NOT molten's constrained single column:
     NAV (unchanged register, fixed)
     0 VOID     — full-bleed centered hero, hero type >=12vw, sparse embers
     1 DRIFT    — edge-scatter asymmetric, small corner type, rising unease
     2 COALESCE — PINNED split-canvas 30/70, mesh densifies in 4 visible steps
     3 RUPTURE  — REGISTER BREAK: full-bleed blood-red flash, viewport-clipped type
     4 RELEASE  — full-bleed centered, CTA ignites
     5 marquee  — horizontal proof band (novel vs molten)
     6 footer

   EK MOTION CANON: one deliberate motion moment per section (a single reveal,
   never a uniform stagger-everything). Reduced-motion: NeuralEmberScene +
   NeuralEmberField both bail before mount (checked internally) — this
   component also skips Lenis smoothing and the rupture flash/CTA-ignite
   listeners are inert since the 'ember:rupture' event is never dispatched. */

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motion, useAnimation } from "framer-motion";

const NeuralEmberScene = dynamic(() => import("./neuralember/NeuralEmberScene"), { ssr: false });
const NeuralEmberField = dynamic(() => import("./neuralember/NeuralEmberField"), { ssr: false });

const ACCENT = "#FF5A1F";
const BLOOD = "#FF2E1F";

const DRIFT_LINES = [
  ["No system underneath.", "Every new client is luck, referral, or a founder cold-DMing at midnight."],
  ["The pipeline is invisible.", "Nobody can point to where the next deal is coming from — including you."],
  ["Growth stalls at the ceiling one person can carry.", "There's no engine running when you're not."],
];

const BEATS = [
  { n: "01", t: "Map the field", d: "Every real decision-maker in your market, found and verified — not scraped." },
  { n: "02", t: "Wire the outreach", d: "Multi-channel sequences that sound like you, running on a schedule you never touch." },
  { n: "03", t: "Prove it live", d: "Built once on SupperClub Middle East, Dubai and Abu Dhabi — the engine already runs." },
  { n: "04", t: "Hand you the wheel", d: "You watch qualified conversations land. The system runs; you close." },
];

export default function NeuralEmberSite() {
  const rupture = useAnimation();
  const [flash, setFlash] = useState(false);
  const beatRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: Lenis | undefined;
    let tickerFn: ((time: number) => void) | undefined;
    if (!reduced) {
      lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 3) });
      lenis.on("scroll", ScrollTrigger.update);
      tickerFn = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
    }

    // rupture flash + CTA ignite — inert on reduced-motion (event never dispatched, scene bails)
    const onRupture = () => {
      setFlash(true);
      window.setTimeout(() => setFlash(false), 420);
      rupture.start({ scale: [1, 1.06, 1], boxShadow: [`0 0 0px ${ACCENT}00`, `0 0 42px ${ACCENT}CC`, `0 0 18px ${ACCENT}88`], transition: { duration: 0.9, ease: "easeOut" } });
    };
    document.addEventListener("ember:rupture", onRupture);

    // COALESCE beats — 4 discrete visible-progress steps inside the pinned chapter,
    // imperative opacity (no React state per scroll frame)
    const coalesce = document.querySelector<HTMLElement>("[data-ember-coalesce]");
    let beatTrigger: ScrollTrigger | undefined;
    if (coalesce) {
      beatTrigger = ScrollTrigger.create({
        trigger: coalesce,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const step = Math.min(3, Math.floor(self.progress * 4));
          beatRefs.current.forEach((el, i) => {
            if (!el) return;
            el.style.opacity = i === step ? "1" : "0";
            el.style.transform = i === step ? "translateY(0)" : "translateY(10px)";
          });
        },
      });
    }

    return () => {
      document.removeEventListener("ember:rupture", onRupture);
      beatTrigger?.kill();
      if (tickerFn) gsap.ticker.remove(tickerFn);
      lenis?.destroy();
    };
  }, [rupture]);

  return (
    <div className="neuralember-root relative min-h-screen bg-[#0A0908] text-[#F5F0E6] antialiased overflow-clip">
      <NeuralEmberField />
      <NeuralEmberScene />

      {/* rupture flash — pure CSS opacity spike, reduced-motion never triggers it */}
      <div aria-hidden className={`neuralember-flash fixed inset-0 z-[55] pointer-events-none ${flash ? "is-on" : ""}`} />

      {/* tension meter — the one UI element molten does not have */}
      <div aria-hidden className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8B6A5A] [writing-mode:vertical-rl]">tension</span>
        <div className="relative h-40 w-[3px] overflow-hidden rounded-full bg-[#241611]">
          <div data-ember-tension className="absolute inset-x-0 bottom-0 top-0 origin-bottom rounded-full" style={{ background: `linear-gradient(to top, ${ACCENT}, ${BLOOD})`, transform: "scaleY(0)" }} />
        </div>
      </div>

      <nav className="neuralember-nav fixed inset-x-0 top-0 z-50 border-b border-[#1c120c] bg-[#0A0908]/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-10">
          <span className="font-display text-lg font-bold tracking-tight">Propel<span style={{ color: ACCENT }}>BD</span></span>
          <a href="#release" className="inline-flex min-h-[44px] items-center gap-2 border border-[#2A1B12] px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.16em] transition-colors duration-200 hover:border-[#FF5A1F] cursor-pointer">
            Book a deep dive <span style={{ color: ACCENT }}>&rarr;</span>
          </a>
        </div>
      </nav>

      <main className="relative z-10">
        {/* 0 VOID — full-bleed centered, hero type >=12vw */}
        <section data-ember="0:0.6" data-ember-stage="void" className="neuralember-void relative flex min-h-[100dvh] flex-col items-center justify-center px-4 text-center">
          <span className="font-mono text-[12px] uppercase tracking-[0.4em] text-[#8B6A5A]">a dormant intelligence</span>
          <h1 className="neuralember-heroType mt-6 font-display font-bold leading-[0.92]">
            Something is <span style={{ color: ACCENT }}>waking up</span> in your market.
          </h1>
          <p className="mt-8 max-w-[40ch] text-[17px] leading-[1.7] text-[#C9BDB2]">
            PropelBD builds the AI-run business-development engine while it&rsquo;s still dark out there — before your competitors even see it stir.
          </p>
          <div aria-hidden className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.3em] text-[#5E483C]">
            scroll — it doesn&rsquo;t wake gently
          </div>
        </section>

        {/* 1 DRIFT — edge-scatter asymmetric, small corner type, non-pinned scroll-past.
            Each line owns its own tall block (NOT sticky — three simultaneous sticky
            elements at close offsets overlapped illegibly, caught in QA screenshot). */}
        <section data-ember="0.6:1.3" data-ember-stage="void" className="neuralember-drift relative">
          {DRIFT_LINES.map(([t, d], i) => (
            <div key={t} className="neuralember-driftLine flex min-h-[52vh] items-center justify-end px-6 md:px-10">
              <div className="ml-auto w-full max-w-[26rem] border-l-2 pl-5" style={{ borderColor: ACCENT }}>
                <span className="font-mono text-[12px]" style={{ color: ACCENT }}>0{i + 1}</span>
                <h3 className="mt-2 font-display text-2xl font-semibold leading-snug md:text-3xl">{t}</h3>
                <p className="mt-2 text-[15px] leading-[1.7] text-[#B9AA9E]">{d}</p>
              </div>
            </div>
          ))}
        </section>

        {/* 2 COALESCE — PINNED split-canvas 30/70, mesh densifies in 4 visible steps */}
        <section data-ember="1.3:2.0" data-ember-stage="mesh" data-ember-coalesce className="neuralember-coalesce relative h-[260vh]">
          <div className="sticky top-0 flex h-screen items-center">
            <div className="grid w-full grid-cols-1 md:grid-cols-[30%_70%]">
              <div className="px-6 py-10 md:px-10">
                <span className="font-mono text-[12px] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>the mesh forms</span>
                <h2 className="mt-4 font-display text-3xl font-bold leading-[1.05] md:text-4xl">
                  One engine. Four moving parts.
                </h2>
              </div>
              <div className="relative min-h-[16rem] px-6 md:px-10">
                {BEATS.map((b, i) => (
                  <div
                    key={b.n}
                    ref={(el) => { beatRefs.current[i] = el; }}
                    className="neuralember-beat absolute inset-x-6 top-0 opacity-0 md:inset-x-10"
                    style={{ transition: "opacity 500ms ease, transform 500ms ease" }}
                  >
                    <div className="font-mono text-[13px]" style={{ color: ACCENT }}>{b.n} / 04</div>
                    <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-5xl">{b.t}</h3>
                    <p className="mt-4 max-w-[46ch] text-[17px] leading-[1.7] text-[#C9BDB2]">{b.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3 RUPTURE — REGISTER BREAK: full-bleed blood-red, viewport-clipped type */}
        <section data-ember="2.0:2.5" data-ember-stage="rupture" className="neuralember-rupture relative flex min-h-[70vh] items-center overflow-hidden">
          <h2 className="neuralember-ruptureType whitespace-nowrap font-display font-black uppercase leading-none" style={{ color: "#FFEDE6" }}>
            the revenue engine your business is missing
          </h2>
        </section>

        {/* 4 RELEASE — full-bleed centered, CTA ignites */}
        <section id="release" data-ember="2.5:3.0" data-ember-stage="release" className="neuralember-release relative flex min-h-[100dvh] flex-col items-center justify-center px-4 text-center">
          <span className="font-mono text-[12px] uppercase tracking-[0.35em] text-[#8B6A5A]">it&rsquo;s awake now</span>
          <h2 className="mt-5 max-w-[22ch] font-display text-4xl font-bold leading-[1.05] md:text-6xl">
            Built once on SupperClub Middle East. <span style={{ color: ACCENT }}>Ready to run for you.</span>
          </h2>
          <p className="mt-6 max-w-[50ch] text-[16px] leading-[1.7] text-[#C9BDB2]">
            10,000+ leads generated for clients · 6+ deals closed across engagements · verified pipeline, not scraped.
          </p>
          <motion.a
            href="https://cal.com/propelbd/deep-dive"
            data-cta-heat
            animate={rupture}
            className="mt-10 inline-flex min-h-[44px] items-center gap-2 px-8 py-4 font-mono text-[13px] uppercase tracking-[0.16em] text-[#0A0908] cursor-pointer"
            style={{ backgroundColor: ACCENT }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Book a deep-dive session <span aria-hidden>&rarr;</span>
          </motion.a>
        </section>

        {/* 5 horizontal proof marquee — novel vs molten's fixed column */}
        <div className="neuralember-marquee relative overflow-hidden border-y border-[#1c120c] py-5" aria-hidden>
          <div className="neuralember-marqueeTrack flex whitespace-nowrap font-mono text-[13px] uppercase tracking-[0.25em] text-[#8B6A5A]">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="px-6">
                10,000+ leads generated &middot; 6+ deals closed &middot; SupperClub Middle East &middot; Dubai &middot; Abu Dhabi &middot;&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* 6 footer */}
        <footer className="relative border-t border-[#1c120c] px-6 py-10 md:px-10">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4">
            <span className="font-display text-base font-bold">Propel<span style={{ color: ACCENT }}>BD</span></span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#5E483C]">Dubai &middot; Abu Dhabi &middot; fractional AI-BD, run as a service</span>
          </div>
        </footer>
      </main>

      <style jsx>{`
        .neuralember-heroType {
          font-size: clamp(3.2rem, 14vw, 11rem);
          letter-spacing: -0.02em;
        }
        .neuralember-ruptureType {
          font-size: clamp(3.8rem, 16vw, 13rem);
          letter-spacing: -0.03em;
          margin-inline: -4vw;
        }
        .neuralember-flash {
          background: radial-gradient(circle at 50% 45%, #ffece6cc, ${BLOOD}66 55%, transparent 80%);
          opacity: 0;
          transition: opacity 120ms ease-out;
        }
        .neuralember-flash.is-on {
          opacity: 1;
          transition: opacity 40ms ease-in;
        }
        .neuralember-rupture {
          background: radial-gradient(ellipse at center, #2a0704 0%, #0a0908 72%);
        }
        .neuralember-marqueeTrack {
          animation: neuralember-scroll 26s linear infinite;
        }
        @keyframes neuralember-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .neuralember-marqueeTrack { animation: none; }
          .neuralember-flash { display: none; }
        }
      `}</style>
    </div>
  );
}
