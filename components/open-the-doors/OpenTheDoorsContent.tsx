"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const subjectLines = [
  "Re: partnership structure",
  "Introduction — Al Maryah Group",
  "Follow-up: board deck",
  "Q3 pipeline review",
  "ADGM fund — next steps",
  "Term sheet feedback",
  "DIFC license discussion",
  "Procurement contact",
  "Co-selling with Emirates NBD",
];

const artifacts = [
  "Term sheet v2",
  "SOW — fractional BD",
  "Board memo",
  "Outreach sequence",
  "Partner intro",
  "Proposal — Q3",
];

export function OpenTheDoorsContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const doorY = useTransform(scrollYProgress, [0, 0.3], ["0%", "-100%"]);

  return (
    <div ref={containerRef}>
      {/* Threshold — Door */}
      <section className="relative h-[calc(100dvh-4rem)] flex items-center justify-center overflow-hidden bg-base-door">
        <a
          href="#rooms"
          className="absolute top-6 right-6 z-30 font-mono text-xs text-muted-door hover:text-ink-door transition-colors underline underline-offset-4"
        >
          Skip intro
        </a>

        <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20">
          <p className="font-display text-[11.5vw] md:text-[8vw] font-bold text-ink-door leading-none tracking-tighter writing-mode-vertical md:writing-mode-horizontal max-w-[14ch]">
            You didn&apos;t start this to become your own BD hire.
          </p>
        </div>

        <motion.div
          style={{ y: doorY }}
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
        >
          <div className="relative w-[280px] md:w-[420px] h-[420px] md:h-[640px] bg-surface-door border-x-[16px] md:border-x-[24px] border-surface-muted-door">
            <div className="absolute top-1/2 right-4 md:right-6 w-3 h-3 md:w-4 md:h-4 rounded-full bg-accent-light" />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              style={{ originX: 0 }}
              className="absolute inset-0 bg-accent/10"
            />
          </div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center">
          <p className="font-mono text-xs text-muted-door uppercase tracking-widest animate-pulse">Scroll to enter</p>
        </div>
      </section>

      {/* Room of Unread Introductions */}
      <section id="rooms" className="relative py-section-lg overflow-hidden bg-base-door border-t border-border">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 mb-12">
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4">The Room of Unread Introductions</p>
          <h2 className="font-display text-display font-semibold text-ink-door tracking-tight max-w-[16ch]">
            Every email is a door.
          </h2>
        </div>

        <div className="space-y-6">
          {subjectLines.map((line, i) => (
            <motion.div
              key={line}
              initial={{ x: i % 2 === 0 ? -60 : 60, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="font-mono text-lg md:text-3xl text-ink-door/20 hover:text-ink-door transition-colors px-4 md:px-6"
              style={{ marginLeft: `${(i % 4) * 8}%` }}
            >
              {line}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Territory */}
      <section className="py-section-lg bg-surface-door border-t border-border">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4">The Territory</p>
          <h2 className="font-display text-display font-semibold text-ink-door tracking-tight max-w-[16ch]">
            Dubai. Abu Dhabi. The buyers in between.
          </h2>

          <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-base-door border border-border rounded-editorial"
            >
              <p className="font-display text-3xl font-semibold text-ink-door">Dubai</p>
              <p className="font-mono text-sm text-muted-door mt-4 leading-relaxed">
                DIFC, DMCC, Dubai Internet City, Downtown. Family offices, fintech, SaaS, F&B groups.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 bg-base-door border border-border rounded-editorial"
            >
              <p className="font-display text-3xl font-semibold text-ink-door">Abu Dhabi</p>
              <p className="font-mono text-sm text-muted-door mt-4 leading-relaxed">
                ADGM, Al Maryah Island, Masdar City. Sovereign wealth adjacents, proptech, climate tech.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Deal Table */}
      <section className="py-section-lg bg-base-door border-t border-border overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 mb-8">
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4">The Deal Table</p>
          <h2 className="font-display text-display font-semibold text-ink-door tracking-tight max-w-[14ch]">
            Every artifact in one stream.
          </h2>
        </div>

        <div className="flex gap-4 px-4 md:px-6 overflow-x-auto pb-4">
          {artifacts.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex-shrink-0 p-6 bg-surface-door border border-border rounded-editorial min-w-[220px] md:min-w-[280px]"
            >
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-door">Document</span>
              <p className="font-display text-lg font-semibold text-ink-door mt-3">{item}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Operating System */}
      <section className="py-section-lg bg-surface-door border-t border-border">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4">The Operating System</p>
          <h2 className="font-display text-display font-semibold text-ink-door tracking-tight max-w-[18ch]">
            A system for revenue, not noise.
          </h2>

          <div className="mt-12 relative h-64 md:h-96 bg-base-door border border-border rounded-editorial overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
              <motion.path
                d="M50,150 L200,150 L250,80 L400,80 L450,220 L600,220 L650,150 L750,150"
                fill="none"
                stroke="#2357C4"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <motion.circle cx="50" cy="150" r="6" fill="#2357C4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} />
              <motion.circle cx="250" cy="80" r="6" fill="#5E8BFF" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }} />
              <motion.circle cx="450" cy="220" r="6" fill="#5E8BFF" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.0 }} />
              <motion.circle cx="750" cy="150" r="6" fill="#2357C4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.4 }} />
            </svg>
            <div className="absolute bottom-4 left-4 font-mono text-xs text-muted-door">Scout → Position → Open → Close</div>
          </div>
        </div>
      </section>

      {/* Tension Bar */}
      <section className="py-section-lg bg-base-door border-t border-border">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4">The Tension Bar</p>
          <h2 className="font-display text-display font-semibold text-ink-door tracking-tight max-w-[16ch]">
            One seat. Three depths.
          </h2>

          <div className="mt-12 p-8 md:p-12 bg-surface-door border border-border rounded-editorial">
            <div className="h-2 bg-border rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full bg-accent"
              />
              <div className="absolute top-1/2 -translate-y-1/2 left-[25%] w-3 h-3 bg-ink-door rounded-full" />
              <div className="absolute top-1/2 -translate-y-1/2 left-[60%] w-3 h-3 bg-ink-door rounded-full" />
              <div className="absolute top-1/2 -translate-y-1/2 right-0 w-3 h-3 bg-ink-door rounded-full" />
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="font-display text-lg font-semibold text-ink-door">Gold</p>
                <p className="font-mono text-xs text-muted-door mt-1">Focused vertical</p>
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-ink-door">Diamond</p>
                <p className="font-mono text-xs text-muted-door mt-1">Multi-vertical</p>
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-ink-door">Platinum</p>
                <p className="font-mono text-xs text-muted-door mt-1">Full coverage</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Room */}
      <section id="contact" className="relative py-section-lg bg-base-door border-t border-border overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 text-center relative z-10">
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4">The Closing Room</p>
          <h2 className="font-display text-hero-sm font-semibold text-ink-door tracking-tighter">
            Show us the deal you&apos;re stuck on.
          </h2>
          <p className="mt-6 text-muted-door max-w-[50ch] mx-auto leading-relaxed">
            We will diagnose the gap, name the buyers, and tell you if PropelBD can close it.
          </p>
          <a
            href="mailto:ali@propelbd.co?subject=Deal%20I%20am%20stuck%20on"
            className="inline-block mt-8 font-mono text-sm px-6 py-3 bg-accent text-ink rounded-editorial hover:bg-accent-hover active:scale-[0.98] transition-all"
          >
            Start the conversation
          </a>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
      </section>

      <style jsx>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
        @media (min-width: 768px) {
          .md\\:writing-mode-horizontal {
            writing-mode: horizontal-tb;
          }
        }
      `}</style>
    </div>
  );
}
