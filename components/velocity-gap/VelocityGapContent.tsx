"use client";

import { motion } from "framer-motion";

const ticker = [
  "Family offices",
  "SaaS enterprises",
  "F&B groups",
  "PE/VC funds",
  "Proptech developers",
  "Fintech platforms",
  "Hospitality operators",
];

const process = [
  { step: "Scout", body: "Map the buyer universe and rank by fit, timing, and access." },
  { step: "Position", body: "Craft the angle so the first touch reads like an insider note." },
  { step: "Open", body: "Run multithreaded outreach until meetings are on the calendar." },
  { step: "Close", body: "Own the deal desk until signature, then hand off a clean account." },
];

const tiers = [
  { name: "Gold", scope: "One vertical", rhythm: "Monthly sprint" },
  { name: "Diamond", scope: "Two verticals", rhythm: "Bi-weekly sprint" },
  { name: "Platinum", scope: "Full coverage", rhythm: "Weekly war room" },
];

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-12 md:mb-16">
      <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4">{eyebrow}</p>
      <h2 className="font-display text-display font-semibold text-ink max-w-[18ch] tracking-tight">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-soft max-w-[55ch] leading-relaxed">{subtitle}</p>}
    </div>
  );
}

export function VelocityGapContent() {
  return (
    <>
      {/* Empty Chair */}
      <section className="px-4 md:px-6 py-section-lg bg-surface-soft border-t border-border">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <SectionHeading eyebrow="The Empty Chair" title="The real cost of not having BD." />
            <div className="space-y-6 text-muted-soft leading-relaxed max-w-[60ch]">
              <p>
                You built the product. You hired the engineers. You raised the round. But the chair reserved for revenue is still empty.
              </p>
              <p>
                A senior BD hire takes six months to recruit, three more to ramp, and leaves with the playbook. A fractional operator shows up with the network, the motion, and the discipline already built.
              </p>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="p-8 bg-base border border-border rounded-editorial">
              <p className="font-mono text-xs text-muted uppercase tracking-wider mb-4">Founder math</p>
              <div className="space-y-4">
                <div className="flex justify-between font-mono text-sm">
                  <span className="text-muted">Full-time BD hire</span>
                  <span className="text-ink">Recruit + ramp</span>
                </div>
                <div className="flex justify-between font-mono text-sm">
                  <span className="text-muted">PropelBD</span>
                  <span className="text-accent">Onboard + move</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deals in Motion */}
      <section className="py-12 md:py-16 bg-base border-y border-border overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...ticker, ...ticker, ...ticker].map((item, i) => (
            <span key={i} className="font-display text-3xl md:text-5xl font-semibold text-ink/10 mx-6 md:mx-10">
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* How We Move */}
      <section className="px-4 md:px-6 py-section-lg bg-base-deep">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeading eyebrow="How We Move" title="Scout. Position. Open. Close." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {process.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`p-6 md:p-8 bg-surface-soft border border-border rounded-editorial ${i % 2 === 1 ? "md:mt-12" : ""}`}
              >
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
                <h3 className="font-display text-2xl font-semibold text-ink mt-3">{p.step}</h3>
                <p className="text-sm text-muted-soft mt-3 leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline Velocity */}
      <section className="px-4 md:px-6 py-section-lg bg-surface-soft border-t border-border">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeading eyebrow="Pipeline Velocity" title="Speed is a competitive advantage." subtitle="We measure what moves revenue, not activity for its own sake." />
          <div className="h-64 md:h-80 bg-base border border-border rounded-editorial p-6 relative overflow-hidden">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
              <motion.path
                d="M0,250 C150,240 250,180 400,190 S650,120 800,80 S950,60 1000,30"
                fill="none"
                stroke="#2357C4"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, ease: "easeOut" }}
              />
              <motion.path
                d="M0,250 C150,240 250,180 400,190 S650,120 800,80 S950,60 1000,30 L1000,300 L0,300 Z"
                fill="rgba(35, 87, 196, 0.08)"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.6 }}
              />
            </svg>
            <div className="absolute bottom-6 left-6 font-mono text-xs text-muted">
              Deal velocity over a quarter
            </div>
          </div>
        </div>
      </section>

      {/* Fractional Seat */}
      <section className="px-4 md:px-6 py-section-lg bg-base-deep border-t border-border">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeading eyebrow="The Fractional Seat" title="One senior operator. Three depths." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border rounded-editorial overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2 p-8 md:p-10 bg-surface"
            >
              <span className="font-mono text-xs text-accent uppercase tracking-wider">{tiers[1].name}</span>
              <p className="font-display text-2xl font-semibold text-ink mt-3">{tiers[1].scope}</p>
              <p className="font-mono text-sm text-muted mt-4">{tiers[1].rhythm}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="p-6 md:p-8 bg-surface-soft"
            >
              <span className="font-mono text-xs text-muted uppercase tracking-wider">{tiers[0].name}</span>
              <p className="font-display text-lg font-semibold text-ink mt-3">{tiers[0].scope}</p>
              <p className="font-mono text-xs text-muted mt-4">{tiers[0].rhythm}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="p-6 md:p-8 bg-surface-soft"
            >
              <span className="font-mono text-xs text-muted uppercase tracking-wider">{tiers[2].name}</span>
              <p className="font-display text-lg font-semibold text-ink mt-3">{tiers[2].scope}</p>
              <p className="font-mono text-xs text-muted mt-4">{tiers[2].rhythm}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-4 md:px-6 py-section-lg bg-base border-t border-border">
        <div className="max-w-[1400px] mx-auto text-center">
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4">Start the Conversation</p>
          <h2 className="font-display text-display font-semibold text-ink tracking-tight">
            Book a 20-minute call.
          </h2>
          <p className="mt-4 text-muted-soft max-w-[50ch] mx-auto leading-relaxed">
            Tell us the market you are trying to crack. We will come back with the first ten accounts we would open.
          </p>
          <a
            href="mailto:ali@propelbd.co?subject=20-minute%20BD%20call"
            className="inline-block mt-8 font-mono text-sm px-6 py-3 bg-accent text-ink rounded-editorial hover:bg-accent-hover active:scale-[0.98] transition-all"
          >
            Book a 20-minute call
          </a>
        </div>
      </section>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 24s linear infinite;
        }
      `}</style>
    </>
  );
}
