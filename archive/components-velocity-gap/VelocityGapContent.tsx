"use client";

import { motion } from "framer-motion";
import { TrajectoryField } from "./TrajectoryField";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ArrowRight } from "lucide-react";

const process = [
  { step: "Scout", body: "Map the buyer universe and rank by fit, timing, and access." },
  { step: "Position", body: "Craft the angle so the first touch reads like an insider note." },
  { step: "Open", body: "Run multithreaded outreach until meetings are on the calendar." },
  { step: "Close", body: "Own the deal desk until signature, then hand off a clean account." },
];

const tiers = [
  { name: "Advisory", scope: "One vertical", rhythm: "Monthly sprint" },
  { name: "Embedded", scope: "Two verticals", rhythm: "Bi-weekly sprint" },
  { name: "Revenue Partner", scope: "Full coverage", rhythm: "Weekly war room" },
];

const markets = [
  { city: "Dubai", areas: "DIFC, DMCC, Dubai Internet City", verticals: "Fintech, SaaS, F&B groups" },
  { city: "Abu Dhabi", areas: "ADGM, Al Maryah Island, Masdar City", verticals: "Family offices, proptech, climate tech" },
];

export function VelocityGapContent() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-[calc(100dvh-5rem)] px-4 md:px-6 py-16 md:py-24 flex items-center">
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs uppercase tracking-[0.12em] text-accent mb-6"
            >
              PropelBD — Velocity Gap
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
              className="font-display text-hero font-semibold text-ink leading-[0.98] tracking-tight"
            >
              You don&apos;t need a Head of BD.
              <br />
              <span className="text-accent">You need deals.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 md:mt-8 text-lg md:text-xl text-muted max-w-[50ch] leading-relaxed"
            >
              Fractional business development for founders in Dubai and Abu Dhabi who are done waiting for revenue to happen.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 md:mt-10"
            >
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 font-display text-base px-6 py-3 bg-ink text-base rounded-editorial hover:bg-ink/90 active:scale-[0.98] transition-all"
              >
                Book a 20-minute call
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </motion.div>
          </div>
          <div className="lg:col-span-5 h-[320px] md:h-[420px] lg:h-[520px] bg-surface border border-border rounded-editorial overflow-hidden relative">
            <TrajectoryField />
          </div>
        </div>
      </section>

      {/* Empty Chair */}
      <section className="px-4 md:px-6 py-section-lg bg-base border-y border-border">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <SectionHeader eyebrow="The Empty Chair" title="The real cost of not having BD." />
          </div>
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="space-y-6 text-muted leading-relaxed text-lg max-w-[60ch]">
              <p>
                You built the product. You hired the engineers. You raised the round. But the chair reserved for revenue is still empty.
              </p>
              <p>
                A senior BD hire takes months to recruit and longer to ramp. A fractional operator shows up with the network, the motion, and the discipline already built.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Move */}
      <section className="px-4 md:px-6 py-section-lg bg-surface">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader eyebrow="How We Move" title="Scout. Position. Open. Close." />
          <div className="space-y-0 border-t border-border">
            {process.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-10 md:py-12 border-b border-border items-baseline"
              >
                <div className="md:col-span-2">
                  <span className="font-display text-index font-semibold text-surface-elevated">0{i + 1}</span>
                </div>
                <div className="md:col-span-4">
                  <h3 className="font-display text-3xl md:text-4xl font-semibold text-ink">{p.step}</h3>
                </div>
                <div className="md:col-span-6">
                  <p className="text-muted leading-relaxed max-w-[55ch]">{p.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Markets */}
      <section className="px-4 md:px-6 py-section-lg bg-base-deep">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader eyebrow="The Territory" title="Dubai and Abu Dhabi. The buyers in between." />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {markets.map((m, i) => (
              <motion.div
                key={m.city}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`p-8 md:p-10 bg-surface border border-border rounded-editorial ${i === 0 ? "lg:mr-8" : "lg:ml-8"}`}
              >
                <p className="font-display text-4xl md:text-5xl font-semibold text-ink">{m.city}</p>
                <p className="mt-4 text-muted leading-relaxed">{m.areas}</p>
                <p className="mt-2 font-mono text-xs text-accent">{m.verticals}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="px-4 md:px-6 py-section-lg bg-base border-y border-border">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader eyebrow="The Fractional Seat" title="One senior operator. Three depths." />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 p-8 md:p-10 bg-surface border border-accent/40 rounded-editorial"
            >
              <span className="text-xs uppercase tracking-[0.12em] text-accent">{tiers[1].name}</span>
              <p className="font-display text-2xl md:text-3xl font-semibold text-ink mt-3">{tiers[1].scope}</p>
              <p className="font-mono text-sm text-muted mt-4">{tiers[1].rhythm}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 md:p-10 bg-surface border border-border rounded-editorial"
            >
              <span className="text-xs uppercase tracking-[0.12em] text-muted">{tiers[0].name}</span>
              <p className="font-display text-xl md:text-2xl font-semibold text-ink mt-3">{tiers[0].scope}</p>
              <p className="font-mono text-sm text-muted mt-4">{tiers[0].rhythm}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8 md:p-10 bg-surface border border-border rounded-editorial"
            >
              <span className="text-xs uppercase tracking-[0.12em] text-muted">{tiers[2].name}</span>
              <p className="font-display text-xl md:text-2xl font-semibold text-ink mt-3">{tiers[2].scope}</p>
              <p className="font-mono text-sm text-muted mt-4">{tiers[2].rhythm}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-4 md:px-6 py-section-lg bg-surface">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-accent mb-4">Start the Conversation</p>
            <h2 className="font-display text-display font-semibold text-ink">Book a 20-minute call.</h2>
            <p className="mt-6 text-muted leading-relaxed max-w-[45ch]">
              Tell us the market you are trying to crack. We will come back with the first accounts we would open.
            </p>
          </div>
          <div className="flex flex-col items-start justify-center">
            <a
              href="mailto:ali@propelbd.co?subject=Book%20a%2020-minute%20BD%20call"
              className="group inline-flex items-center gap-3 font-display text-lg md:text-xl px-8 py-4 bg-ink text-base rounded-editorial hover:bg-ink/90 active:scale-[0.98] transition-all"
            >
              Book a 20-minute call
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <p className="mt-4 text-sm text-muted">Or email <a href="mailto:ali@propelbd.co" className="text-accent hover:text-accent-bright transition-colors">ali@propelbd.co</a></p>
          </div>
        </div>
      </section>
    </>
  );
}
