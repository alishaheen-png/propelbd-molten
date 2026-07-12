"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ArrowRight, Mail, FileText, Phone, Calendar } from "lucide-react";

const emails = [
  { sender: "Al Maryah Group", subject: "Re: partnership structure", active: true },
  { sender: "DIFC Fund", subject: "Introduction — board deck", active: false },
  { sender: "ADGM Family Office", subject: "Q3 pipeline review", active: false },
  { sender: "JLT SaaS", subject: "Follow-up: term sheet", active: true },
  { sender: "Masdar Proptech", subject: "Procurement contact", active: false },
  { sender: "Dubai F&B Group", subject: "Co-selling intro", active: false },
];

const artifacts = [
  { icon: FileText, label: "Term sheet v2", meta: "Sent · Aug 12" },
  { icon: FileText, label: "SOW — fractional BD", meta: "Draft · Aug 10" },
  { icon: Mail, label: "Board memo", meta: "Reviewed · Aug 08" },
  { icon: Phone, label: "Partner intro", meta: "Warm · Aug 07" },
  { icon: Calendar, label: "Proposal — Q3", meta: "Booked · Aug 06" },
];

const process = [
  { name: "Scout", x: 80 },
  { name: "Position", x: 260 },
  { name: "Open", x: 440 },
  { name: "Close", x: 620 },
];

