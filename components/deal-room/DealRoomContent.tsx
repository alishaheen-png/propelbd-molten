"use client";

import { motion } from "framer-motion";

const pipeline = [
  { stage: "Scout", desc: "Map the buyer landscape in Dubai and Abu Dhabi. Identify the accounts that match your ticket and timing." },
  { stage: "Position", desc: "Shape the offer and outbound narrative so the first touch lands as peer-to-peer, not vendor spam." },
  { stage: "Open", desc: "Run the sequence, handle objections, and book meetings with people who can sign." },
  { stage: "Close", desc: "Coach the proposal, manage legal, and keep the deal moving until revenue hits." },
];

const tiers = [
  { name: "Gold", focus: "One account vertical", deliverable: "Targeted outreach · Meeting booking · Pipeline reporting" },
  { name: "Diamond", focus: "Two verticals + partners", deliverable: "Multi-vertical motion · Co-selling · Quarterly planning" },
  { name: "Platinum", focus: "Full market coverage", deliverable: "Market-wide coverage · Board reporting · Revenue operations" },
];

const artifacts = [
  { type: "Calendar", detail: "Thu 14:00 — Al Maryah F&B intro" },
  { type: "CRM", detail: "DIFC Fund · Stage: Legal · Owner: Ali" },
  { type: "Voice note", detail: "Objection handling, procurement loop" },
  { type: "Proposal", detail: "JLT SaaS — SOW v2 ready for send" },
];

const principles = [
  { title: "Senior operator", body: "You get the person running the work, not a junior team padded with account management." },
  { title: "Local market", body: "Dubai and Abu Dhabi networks, time zones, and buyer etiquette — not remote guesswork." },
  { title: "Revenue-first", body: "Every activity ties to a meeting, a proposal, or a close. No vanity metrics." },
];

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-12 md:mb-16">
      <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4">{eyebrow}</p>
      <h2 className="font-display text-display font-semibold text-ink max-w-[18ch] tracking-tight">{title}</h2>
      {subtitle && <p className="mt-4 text-muted max-w-[55ch] leading-relaxed">{subtitle}</p>}
    </div>
  );
}

export function DealRoomContent() {
  return (
    <>
      {/* Pipeline */}
      <section id="how" className="px-4 md:px-6 py-section-lg bg-base border-t border-border">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeading eyebrow="The Pipeline" title="Four stages. One owner." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-editorial overflow-hidden">
            {pipeline.map((step, i) => (
              <motion.div
                key={step.stage}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-surface p-6 md:p-8"
              >
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
                <h3 className="font-display text-xl font-semibold text-ink mt-3">{step.stage}</h3>
                <p className="text-sm text-muted mt-3 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Retainer model */}
      <section className="px-4 md:px-6 py-section-lg bg-surface-soft">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeading eyebrow="The Retainer" title="A fractional seat, not a full-time gamble." subtitle="Replace the Head-of-BD hiring cycle with a senior operator who already knows the market." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2 p-8 md:p-10 border border-accent bg-surface rounded-editorial"
            >
              <span className="font-mono text-xs text-accent uppercase tracking-wider">{tiers[1].name}</span>
              <p className="font-display text-2xl font-semibold text-ink mt-3">{tiers[1].focus}</p>
              <p className="font-mono text-sm text-muted mt-4 leading-relaxed max-w-[55ch]">{tiers[1].deliverable}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="p-6 md:p-8 border border-border bg-base rounded-editorial"
            >
              <span className="font-mono text-xs text-muted uppercase tracking-wider">{tiers[0].name}</span>
              <p className="font-display text-lg font-semibold text-ink mt-3">{tiers[0].focus}</p>
              <p className="font-mono text-xs text-muted mt-4 leading-relaxed">{tiers[0].deliverable}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="p-6 md:p-8 border border-border bg-base rounded-editorial"
            >
              <span className="font-mono text-xs text-muted uppercase tracking-wider">{tiers[2].name}</span>
              <p className="font-display text-lg font-semibold text-ink mt-3">{tiers[2].focus}</p>
              <p className="font-mono text-xs text-muted mt-4 leading-relaxed">{tiers[2].deliverable}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Operator's desk */}
      <section className="px-4 md:px-6 py-section-lg bg-base border-t border-border">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <SectionHeading eyebrow="The Desk" title="Real artifacts. Not stock theater." />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {artifacts.map((artifact) => (
              <div key={artifact.type} className="p-5 bg-surface border border-border rounded-editorial hover:border-accent transition-colors">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{artifact.type}</span>
                <p className="font-mono text-sm text-ink mt-2">{artifact.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="px-4 md:px-6 py-section-lg bg-surface-soft border-t border-border">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeading eyebrow="The Roster" title="How we work with founders." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border rounded-editorial overflow-hidden">
            {principles.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-surface p-6 md:p-8"
              >
                <p className="font-display text-2xl font-semibold text-ink">{p.title}</p>
                <p className="font-mono text-xs text-accent mt-2 uppercase tracking-wider">0{i + 1}</p>
                <p className="text-sm text-muted mt-4 leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-4 md:px-6 py-section-lg bg-base border-t border-border">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4">The Briefing</p>
            <h2 className="font-display text-display font-semibold text-ink tracking-tight max-w-[16ch]">
              Show us the deal you are stuck on.
            </h2>
          </div>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Name" aria-label="Name" className="w-full bg-surface border border-border rounded-editorial px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none" />
              <input type="email" placeholder="Email" aria-label="Email" className="w-full bg-surface border border-border rounded-editorial px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none" />
            </div>
            <input type="text" placeholder="Company" aria-label="Company" className="w-full bg-surface border border-border rounded-editorial px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none" />
            <textarea placeholder="What is the revenue gap you need closed?" aria-label="Message" rows={4} className="w-full bg-surface border border-border rounded-editorial px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none" />
            <button type="submit" className="font-mono text-sm px-6 py-3 bg-accent text-ink rounded-editorial hover:bg-accent-hover active:scale-[0.98] transition-all">
              Send the briefing
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
