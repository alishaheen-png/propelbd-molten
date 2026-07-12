"use client";

import { motion } from "framer-motion";
import { ProcessLockup } from "./ProcessLockup";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ArrowRight } from "lucide-react";

const pipeline = [
  { step: "Scout", body: "Map the buyer landscape in Dubai and Abu Dhabi. Identify the accounts that match your ticket and timing." },
  { step: "Position", body: "Shape the offer and outbound narrative so the first touch lands as peer-to-peer, not vendor spam." },
  { step: "Open", body: "Run the sequence, handle objections, and book meetings with people who can sign." },
  { step: "Close", body: "Coach the proposal, manage legal, and keep the deal moving until revenue hits." },
];

const tiers = [
  { name: "Advisory", scope: "One vertical", detail: "Targeted outreach, meeting booking, and pipeline reporting for a single account type." },
  { name: "Embedded", scope: "Two verticals + partners", detail: "Multi-vertical motion, co-selling with partners, and quarterly revenue planning." },
  { name: "Revenue Partner", scope: "Full market coverage", detail: "Market-wide coverage, board reporting, and revenue operations for the full funnel." },
];

const principles = [
  { title: "Senior operator", body: "You get the person running the work, not a junior team padded with account management." },
  { title: "Local market", body: "Dubai and Abu Dhabi networks, time zones, and buyer etiquette — not remote guesswork." },
  { title: "Revenue-first", body: "Every activity ties to a meeting, a proposal, or a close. No vanity metrics." },
];

export function DealRoomContent() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-[calc(100dvh-5rem)] px-4 md:px-6 py-16 md:py-24 flex items-center">
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">
          <div className="lg:col-span-6">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs uppercase tracking-[0.12em] text-accent mb-6"
            >
              PropelBD — The Deal Room
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
              className="font-display text-hero font-semibold text-ink leading-[0.98] tracking-tight"
            >
              Revenue is a system.
              <br />
              <span className="text-accent">We run it.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
              className="mt-6 md:mt-8 text-lg md:text-xl text-muted max-w-[50ch] leading-relaxed"
            >
              No full-time hires. No deck theater. Just meetings with buyers who can sign.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
              className="mt-8 md:mt-10 flex flex-col sm:flex-row items-start gap-4"
            >
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 font-display text-base px-6 py-3 bg-ink text-base rounded-editorial hover:bg-ink/90 active:scale-[0.98] transition-all"
              >
                Show me the pipeline
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a href="#how" className="font-display text-base text-muted hover:text-ink transition-colors px-1 py-3">
                See how it works
              </a>
            </motion.div>
          </div>
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <ProcessLockup />
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section id="how" className="px-4 md:px-6 py-section-lg bg-base border-y border-border">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader eyebrow="The Pipeline" title="Four stages. One owner." />

          <div className="relative">
            <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-border" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {pipeline.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.19, 1, 0.22, 1] }}
                  className={`relative ${i % 2 === 1 ? "lg:mt-16" : ""}`}
                >
                  <div className="hidden lg:flex items-center justify-center w-4 h-4 rounded-full bg-accent absolute -top-10 left-0" />
                  <span className="font-mono text-xs text-muted">0{i + 1}</span>
                  <h3 className="font-display text-2xl md:text-3xl font-semibold text-ink mt-3">{item.step}</h3>
                  <p className="text-sm md:text-base text-muted mt-3 leading-relaxed">{item.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="px-4 md:px-6 py-section-lg bg-surface">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader eyebrow="The Retainer" title="A fractional seat, not a full-time gamble." subtitle="Replace the Head-of-BD hiring cycle with a senior operator who already knows the market." />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="lg:col-span-2 p-8 md:p-10 bg-base border border-accent/40 rounded-editorial"
            >
              <span className="text-xs uppercase tracking-[0.12em] text-accent">{tiers[1].name}</span>
              <p className="font-display text-2xl md:text-3xl font-semibold text-ink mt-3">{tiers[1].scope}</p>
              <p className="text-muted mt-4 max-w-[65ch] leading-relaxed">{tiers[1].detail}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
              className="p-8 md:p-10 bg-base border border-border rounded-editorial"
            >
              <span className="text-xs uppercase tracking-[0.12em] text-muted">{tiers[0].name}</span>
              <p className="font-display text-xl md:text-2xl font-semibold text-ink mt-3">{tiers[0].scope}</p>
              <p className="text-muted mt-4 leading-relaxed">{tiers[0].detail}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
              className="p-8 md:p-10 bg-base border border-border rounded-editorial"
            >
              <span className="text-xs uppercase tracking-[0.12em] text-muted">{tiers[2].name}</span>
              <p className="font-display text-xl md:text-2xl font-semibold text-ink mt-3">{tiers[2].scope}</p>
              <p className="text-muted mt-4 leading-relaxed">{tiers[2].detail}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="px-4 md:px-6 py-section-lg bg-base-deep">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader eyebrow="The Roster" title="How we work with founders." />
          <div className="space-y-8 md:space-y-0">
            {principles.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 border-b border-border first:border-t"
              >
                <div className="md:col-span-1">
                  <span className="font-mono text-xs text-muted">0{i + 1}</span>
                </div>
                <div className="md:col-span-4">
                  <h3 className="font-display text-2xl md:text-3xl font-semibold text-ink">{p.title}</h3>
                </div>
                <div className="md:col-span-7">
                  <p className="text-muted leading-relaxed max-w-[60ch]">{p.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-4 md:px-6 py-section-lg bg-surface border-y border-border">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-accent mb-4">The Briefing</p>
            <h2 className="font-display text-display font-semibold text-ink">
              Show us the deal you are stuck on.
            </h2>
            <p className="mt-6 text-muted leading-relaxed max-w-[45ch]">
              We reply within one business day. No pitch deck required.
            </p>
          </div>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email"
              aria-label="Email"
              className="w-full bg-base border border-border rounded-editorial px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <input
              type="text"
              placeholder="Company"
              aria-label="Company"
              className="w-full bg-base border border-border rounded-editorial px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <textarea
              placeholder="What deal are you stuck on?"
              aria-label="Message"
              rows={5}
              className="w-full bg-base border border-border rounded-editorial px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-display text-base px-6 py-3 bg-ink text-base rounded-editorial hover:bg-ink/90 active:scale-[0.98] transition-all"
            >
              Send the briefing
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
