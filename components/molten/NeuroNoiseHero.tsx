"use client";

import { NeuroNoise } from "@paper-design/shaders-react";

/* Ember neuro-noise field behind the hero.
   Uses the Paper Shaders NeuroNoise primitive directly — the same shader the
   21st.dev "Neuro Noise" component is adapted from, but the library build
   rather than a hand-port (the port compiled and mounted but drew a fully
   transparent buffer: readPixels came back [0,0,0,0] even forced to z-9999).
   Palette is molten: ember highlight #FF8A4C over #FF5A1F filaments on #0A0908. */

const COLOR_FRONT = "#FF8A4C";
const COLOR_MID = "#FF5A1F";
const COLOR_BACK = "#0A0908";

export function NeuroNoiseHero({ className }: { className?: string }) {
  return (
    <NeuroNoise
      className={className}
      style={{ width: "100%", height: "100%", pointerEvents: "none", opacity: 0.6 }}
      colorFront={COLOR_FRONT}
      colorMid={COLOR_MID}
      colorBack={COLOR_BACK}
      // Dark-dominant on purpose: at brightness 0.85 the field inverted, flooding
      // the hero with light ember and destroying headline legibility.
      brightness={0.22}
      contrast={0.9}
      scale={0.42}
      speed={0.4}
    />
  );
}

export default NeuroNoiseHero;
