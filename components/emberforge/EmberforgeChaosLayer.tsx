"use client";

import { forwardRef } from "react";
import { Warp } from "@paper-design/shaders-react";

/* The chaos layer — a real production shader (paper-design's Warp: noise-warped color
   fields with swirl/distortion), tinted to the ember palette, sitting behind/blended with
   the 3D ember-instance field during the DUST phase. Opacity is driven imperatively by the
   scroll progress callback in page.tsx (via the forwarded ref) — no re-render per frame. */
const EmberforgeChaosLayer = forwardRef<HTMLDivElement>(function EmberforgeChaosLayer(_props, ref) {
  return (
    <div ref={ref} className="emberforge-chaos" aria-hidden="true">
      <Warp
        style={{ width: "100%", height: "100%" }}
        colors={["#0A0908", "#FF5A1F", "#FF8A4C"]}
        proportion={0.32}
        softness={0.9}
        shape="edge"
        shapeScale={0.35}
        distortion={0.55}
        swirl={0.85}
        swirlIterations={8}
        speed={0.55}
      />
      <style jsx>{`
        .emberforge-chaos {
          position: fixed;
          inset: 0;
          z-index: 1;
          mix-blend-mode: screen;
          pointer-events: none;
          will-change: opacity;
        }
      `}</style>
    </div>
  );
});

export default EmberforgeChaosLayer;
