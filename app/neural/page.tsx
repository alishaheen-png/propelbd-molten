"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NeuronsHero from "../../components/neural/NeuronsHero";

/* ──────────────────────────────────────────────────────────────────────
   PropelBD — neural landing.
   One-pager: hero (NeuronsHero) → what it does → how it works → proof → CTA.
   Palette: deep cool-toned dark (#06070D) + single electric-cyan accent
   (#5FE3FF). Type: Cabinet Grotesk display / General Sans body / JetBrains
   Mono eyebrow — the mono/grotesk pairing reads "engineered", not
   "marketed", and the cool night tone is distinct from the ember site.
   No invented statistics. No geography in the header. Only client named
   in the proof section is SupperClub Middle East.
   ──────────────────────────────────────────────────────────────────── */

const ACCENT = "#5FE3FF";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

const WHAT_IT_DOES: { title: string; body: string }[] = [
  {
    title: "Outbound that actually runs",
    body: "Sequences, enrichment, and replies are set up and kept running instead of abandoned after week three.",
  },
  {
    title: "Pipeline you can see",
    body: "A live view of who is in the funnel, where they stalled, and the next move — not a spreadsheet someone forgot to update.",
  },
  {
    title: "Operator handoff",
    body: "Everything is documented and live. Your person can take the wheel without rebuilding what was built.",
  },
];

const HOW_IT_WORKS: { step: string; title: string; body: string }[] = [
  {
    step: "01",
    title: "Look at the engine",
    body: "We read what you have today — the funnel, the tools, the operator's hands — and say what is missing, plainly.",
  },
  {
    step: "02",
    title: "Build what is missing",
    body: "The pipeline that should exist gets assembled and switched on. AI does the labor; the operator keeps the judgment.",
  },
  {
    step: "03",
    title: "Prove it day by day",
    body: "We run it with you until it produces. Then it keeps running — under your operator, with our notes behind it.",
  },
];

