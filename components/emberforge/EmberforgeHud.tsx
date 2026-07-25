"use client";

import { forwardRef } from "react";

/* Visible-progress readout for the FORGE/STREETS/CORE pinned-feel span (doctrine rule:
   pinned sections must show visible progress every ~25% of scroll). Text content is set
   imperatively via the forwarded ref from page.tsx's scroll callback — avoids a React
   re-render on every scroll tick. */
const EmberforgeHud = forwardRef<HTMLDivElement>(function EmberforgeHud(_props, ref) {
  return (
    <div ref={ref} className="emberforge-hud" aria-hidden="true">
      <span className="emberforge-hud-label" />
      <style jsx>{`
        .emberforge-hud {
          position: fixed;
          left: 1.5rem;
          bottom: 1.5rem;
          z-index: 20;
          font-family: var(--font-jetbrains, monospace);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #ff8a4c;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
});

export default EmberforgeHud;
