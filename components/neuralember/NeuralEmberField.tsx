"use client";

/* Atmospheric wash BEHIND the particle/mesh canvas — @paper-design/shaders-react's
   NeuroNoise ("a glowing, web-like structure of fluid lines and soft intersections
   ... atmospheric, organic-yet-futuristic") is the literal "neural field" texture
   the coordinator flagged as the real 21st.dev shader door. Chapter-locked color
   state (not continuous per-scroll-pixel react state — that would thrash renders)
   driven by an IntersectionObserver over [data-ember] sections: void -> mesh warm
   -> rupture blood-red flash -> release settle. z-[0], canvas sits UNDER the
   particle scene (z-[1]) and behind all copy (z-10+). */

import { useEffect, useState } from "react";
import { NeuroNoise } from "@paper-design/shaders-react";

type Stage = "void" | "mesh" | "rupture" | "release";

const THEME: Record<Stage, { colorBack: string; colorMid: string; colorFront: string; brightness: number; contrast: number; speed: number }> = {
  void:    { colorBack: "#0A0908", colorMid: "#1a0e08", colorFront: "#3a1a0d", brightness: 0.25, contrast: 0.55, speed: 0.35 },
  mesh:    { colorBack: "#0A0908", colorMid: "#5c2510", colorFront: "#FF5A1F", brightness: 0.55, contrast: 0.7, speed: 0.6 },
  rupture: { colorBack: "#140302", colorMid: "#8a1206", colorFront: "#FF2E1F", brightness: 0.9, contrast: 0.85, speed: 1.4 },
  release: { colorBack: "#0A0908", colorMid: "#4a2210", colorFront: "#FF8A4C", brightness: 0.45, contrast: 0.6, speed: 0.4 },
};

export default function NeuralEmberField() {
  const [stage, setStage] = useState<Stage>("void");
  // lazy-init from a real synchronous read on first client render (this component
  // is dynamic-imported with ssr:false, so window exists here) — a useRef gate
  // set inside useEffect does NOT trigger a re-render, so the shader kept animating
  // under prefers-reduced-motion (caught in QA screenshot: reduced === normal).
  const [reduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (typeof window === "undefined" || reduced) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-ember-stage]"));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        // pick the most-visible intersecting section as the current stage
        let best: { ratio: number; stage: Stage } | null = null;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const s = e.target.getAttribute("data-ember-stage") as Stage | null;
          if (!s) continue;
          if (!best || e.intersectionRatio > best.ratio) best = { ratio: e.intersectionRatio, stage: s };
        }
        if (best) setStage(best.stage);
      },
      { threshold: [0.15, 0.4, 0.6, 0.85] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [reduced]);

  if (reduced) return null;

  const t = THEME[stage];
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-90" style={{ contain: "strict" }}>
      <NeuroNoise
        style={{ width: "100%", height: "100%", transition: "opacity 900ms ease" }}
        colorBack={t.colorBack}
        colorMid={t.colorMid}
        colorFront={t.colorFront}
        brightness={t.brightness}
        contrast={t.contrast}
        speed={t.speed}
      />
    </div>
  );
}
