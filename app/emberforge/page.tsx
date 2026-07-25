"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import EmberforgeNav from "../../components/emberforge/EmberforgeNav";
import EmberforgeChaosLayer from "../../components/emberforge/EmberforgeChaosLayer";
import EmberforgeHud from "../../components/emberforge/EmberforgeHud";

// Lazy, client-only — WebGL never touches SSR (perf discipline: lazy-init WebGL).
const EmberforgeScene = dynamic(() => import("../../components/emberforge/EmberforgeScene"), {
  ssr: false,
});

const CTA_URL = "https://cal.com/propelbd/deep-dive";

function smoothstep(t: number, a: number, b: number): number {
  const x = Math.min(Math.max((t - a) / (b - a), 0), 1);
  return x * x * (3 - 2 * x);
}

export default function EmberforgePage() {
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const chaosRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const handleProgress = (t: number) => {
    // chaos-layer opacity: full during DUST, gone by early FORGE
    if (chaosRef.current) {
      const opacity = 1 - smoothstep(t, 0.1, 0.24);
      chaosRef.current.style.opacity = String(Math.max(0, opacity));
    }
    // HUD: visible progress readout across FORGE->STREETS->CORE (0.22-0.82), per doctrine
    if (hudRef.current) {
      const label = hudRef.current.querySelector(".emberforge-hud-label") as HTMLElement | null;
      if (t > 0.22 && t < 0.82) {
        const pct = Math.round(((t - 0.22) / (0.82 - 0.22)) * 100);
        hudRef.current.style.opacity = "1";
        if (label) label.textContent = `FORGING — ${pct}%`;
      } else {
        hudRef.current.style.opacity = "0";
      }
    }
  };

  if (reducedMotion === null) {
    return null; // avoid a flash-of-wrong-content before the media query resolves
  }

  return (
    <main id="emberforge-top" className="emberforge-root">
      <EmberforgeNav />

      {reducedMotion ? (
        <div className="emberforge-poster" aria-hidden="true" />
      ) : (
        <>
          <EmberforgeChaosLayer ref={chaosRef} />
          <EmberforgeScene onProgress={handleProgress} />
          <EmberforgeHud ref={hudRef} />
        </>
      )}

      {/* CH1 — DUST. Real DOM h1 for SEO/a11y; the visual "EMBERFORGE" wordmark lives as a
          lit 3D plane inside the scene (obys-style type threaded through the field), not
          duplicated here as giant DOM type. */}
      <section className="emberforge-ch emberforge-ch-dust" aria-label="Hero">
        <h1 className="emberforge-sr-only">
          EMBERFORGE — PropelBD, the revenue engine your business is missing. Fractional
          AI-BD for Dubai and Abu Dhabi.
        </h1>
        <p className="emberforge-kicker">PROPELBD &middot; FRACTIONAL AI-BD</p>
        <div className="emberforge-scrollcue" aria-hidden="true">
          <span />
          scroll
        </div>
      </section>

      {/* CH2 — IGNITION. Register break #1: opaque section, canvas fully hidden, flat
          editorial type only. Hard cut, no transition softening. */}
      <section className="emberforge-ch emberforge-ch-ignition">
        <motion.h2
          className="emberforge-flat-line"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
        >
          Every business we&apos;ve met runs on chaos it calls a system.
        </motion.h2>
      </section>

      {/* CH3 — FORGE. Transparent, canvas visible: embers coalescing into the metropolis. */}
      <section className="emberforge-ch emberforge-ch-forge" aria-label="The forge">
        <div className="emberforge-forge-copy">
          <p className="emberforge-eyebrow">01 &mdash; THE FORGE</p>
          <p className="emberforge-body-lg">
            No system holds itself together. We take the chaos every UAE business already
            has &mdash; the scattered leads, the random referrals, the tabs no one owns
            &mdash; and forge it into one running engine.
          </p>
        </div>
      </section>

      {/* CH3.5 — STREETS. Continuation of the same pin; camera dollies through the now-
          structured city. Proof panels (facade planes, edge-scattered, not centered). */}
      <section className="emberforge-ch emberforge-ch-streets" aria-label="Proof">
        <div className="emberforge-streets-panel emberforge-streets-panel-l">
          <p className="emberforge-eyebrow">02 &mdash; PROOF</p>
          <p className="emberforge-body-lg">
            Built and running for SupperClub Middle East. Decision-makers mapped, the
            engine live in Dubai and Abu Dhabi.
          </p>
        </div>
      </section>

      {/* CH4 — CORE. Split canvas: 3D core left (transparent), offer copy right. */}
      <section className="emberforge-ch emberforge-ch-core" aria-label="The offer">
        <div className="emberforge-core-spacer" aria-hidden="true" />
        <div className="emberforge-core-copy">
          <p className="emberforge-eyebrow">03 &mdash; THE OFFER</p>
          <h2 className="emberforge-h2">One engine. Not a nine-item buffet.</h2>
          <p className="emberforge-body">
            You don&apos;t buy nine services and hope they connect. You get one engine we
            build, prove works, then run &mdash; the exact system SupperClub runs on today.
          </p>
        </div>
      </section>

      {/* CH5 — TOWER. Register break #2: camera has SNAPPED to a static wide shot (the
          hard cut is the camera stopping, not a DOM device) &mdash; giant centered CTA. */}
      <section className="emberforge-ch emberforge-ch-tower" aria-label="Book a deep-dive">
        <div className="emberforge-tower-scrim" aria-hidden="true" />
        <div className="emberforge-tower-content">
          <p className="emberforge-eyebrow">THE CONTROL TOWER</p>
          <h2 className="emberforge-h2-giant">
            Booking the call is the obvious next move.
          </h2>
          <a href={CTA_URL} className="emberforge-cta" target="_blank" rel="noopener noreferrer">
            Book a deep-dive session
          </a>
        </div>
      </section>

      {/* CH6 — CLOSE. Solid background, canvas fully hidden, quiet. */}
      <footer className="emberforge-ch emberforge-ch-close">
        <p className="emberforge-footer-line">PropelBD &middot; Dubai &middot; Abu Dhabi</p>
        <a href={CTA_URL} className="emberforge-footer-link" target="_blank" rel="noopener noreferrer">
          Book a deep-dive session &rarr;
        </a>
      </footer>

      <style jsx>{`
        .emberforge-root {
          position: relative;
          background: #0a0908;
          color: #f5f0e6;
        }
        .emberforge-poster {
          position: fixed;
          inset: 0;
          z-index: 0;
          background: radial-gradient(120% 90% at 50% 40%, #2a120a 0%, #0a0908 62%);
        }
        .emberforge-ch {
          position: relative;
          z-index: 5;
          width: 100%;
        }
        .emberforge-sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }

        /* CH1 DUST */
        .emberforge-ch-dust {
          height: 118vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding-bottom: 4rem;
        }
        .emberforge-kicker {
          font-family: var(--font-jetbrains, monospace);
          font-size: 0.78rem;
          letter-spacing: 0.22em;
          color: rgba(245, 240, 230, 0.55);
          margin-bottom: 1.5rem;
        }
        .emberforge-scrollcue {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-jetbrains, monospace);
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 138, 76, 0.7);
        }
        .emberforge-scrollcue span {
          width: 1px;
          height: 34px;
          background: linear-gradient(to bottom, rgba(255, 90, 31, 0.9), transparent);
        }

        /* CH2 IGNITION — register break: fully opaque, hides the fixed canvas */
        .emberforge-ch-ignition {
          height: 56vh;
          min-height: 420px;
          background: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 6vw;
          z-index: 10;
        }
        .emberforge-flat-line {
          font-family: var(--font-display-stack, sans-serif);
          font-weight: 700;
          font-size: clamp(2.2rem, 8vw, 4.6rem);
          line-height: 1.05;
          text-align: center;
          max-width: 20ch;
          margin: 0 auto;
        }

        /* CH3 FORGE */
        .emberforge-ch-forge {
          height: 264vh;
        }
        .emberforge-forge-copy {
          position: sticky;
          top: 22vh;
          max-width: 34ch;
          padding: 0 6vw;
        }
        .emberforge-eyebrow {
          font-family: var(--font-jetbrains, monospace);
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          color: #ff5a1f;
          margin-bottom: 0.75rem;
        }
        .emberforge-body-lg {
          font-family: var(--font-body-stack, sans-serif);
          font-size: clamp(1.15rem, 2.4vw, 1.6rem);
          line-height: 1.45;
          color: #f5f0e6;
        }

        /* CH3.5 STREETS — edge-scattered, not centered */
        .emberforge-ch-streets {
          height: 120vh;
        }
        .emberforge-streets-panel {
          position: sticky;
          top: 26vh;
          max-width: 30ch;
          padding: 1.75rem;
          background: rgba(10, 9, 8, 0.55);
          border-left: 2px solid #ff5a1f;
          backdrop-filter: blur(2px);
        }
        .emberforge-streets-panel-l {
          margin-left: 6vw;
        }

        /* CH4 CORE — split canvas */
        .emberforge-ch-core {
          height: 96vh;
          display: flex;
          align-items: center;
        }
        .emberforge-core-spacer {
          flex: 1 1 50%;
        }
        .emberforge-core-copy {
          flex: 1 1 46%;
          padding: 0 6vw 0 2vw;
        }
        .emberforge-h2 {
          font-family: var(--font-display-stack, sans-serif);
          font-weight: 700;
          font-size: clamp(2rem, 5vw, 3.4rem);
          line-height: 1.05;
          margin: 0.5rem 0 1rem;
        }
        .emberforge-body {
          font-family: var(--font-body-stack, sans-serif);
          font-size: 1.05rem;
          line-height: 1.6;
          color: rgba(245, 240, 230, 0.78);
          max-width: 36ch;
        }

        /* CH5 TOWER — register break #2, full-bleed, giant centered CTA */
        .emberforge-ch-tower {
          height: 104vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .emberforge-tower-scrim {
          position: absolute;
          inset: 0;
          background: radial-gradient(60% 50% at 50% 50%, rgba(10, 9, 8, 0.72) 0%, rgba(10, 9, 8, 0.1) 70%);
          z-index: -1;
        }
        .emberforge-tower-content {
          padding: 0 6vw;
          max-width: 44ch;
        }
        .emberforge-h2-giant {
          font-family: var(--font-display-stack, sans-serif);
          font-weight: 700;
          font-size: clamp(2.4rem, 6.2vw, 4.8rem);
          line-height: 1.02;
          margin: 0.75rem 0 2rem;
        }
        .emberforge-cta {
          display: inline-block;
          font-family: var(--font-body-stack, sans-serif);
          font-weight: 600;
          font-size: 1rem;
          color: #0a0908;
          background: #ff5a1f;
          padding: 1rem 2rem;
          border-radius: 2px;
          text-decoration: none;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }
        .emberforge-cta:hover {
          background: #ff8a4c;
          transform: translateY(-1px);
        }
        .emberforge-cta:focus-visible {
          outline: 2px solid #ff8a4c;
          outline-offset: 3px;
        }

        /* CH6 CLOSE */
        .emberforge-ch-close {
          height: 40vh;
          min-height: 260px;
          background: #0a0908;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          border-top: 1px solid rgba(245, 240, 230, 0.08);
        }
        .emberforge-footer-line {
          font-size: 0.85rem;
          color: rgba(245, 240, 230, 0.5);
        }
        .emberforge-footer-link {
          font-family: var(--font-body-stack, sans-serif);
          font-size: 0.95rem;
          font-weight: 600;
          color: #ff8a4c;
          text-decoration: none;
          cursor: pointer;
        }
        .emberforge-footer-link:hover {
          color: #ff5a1f;
        }

        @media (max-width: 780px) {
          .emberforge-ch-core {
            flex-direction: column;
            justify-content: center;
            gap: 2rem;
            text-align: left;
          }
          .emberforge-core-spacer {
            flex: 0 0 30vh;
          }
          .emberforge-core-copy {
            padding: 0 6vw;
          }
          .emberforge-streets-panel-l {
            margin-left: 5vw;
          }
          .emberforge-ch-tower {
            padding-top: 5.5rem;
          }
          .emberforge-h2-giant {
            font-size: clamp(2rem, 9vw, 3.2rem);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .emberforge-ch-forge,
          .emberforge-ch-streets {
            height: auto;
            padding: 12vh 0;
          }
          .emberforge-forge-copy,
          .emberforge-streets-panel {
            position: static;
            margin: 0 auto;
          }
        }
      `}</style>
    </main>
  );
}