export function OpenTheDoorsContent() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-[calc(100dvh-5rem)] px-4 md:px-6 py-16 md:py-24 flex items-center">
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="relative w-full max-w-[420px] mx-auto lg:mx-0 aspect-[3/4]"
            >
              <svg viewBox="0 0 300 420" className="w-full h-full" aria-hidden="true">
                <defs>
                  <linearGradient id="doorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0B1A3A" />
                    <stop offset="100%" stopColor="#162238" />
                  </linearGradient>
                </defs>
                <rect x="20" y="20" width="260" height="380" rx="2" fill="url(#doorGrad)" stroke="#2357C4" strokeWidth="2" />
                <rect x="45" y="55" width="90" height="130" rx="1" fill="#0E1726" stroke="#1E324E" strokeWidth="1" />
                <rect x="165" y="55" width="90" height="130" rx="1" fill="#0E1726" stroke="#1E324E" strokeWidth="1" />
                <rect x="45" y="210" width="90" height="170" rx="1" fill="#0E1726" stroke="#1E324E" strokeWidth="1" />
                <rect x="165" y="210" width="90" height="170" rx="1" fill="#0E1726" stroke="#1E324E" strokeWidth="1" />
                <circle cx="245" cy="210" r="6" fill="#4A7FD9" />
                <motion.path
                  d="M 20 20 L 280 20"
                  stroke="#5E8BFF"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                />
              </svg>
            </motion.div>
          </div>
          <div className="lg:col-span-6 order-1 lg:order-2">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs uppercase tracking-[0.12em] text-accent mb-6"
            >
              PropelBD — Open The Doors
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
              className="font-display text-hero-sm font-semibold text-ink leading-[0.98] tracking-tight"
            >
              You didn&apos;t start this to become your own BD hire.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 md:mt-8 text-lg md:text-xl text-muted max-w-[50ch] leading-relaxed"
            >
              Revenue growth without the full-time hire. We open the doors, run the rooms, and close the deals.
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
                Show us the deal
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Email stream */}
      <section className="px-4 md:px-6 py-section-lg bg-surface border-y border-border overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader eyebrow="The Room of Unread Introductions" title="Every email is a door." />
          <div className="space-y-4 md:space-y-6">
            {emails.map((email, i) => (
              <motion.div
                key={email.subject}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className={`flex flex-col md:flex-row md:items-baseline gap-1 md:gap-6 border-b border-border pb-4 md:pb-6 ${
                  email.active ? "opacity-100" : "opacity-40"
                }`}
              >
                <span className={`font-mono text-xs ${email.active ? "text-accent" : "text-muted"} w-40 shrink-0`}>
                  {email.sender}
                </span>
                <span className={`font-display text-xl md:text-3xl ${email.active ? "text-ink font-semibold" : "text-ink/60"}`}>
                  {email.subject}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Territory */}
      <section className="px-4 md:px-6 py-section-lg bg-base-deep">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <SectionHeader eyebrow="The Territory" title="Dubai and Abu Dhabi." />
            <p className="text-lg md:text-xl text-muted leading-relaxed max-w-[55ch]">
              The buyers are here. The family offices, the funds, the F&B groups, the SaaS buyers. We know the doors because we have already knocked on them.
            </p>
          </div>
          <div className="lg:col-span-5 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 bg-surface border border-border rounded-editorial"
            >
              <p className="font-display text-2xl font-semibold text-ink">Dubai</p>
              <p className="text-sm text-muted mt-2">DIFC · DMCC · Dubai Internet City</p>
              <p className="font-mono text-xs text-accent mt-2">Fintech · SaaS · F&B</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-surface border border-border rounded-editorial"
            >
              <p className="font-display text-2xl font-semibold text-ink">Abu Dhabi</p>
              <p className="text-sm text-muted mt-2">ADGM · Al Maryah Island · Masdar City</p>
              <p className="font-mono text-xs text-accent mt-2">Family offices · Proptech · Climate</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Deal table */}
      <section className="px-4 md:px-6 py-section-lg bg-base border-y border-border">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader eyebrow="The Deal Table" title="Every artifact in one stream." />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 p-6 bg-surface border border-border rounded-editorial hover:border-accent transition-colors"
            >
              <FileText className="w-5 h-5 text-accent mb-4" />
              <p className="font-display text-lg font-semibold text-ink">{artifacts[0].label}</p>
              <p className="font-mono text-xs text-muted mt-2">{artifacts[0].meta}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="p-6 bg-surface border border-border rounded-editorial hover:border-accent transition-colors"
            >
              <FileText className="w-5 h-5 text-accent mb-4" />
              <p className="font-display text-lg font-semibold text-ink">{artifacts[1].label}</p>
              <p className="font-mono text-xs text-muted mt-2">{artifacts[1].meta}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 }}
              className="p-6 bg-surface border border-border rounded-editorial hover:border-accent transition-colors"
            >
              <Mail className="w-5 h-5 text-accent mb-4" />
              <p className="font-display text-lg font-semibold text-ink">{artifacts[2].label}</p>
              <p className="font-mono text-xs text-muted mt-2">{artifacts[2].meta}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.24 }}
              className="md:col-span-2 p-6 bg-surface border border-border rounded-editorial hover:border-accent transition-colors"
            >
              <Phone className="w-5 h-5 text-accent mb-4" />
              <p className="font-display text-lg font-semibold text-ink">{artifacts[3].label}</p>
              <p className="font-mono text-xs text-muted mt-2">{artifacts[3].meta}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.32 }}
              className="md:col-span-2 p-6 bg-surface border border-border rounded-editorial hover:border-accent transition-colors"
            >
              <Calendar className="w-5 h-5 text-accent mb-4" />
              <p className="font-display text-lg font-semibold text-ink">{artifacts[4].label}</p>
              <p className="font-mono text-xs text-muted mt-2">{artifacts[4].meta}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Operating system */}
      <section className="px-4 md:px-6 py-section-lg bg-surface">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader eyebrow="The Operating System" title="A system for revenue, not noise." />
          <div className="relative h-48 md:h-64 bg-base border border-border rounded-editorial overflow-hidden">
            <svg className="absolute inset-0 w-full h-full px-8 md:px-16" viewBox="0 0 700 200" preserveAspectRatio="xMidYMid meet">
              <motion.path
                d="M 50 100 L 650 100"
                fill="none"
                stroke="#2357C4"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              {process.map((p, i) => (
                <g key={p.name}>
                  <motion.circle
                    cx={p.x}
                    cy="100"
                    r="8"
                    fill="#2357C4"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.2 }}
                  />
                  <motion.text
                    x={p.x}
                    y="140"
                    textAnchor="middle"
                    fill="#F4F6FA"
                    fontSize="14"
                    fontFamily="var(--font-bricolage)"
                    fontWeight="600"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.7 + i * 0.2 }}
                  >
                    {p.name}
                  </motion.text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="px-4 md:px-6 py-section-lg bg-base-deep border-y border-border">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader eyebrow="The Tension Bar" title="One seat. Three depths." />
          <div className="p-8 md:p-12 bg-surface border border-border rounded-editorial">
            <div className="h-2 bg-border rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full bg-accent"
              />
            </div>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              {["Advisory", "Embedded", "Revenue Partner"].map((tier, i) => (
                <div key={tier}>
                  <p className="font-display text-xl font-semibold text-ink">{tier}</p>
                  <p className="font-mono text-xs text-muted mt-2">
                    {i === 0 ? "One vertical" : i === 1 ? "Multi-vertical" : "Full coverage"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-4 md:px-6 py-section-lg bg-base">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-accent mb-4">The Closing Room</p>
            <h2 className="font-display text-display font-semibold text-ink">
              Show us the deal you&apos;re stuck on.
            </h2>
          </div>
          <div className="flex flex-col items-start justify-center">
            <a
              href="mailto:ali@propelbd.co?subject=Deal%20I%20am%20stuck%20on"
              className="group inline-flex items-center gap-3 font-display text-lg md:text-xl px-8 py-4 bg-ink text-base rounded-editorial hover:bg-ink/90 active:scale-[0.98] transition-all"
            >
              Send the deal
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <p className="mt-4 text-sm text-muted">We will diagnose the gap and name the buyers.</p>
          </div>
        </div>
      </section>
    </>
  );
}