export default function NeuralPage() {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <main className="bg-[#06070D] text-[#EAF6FB]">
      {/* HERO */}
      <NeuronsHero />

      {/* WHAT IT DOES */}
      <section
        id="what"
        aria-labelledby="what-h"
        className="mx-auto max-w-6xl px-6 py-section sm:px-10"
      >
        <div className="mb-14 max-w-2xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#5FE3FF]/80">
            What it does
          </span>
          <h2
            id="what-h"
            className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-[#EAF6FB]"
          >
            The BD function,
            <br />
            <span className="text-[#5FE3FF]">running instead of planned.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-editorial border border-white/[0.06] bg-white/[0.03] md:grid-cols-3">
          {WHAT_IT_DOES.map((item, i) => (
            <motion.article
              key={item.title}
              custom={i}
              variants={fadeUp}
              initial={mounted && !reducedMotion ? "hidden" : false}
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="group relative bg-[#080A12] p-7 sm:p-9"
            >
              <div className="mb-5 font-mono text-[11px] tracking-[0.2em] text-[#5FE3FF]/55">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mb-3 font-display text-xl font-semibold leading-snug text-[#EAF6FB] sm:text-[1.4rem]">
                {item.title}
              </h3>
              <p className="text-[0.95rem] leading-relaxed text-[#8FA3B0]">
                {item.body}
              </p>
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-px w-0 bg-[#5FE3FF] transition-[width] duration-500 ease-out group-hover:w-full"
              />
            </motion.article>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how"
        aria-labelledby="how-h"
        className="border-y border-white/[0.06] bg-[#080A12]"
      >
        <div className="mx-auto max-w-6xl px-6 py-section sm:px-10">
          <div className="mb-16 max-w-2xl">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#5FE3FF]/80">
              How it works
            </span>
            <h2
              id="how-h"
              className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-[#EAF6FB]"
            >
              Built, proven, then runs without us.
            </h2>
          </div>

          <ol className="relative ml-3 space-y-12 sm:ml-4 sm:space-y-16">
            <span
              aria-hidden="true"
              className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-white/[0.08] sm:left-[9px]"
            />
            {HOW_IT_WORKS.map((s, i) => (
              <motion.li
                key={s.step}
                custom={i}
                variants={fadeUp}
                initial={mounted && !reducedMotion ? "hidden" : false}
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="relative grid grid-cols-1 gap-x-8 pl-10 sm:grid-cols-[auto_1fr] sm:pl-14"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1 flex h-4 w-4 items-center justify-center rounded-full border border-[#5FE3FF]/40 bg-[#06070D]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5FE3FF]" />
                </span>
                <div className="mb-3 font-mono text-[12px] tracking-[0.18em] text-[#5FE3FF]/70 sm:mb-0">
                  {s.step}
                </div>
                <div className="max-w-2xl">
                  <h3 className="mb-2.5 font-display text-[1.35rem] font-semibold leading-snug text-[#EAF6FB] sm:text-[1.6rem]">
                    {s.title}
                  </h3>
                  <p className="text-[0.95rem] leading-relaxed text-[#8FA3B0]">
                    {s.body}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* PROOF */}
      <section id="proof" className="mx-auto max-w-6xl px-6 py-section sm:px-10">
        <div className="mb-14 max-w-2xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#5FE3FF]/80">
            Proof
          </span>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-[#EAF6FB]">
            One client. Actually shipped. Still running.
          </h2>
        </div>

        <motion.figure
          variants={fadeUp}
          custom={0}
          initial={mounted && !reducedMotion ? "hidden" : false}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative overflow-hidden rounded-editorial border border-white/[0.08] bg-gradient-to-br from-[#0A0D17] to-[#070912] p-8 sm:p-12"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#5FE3FF]/10 blur-[80px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-6 top-7 font-display text-7xl leading-none text-white/[0.12] sm:text-8xl"
          >
            &ldquo;
          </div>
          <blockquote className="relative max-w-3xl text-balance font-display text-[clamp(1.4rem,3vw,2.1rem)] font-medium leading-[1.25] tracking-[-0.01em] text-[#EAF6FB]">
            SupperClub Middle East kept operating without a dedicated
            business-development lead. We stood that function up on AI, stayed
            under the cost of hiring, and kept it running.
          </blockquote>
          <figcaption className="mt-8 flex items-center gap-3 border-t border-white/[0.06] pt-6">
            <span className="inline-block h-2 w-2 rounded-full bg-[#5FE3FF]" />
            <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#9FB6C2]">
              SupperClub Middle East · ongoing
            </span>
          </figcaption>
        </motion.figure>

        <p className="mx-auto mt-10 max-w-2xl text-center text-[0.95rem] leading-relaxed text-[#6B8390]">
          We will not show you a wall of logos. If the work is real, one is
          enough — and the system behind it is the actual product.
        </p>
      </section>

      {/* CTA */}
      <section
        id="cta"
        aria-labelledby="cta-h"
        className="relative overflow-hidden border-t border-white/[0.06]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5FE3FF]/8 blur-[120px]"
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-section text-center sm:px-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#5FE3FF]/80">
            Deep dive session
          </span>
          <h2
            id="cta-h"
            className="mt-5 font-display text-[clamp(2.1rem,5.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.025em] text-[#EAF6FB]"
          >
            See what the engine
            <br />
            <span className="text-[#5FE3FF]">would look like for you.</span>
          </h2>
          <p className="mt-6 max-w-xl text-balance text-[1rem] leading-relaxed text-[#9FB6C2] sm:text-[1.06rem]">
            One call. We read your funnel, name the missing piece, and tell you
            whether AI-built BD makes sense for you — before anything changes
            hands.
          </p>

          <a
            href="https://cal.com/propelbd/deep-dive"
            data-cta-heat
            className="group mt-10 inline-flex items-center gap-2.5 rounded-editorial bg-[#5FE3FF] px-8 py-4 font-mono text-[13px] font-medium uppercase tracking-[0.16em] text-[#06070D] transition-colors duration-300 hover:bg-[#9BF1FF]"
            style={{ boxShadow: `0 0 0 0 ${ACCENT}` }}
          >
            Book a deep dive session
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path
                d="M3 8h9M8 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          <p className="mt-6 max-w-sm text-[0.85rem] leading-relaxed text-[#6B8390]">
            No deck. No pitch. The session is the work, not a teaser for it.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] bg-[#040509]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center sm:px-10">
          <div className="flex items-center gap-2.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#5FE3FF]" />
            <span className="font-display text-[1.05rem] font-semibold tracking-[-0.01em] text-[#EAF6FB]">
              PropelBD
            </span>
          </div>
          <p className="max-w-md text-[0.85rem] leading-relaxed text-[#6B8390]">
            Fractional AI-run business development. Built, proven, handed off.
          </p>
          <a
            href="https://cal.com/propelbd/deep-dive"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#9FB6C2] underline-offset-4 transition-colors duration-200 hover:text-[#5FE3FF] hover:underline"
          >
            Book a deep dive session →
          </a>
        </div>
      </footer>
    </main>
  );
}
