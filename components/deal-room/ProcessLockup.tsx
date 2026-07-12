"use client";

import { motion } from "framer-motion";

const steps = [
  { label: "Scout", x: "8%", y: "12%" },
  { label: "Position", x: "62%", y: "8%" },
  { label: "Open", x: "20%", y: "66%" },
  { label: "Close", x: "72%", y: "58%" },
];

export function ProcessLockup() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
      className="relative w-full max-w-[540px] aspect-[4/3] md:aspect-square"
    >
      {steps.map((step, i) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.15, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="absolute"
          style={{ left: step.x, top: step.y }}
        >
          <div className="px-4 py-3 md:px-5 md:py-4 bg-surface border border-border rounded-editorial hover:border-accent transition-colors duration-300">
            <span className="font-mono text-[10px] text-muted uppercase tracking-wider">0{i + 1}</span>
            <p className="font-display text-lg md:text-2xl font-semibold text-ink mt-1">{step.label}</p>
          </div>
        </motion.div>
      ))}

      {/* connecting lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        <motion.path
          d="M 60 60 C 160 40, 220 60, 320 50 S 420 120, 380 220"
          fill="none"
          stroke="#2357C4"
          strokeWidth="1.5"
          strokeOpacity="0.35"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );
}
