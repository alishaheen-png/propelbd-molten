"use client";

import { motion } from "framer-motion";

const cards = [
  { label: "Intro", client: "Al Maryah F&B", stage: "Replied", col: "col-span-2", row: "row-span-1" },
  { label: "Meeting", client: "DIFC Fund", stage: "Confirmed", col: "col-span-1", row: "row-span-2" },
  { label: "Proposal", client: "JLT SaaS", stage: "Sent", col: "col-span-1", row: "row-span-1" },
  { label: "Close", client: "ADGM Family Office", stage: "Legal", col: "col-span-1", row: "row-span-1" },
];

const stageColor: Record<string, string> = {
  Replied: "text-muted border-muted/40",
  Confirmed: "text-accent border-accent",
  Sent: "text-accent-light border-accent/60",
  Legal: "text-ink border-ink/30",
};

export function BentoBoard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
      className="grid grid-cols-3 grid-rows-3 gap-3 w-full max-w-[520px] aspect-square"
    >
      {cards.map((card, i) => (
        <motion.div
          key={card.client}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
          className={`${card.col} ${card.row} bg-surface border ${stageColor[card.stage]} rounded-editorial p-4 flex flex-col justify-between hover:border-accent transition-colors duration-300`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider opacity-70">{card.label}</span>
            <span className="font-mono text-[10px] opacity-70">{card.stage}</span>
          </div>
          <span className="font-display text-base md:text-lg font-medium text-ink">{card.client}</span>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.72, duration: 0.5 }}
        className="col-span-1 row-span-1 bg-surface border border-border rounded-editorial p-4 flex flex-col justify-center items-center text-center"
      >
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Next action</span>
        <span className="font-mono text-xs text-accent mt-2">Follow-up</span>
      </motion.div>
    </motion.div>
  );
}
