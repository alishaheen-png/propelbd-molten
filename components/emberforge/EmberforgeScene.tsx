"use client";

import { useEffect, useRef } from "react";
import { EmberforgeEngine } from "./EmberforgeEngine";

interface Props {
  onProgress?: (t: number) => void;
}

/* React wrapper for the vanilla EmberforgeEngine. Reduced-motion callers never mount the
   canvas at all — a static CSS ember-gradient poster substitutes (see page.tsx). Engine
   lifecycle is fully owned here: created on mount, destroyed on unmount (no leaks).

   No fade-in/opacity-transition on the canvas itself — a prior version gated visibility
   behind a `ready` state + CSS transition, which left a real (if brief) window where the
   canvas was substantially transparent. Simpler and correct: full opacity immediately;
   the engine's own first frame renders inside the same tick the browser paints. */
export default function EmberforgeScene({ onProgress }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<EmberforgeEngine | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    engineRef.current = new EmberforgeEngine(canvasRef.current, { onProgress });
    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="emberforge-canvas" aria-hidden="true" />
      <style jsx>{`
        .emberforge-canvas {
          position: fixed;
          inset: 0;
          z-index: 2;
          width: 100vw;
          height: 100vh;
          display: block;
          pointer-events: none;
        }
      `}</style>
    </>
  );
}
