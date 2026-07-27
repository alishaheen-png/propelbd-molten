"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* PropelBD — THE FORGE.
   One GPU particle organism living on a fixed canvas behind the page. Raw scattered
   material at the top, a running engine at the bottom. Scroll forges it through ten
   pre-baked formations (Lusion doctrine: bake targets offline, blend at runtime):

     0 dust        (hero — cold ember dust, breathing)
     1 scatter     (problem — entropy, order almost forms, never holds)
     2 reticle     (engine beat 1 — targeting)
     3 funnel      (engine beat 2 — lead-gen)
     4 arcs        (engine beat 3 — outreach, some arcs return brighter)
     5 orbit       (engine beat 4 — sales, captured ring)
     6 core        (engine beat 5 — backend, the running engine)
     7 split       (why us — ash haze sinking vs bright filament rising)
     8 constellation (proof — 321 hero particles flare white-hot)
     9 vortex      (CTA — molten ring around the close)

   Formations live in one RGBA float DataTexture (xyz position, w brightness;
   w < 0 marks the ash population). The vertex shader texelFetches two formations
   and blends by uPhase. Text is sacred airspace: up to 3 screen-space repulsor
   rects bend particles around the measure. Heat is the narrative variable —
   full white-hot is spent only on Proof and Ignition.

   Static-export safe (no window at module scope). Reduced-motion / no-WebGL:
   renders nothing — the CSS atmosphere fallback stays. DPR clamp 1.5, visibility
   pause, context-loss handling, full dispose. Draw calls: 2 (FBM field + points). */

const FORMATIONS = 10;

const VERT = /* glsl */ `
  in float aIndex;
  in float aSeed;
  in float aSize;

  uniform sampler2D uForm;      // formations: width TEXW, ROWS rows per formation
  uniform float uTexW;
  uniform float uRows;
  uniform float uPhase;         // 0..9 across the page
  uniform float uTime;
  uniform float uTurb;          // scroll-velocity turbulence 0..1
  uniform float uPixelRatio;
  uniform vec2  uMouse;         // world xy
  uniform float uMouseForce;
  uniform float uIgnite;        // hero entrance 0..1
  uniform float uCtaHeat;       // CTA hover 0..1
  uniform float uPerf;          // adaptive throttle 0.55..1
  uniform float uShiftX;        // formation x-offset so machines live right of the text
  uniform vec4  uRepel[3];      // NDC rects: xy=center, zw=half-extents

  out float vHeat;
  out float vAsh;
  out float vPulse;

  vec4 formation(float f, float idx) {
    float x = mod(idx, uTexW);
    float y = floor(idx / uTexW) + f * uRows;
    return texelFetch(uForm, ivec2(int(x), int(y)), 0);
  }

  vec3 drift(vec3 p, float t) {
    return vec3(
      sin(p.y * 1.7 + t)       * cos(p.z * 1.3 + t * 0.8),
      sin(p.z * 1.5 + t * 1.1) * cos(p.x * 1.1 + t * 0.9),
      sin(p.x * 1.3 + t * 0.7) * cos(p.y * 1.9 + t)
    );
  }

  float hash(float n) { return fract(sin(n) * 43758.5453123); }

  void main() {
    float f0 = clamp(floor(uPhase), 0.0, 8.0);
    float f1 = f0 + 1.0;
    float blend = smoothstep(0.0, 1.0, uPhase - f0);

    vec4 A = formation(f0, aIndex);
    vec4 B = formation(f1, aIndex);
    vec3 pos = mix(A.xyz, B.xyz, blend);
    float w = mix(A.w, B.w, blend);
    vAsh = 1.0 - smoothstep(-0.2, 0.0, w);      // negative w = ash population
    float bright = abs(w);

    // chapter-aware behaviours -------------------------------------------
    float inDust    = 1.0 - smoothstep(0.0, 1.0, uPhase);
    float inScatter = smoothstep(0.2, 1.0, uPhase) * (1.0 - smoothstep(1.0, 2.0, uPhase));
    float inSplit   = smoothstep(6.2, 7.0, uPhase) * (1.0 - smoothstep(7.0, 8.0, uPhase));
    float inVortex  = smoothstep(8.4, 9.0, uPhase);   // CTA now starts at 8.4 (FAQ owns 8.2-8.4)

    // organic drift — violent in scatter + scroll turbulence, calm in formations.
    // scatter amp raised + a second de-phased octave so between-slide states stay
    // haphazard and never settle into an outline of the next block (Ali).
    float amp = 0.08 + inDust * 0.14 + inScatter * 0.72 + uTurb * 0.55;
    pos += drift(pos * 0.9 + aSeed * 6.2831, uTime * (0.16 + inScatter * 0.42 + uTurb * 0.4)) * amp;
    pos += drift(pos * 1.7 + aSeed * 11.3, uTime * (0.31 + inScatter * 0.5)) * (inScatter * 0.34 + uTurb * 0.18);

    // scatter chaos: NO synchronized gather (that read as an order-forming shape).
    // per-particle phase = pure entropy, tiny push only, never a clean contraction.
    float saw = fract(uTime * 0.09 + hash(aSeed * 91.7) * 1.0);
    float gather = smoothstep(0.0, 0.6, saw) * (1.0 - smoothstep(0.6, 1.0, saw));
    pos += (hash(aSeed * 5.1) - 0.5) * gather * inScatter * 0.5;

    // split: ash sinks, the filament rises
    float dir = mix(1.0, -1.0, vAsh);
    pos.y += dir * inSplit * (sin(uTime * 0.4 + aSeed * 12.0) * 0.18 + 0.12);

    // slow rotation where the formation is a machine part
    float spin = (smoothstep(1.6, 2.0, uPhase) * (1.0 - smoothstep(6.4, 7.0, uPhase))) + inVortex;
    float rot = uTime * 0.08 * spin + inDust * uTime * 0.015;
    float cr = cos(rot); float sr = sin(rot);
    pos.xz = mat2(cr, -sr, sr, cr) * pos.xz;

    // the machine formations dock right of the text column
    float engineWin = smoothstep(1.6, 2.1, uPhase) * (1.0 - smoothstep(5.9, 6.5, uPhase));
    float constWin  = smoothstep(7.3, 7.9, uPhase) * (1.0 - smoothstep(7.95, 8.15, uPhase));   // fully home before FAQ (8.2)
    pos.x += (engineWin + constWin) * uShiftX;

    // mouse: molten repulsion
    vec2 toM = pos.xy - uMouse;
    float md = length(toM);
    float push = (1.0 - smoothstep(0.0, 1.5, md)) * uMouseForce;
    pos.xy += normalize(toM + 0.0001) * push * 0.5;

    // hero ignition surge
    pos *= 0.62 + 0.38 * uIgnite;

    // CTA hover: the ring leans in and heats up
    pos *= 1.0 - uCtaHeat * inVortex * 0.06;

    // lattice/engine signal pulses
    float node = floor(aSeed * 2048.0);
    float phase = fract(hash(node) + uTime * 0.12);
    float inEngine = smoothstep(1.8, 2.2, uPhase) * (1.0 - smoothstep(6.6, 7.2, uPhase));
    vPulse = smoothstep(0.0, 0.05, phase) * (1.0 - smoothstep(0.05, 0.2, phase)) * inEngine;

    float flicker = 0.82 + 0.18 * sin(uTime * (1.4 + hash(aSeed) * 2.6) + aSeed * 40.0);
    vHeat = clamp(bright * flicker + push * 0.7 + uCtaHeat * inVortex * 0.5, 0.0, 3.0);

    // cooling transit: the engine dims while it dissolves toward the split
    // (heat = meaning; also keeps mid-morph glare off the Why text)
    float transit = smoothstep(6.05, 6.5, uPhase) * (1.0 - smoothstep(6.5, 6.95, uPhase));
    vHeat *= 1.0 - 0.55 * transit;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vec4 clip = projectionMatrix * mv;

    // TEXT IS SACRED AIRSPACE — bend particles out of the measure (NDC rects).
    // clip.w guard: never touch particles at/behind the camera plane.
    if (clip.w > 0.0) {
      vec2 ndc = clip.xy / clip.w;
      for (int i = 0; i < 3; i++) {
        vec2 d = abs(ndc - uRepel[i].xy) / max(uRepel[i].zw, vec2(0.0001));
        float inside = 1.0 - smoothstep(0.8, 1.15, max(d.x, d.y));
        vec2 away = normalize(ndc - uRepel[i].xy + 0.0001);
        ndc += away * inside * 0.24 * step(0.011, uRepel[i].z);   // z>0 only when rect active
      }
      clip.xy = ndc * clip.w;
    }
    gl_Position = clip;

    // fake DOF: distance dims, never balloons (big blurred points read as blobs)
    float focus = smoothstep(3.0, 9.5, -mv.z);
    gl_PointSize = aSize * uPixelRatio * uPerf * (1.0 + vPulse * 2.4 + push * 1.4 + uIgnite * 0.15)
                   * (5.4 / -mv.z) * (1.0 + focus * 0.4);
    vHeat *= 1.0 - focus * 0.5;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uCool;   // deep ember
  uniform vec3 uMid;    // brand orange
  uniform vec3 uHot;    // white-hot
  in float vHeat;
  in float vAsh;
  in float vPulse;
  out vec4 fragColor;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    // sharp dart: hard bright core, short falloff — no soft bokeh halo
    float alpha = 1.0 - smoothstep(0.04, 0.34, d);
    float core  = 1.0 - smoothstep(0.0, 0.13, d);
    float heat = clamp(vHeat, 0.0, 1.0);
    vec3 ember = mix(uCool, uMid, smoothstep(0.12, 0.7, heat));
    ember = mix(ember, uHot, core * min(vHeat * 0.55, 1.2) + vPulse);
    vec3 ash = vec3(0.29, 0.275, 0.25) * (0.4 + heat * 0.4);
    vec3 col = mix(ember, ash, vAsh);
    float a = alpha * (0.4 + heat * 0.6 + vPulse) * (1.0 - vAsh * 0.55);
    if (a < 0.012) discard;
    fragColor = vec4(col, a);
  }
`;

/* dim molten depth-field behind the particles — 3-octave warped FBM, near-black */
const FIELD_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  uniform vec2  uRes;
  uniform vec2  uMouseUV;
  uniform float uHeat;

  float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vnoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash21(i), hash21(i + vec2(1, 0)), u.x),
               mix(hash21(i + vec2(0, 1)), hash21(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * vnoise(p); p = p * 2.03 + 17.0; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uRes;
    float asp = uRes.x / uRes.y;
    vec2 p = uv * vec2(asp, 1.0) * 2.2;
    float t = uTime * 0.028;

    // double domain-warp: the flow itself flows
    vec2 w1 = vec2(fbm(p + t), fbm(p - t * 0.7));
    vec2 w2 = vec2(fbm(p + w1 * 1.6 - t * 0.4), fbm(p + w1 * 1.6 + t * 0.55));
    float m = fbm(p + w2 * 1.8 + vec2(0.0, uPhase * 0.22));
    float glow = smoothstep(0.48, 0.95, m);

    // molten veins: ridged inversion of the warped field — thin drifting cracks.
    // Windowed to ignition (hero) and close (CTA) so mid-story stays calm airspace.
    float ridge = 1.0 - abs(2.0 * fbm(p * 1.35 + w2 * 2.1 - t * 0.5) - 1.0);
    float veinWin = max(1.0 - smoothstep(0.4, 1.6, uPhase), smoothstep(7.9, 8.8, uPhase));
    float vein = pow(smoothstep(0.86, 0.995, ridge), 3.0) * veinWin;

    // cursor heat bloom: the field warms under the hand (uMouseUV parks at 99,99
    // on coarse pointers so this term is zero on touch devices)
    vec2 md = (uv - uMouseUV) * vec2(asp, 1.0);
    float mheat = exp(-dot(md, md) * 18.0) * (0.5 + 0.5 * uHeat);

    // heat follows the story: dim through problem, warm at the engine, hot at the close
    float heat = 0.35 + 0.65 * smoothstep(2.0, 9.0, uPhase);
    vec3 ember = mix(vec3(0.045, 0.012, 0.005), vec3(0.30, 0.095, 0.028), glow) * heat;
    ember += vec3(1.0, 0.36, 0.11) * vein * 0.16;
    ember += vec3(0.42, 0.13, 0.04) * mheat * heat;

    // shader-side animated grain: de-bands the deep gradient, reads as film
    float g = (hash21(uv * uRes + fract(uTime) * 61.7) - 0.5) * 0.012;

    float vig = 1.0 - smoothstep(0.35, 1.3, length(uv - 0.5) * 2.0);
    gl_FragColor = vec4(ember * vig + g, 1.0);
  }
`;

const FIELD_VERT = /* glsl */ `
  void main() { gl_Position = vec4(position, 1.0); }
`;

/* ---------------- formation bakery (runs once at mount) ---------------- */

function bakeFormations(count: number, texW: number, rows: number) {
  const data = new Float32Array(texW * rows * FORMATIONS * 4);
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) * 0.8;
  const set = (f: number, i: number, x: number, y: number, z: number, w: number) => {
    const o = (f * texW * rows + i) * 4;
    data[o] = x; data[o + 1] = y; data[o + 2] = z; data[o + 3] = w;
  };


  for (let i = 0; i < count; i++) {
    const r01 = Math.random();

    // 0 DUST — cold ember dust, deep-Z spread
    set(0, i, gauss() * 5.6, gauss() * 3.2, gauss() * 3.4 - 0.6,
      Math.random() < 0.16 ? 0.7 + Math.random() * 0.45 : 0.12 + Math.pow(Math.random(), 3) * 0.26);

    // 1 SCATTER — entropy peak, mostly ash with dying embers
    set(1, i, gauss() * 6.4, gauss() * 4.0, gauss() * 3.2 - 0.6,
      Math.random() < 0.68 ? -(0.15 + Math.random() * 0.2) : 0.2 + Math.random() * 0.25);

    // 2 TARGETING — directional convergence, NOT a disc. Wide drift on the left
    // condensing rightward into one bright focal point. (The old cos/sin version
    // still baked an ellipse despite the comment — this actually kills the shape.)
    {
      const t = Math.pow(Math.random(), 1.7);           // 0 far drift → 1 at focus
      const x = -3.4 * (1 - t) + gauss() * (0.3 + (1 - t) * 0.7);
      const y = gauss() * (0.35 + (1 - t) * 1.9);       // tall spread far, tight at focus
      set(2, i, x, y, gauss() * 0.4 - 0.2, 0.15 + t * 1.1);
    }

    // 3 FUNNEL — lead-gen: wide top rain condensing into a hairline stream.
    // LINEAR taper (no cos/sin, no spiral) — the radial version read as a circle.
    // x-spread shrinks with fall depth so many drops narrow into one bright thread.
    {
      const t = Math.random();                       // 0 top → 1 bottom
      const y = 2.6 - t * 5.0;
      const spread = (1 - Math.pow(t, 0.7)) * 2.6 + 0.04;  // wide up top, hairline at base
      const x = (Math.random() - 0.5) * 2 * spread;
      set(3, i, x, y, gauss() * 0.22 - 0.3, 0.18 + t * 0.85);
    }

    // 4 ARCS — outreach: horizontal message beams firing RIGHTWARD, a third
    // returning hotter (replies). DIRECTIONAL lanes (no radial base angle) —
    // the 9-arc version read as a flower. Banded y-lanes = separate threads.
    {
      const lane = Math.floor(Math.random() * 9);
      const ret = lane % 3 === 0;                    // a third are replies
      const t = Math.random();                       // 0 origin → 1 far reach
      const laneY = (lane / 8 - 0.5) * 3.2 + gauss() * 0.12;
      const x = -0.6 + t * (2.6 + (lane % 4) * 0.3);
      const droop = -Math.sin(t * Math.PI) * 0.35;   // subtle ballistic sag, not an orbit
      set(4, i, x, laneY + droop, gauss() * 0.1 - 0.3,
        (ret ? 1.15 : 0.4) * (0.5 + t * 0.7));
    }

    // 5 ORBIT — sales: elliptic orbits tightening, captured inner ring
    {
      // capture: prospects pulled into a tight bright column, strays still inbound (no rings)
      if (r01 < 0.55) {
        const t = Math.random();
        set(5, i, gauss() * 0.22, (t - 0.5) * 4.6, gauss() * 0.2 - 0.25, 0.8 + t * 0.5);
      } else {
        const side = Math.random() < 0.5 ? -1 : 1;
        const d = 0.6 + Math.pow(Math.random(), 1.5) * 3.4;
        set(5, i, side * d, gauss() * 2.4, gauss() * 0.3 - 0.25, 0.5 - d * 0.09);
      }
    }

    // 6 CORE — backend: the gyroscope. Bright nucleus + 3 orthogonal hairline
    // rings on different planes (council-gated: precision machine, zero
    // organic read; spokes dropped — their wedges echoed the flower).
    {
      // the running engine: dense rectangular lattice slab + hot core seam (zero circular geometry)
      if (r01 < 0.72) {
        const gx = Math.floor(Math.random() * 26), gy = Math.floor(Math.random() * 14), gz = Math.floor(Math.random() * 3);
        const x = (gx / 25 - 0.5) * 4.4 + gauss() * 0.02;
        const y = (gy / 13 - 0.5) * 2.6 + gauss() * 0.02;
        const z = (gz - 1) * 0.5 + gauss() * 0.02 - 0.2;
        const seam = Math.abs(gy / 13 - 0.5) < 0.09 ? 0.7 : 0;
        set(6, i, x, y, z, 0.55 + seam + Math.random() * 0.25);
      } else {
        set(6, i, gauss() * 3.4, gauss() * 2.0, gauss() * 0.5 - 0.3, 0.1 + Math.random() * 0.12);
      }
    }

    // 7 SPLIT — ash haze sinking left, bright filament rising right
    {
      if (r01 < 0.58) {
        set(7, i, -2.6 + gauss() * 1.7, gauss() * 2.6, gauss() * 1.6 - 0.5, -(0.12 + Math.random() * 0.22));
      } else {
        const t = Math.random();
        set(7, i, 2.5 + Math.cos(t * 40.0) * 0.16 + gauss() * 0.09, (t - 0.5) * 6.4, gauss() * 0.3 - 0.2, 0.9 + t * 0.8);
      }
    }

    // 8 CONSTELLATION — 321 hero particles flare white-hot in a neat grid
    {
      if (i < 321) {
        const col = i % 24, row = Math.floor(i / 24);
        set(8, i, (col - 11.5) * 0.34 + gauss() * 0.015, (row - 6.5) * 0.42 + gauss() * 0.015, 0.4, 3.0);
      } else {
        // ambient scatter — rectangular field, not a disc halo around the grid
        set(8, i, (Math.random() - 0.5) * 12.0, (Math.random() - 0.5) * 8.0,
          gauss() * 1.4 - 1.2, 0.05 + Math.random() * 0.06);
      }
    }

    // 9 CLOSE — the deal closes: a bright vertical molten seam (the site's spine
    // continued) with strays converging into it. NO ring/torus — the vortex
    // version was a literal circle, the #1 shape Ali flagged.
    {
      if (r01 < 0.72) {
        const y = (Math.random() - 0.5) * 6.2;
        const thick = gauss() * (0.16 + Math.pow(Math.random(), 2) * 0.22);
        set(9, i, 0.8 + thick, y, gauss() * 0.28 - 0.2, 0.9 + Math.random() * 0.6);
      } else {
        // strays still inbound from the left, being pulled to the seam
        const t = Math.random();
        set(9, i, 0.8 - (1 - t) * 3.6 + gauss() * 0.3, gauss() * 2.8,
          gauss() * 0.4 - 0.2, 0.3 + t * 0.35);
      }
    }
  }
  return data;
}

/* ---------------- component ---------------- */

export default function MoltenOrganism() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mount.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = mount.current;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL — CSS atmosphere fallback remains
    }

    // hard gate: the whole design rides on vertex texture fetch
    if (renderer.capabilities.maxVertexTextures < 1) {
      renderer.dispose();
      return; // CSS atmosphere fallback remains
    }

    gsap.registerPlugin(ScrollTrigger);

    const isCoarse = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    const COUNT = isCoarse ? 26000 : 82000;   // denser field (Ali: "feels like they're less")
    const TEXW = 512;
    const ROWS = Math.ceil(COUNT / TEXW);
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 60);
    camera.position.set(0, 0, 7.2);

    // formations texture — HALF float: universally samplable in vertex shaders
    // (iOS/Metal + Mali/Adreno), half the VRAM; ~0.002 world-unit precision is
    // far below one particle's visual size
    const baked = bakeFormations(COUNT, TEXW, ROWS);
    const half = new Uint16Array(baked.length);
    for (let i = 0; i < baked.length; i++) half[i] = THREE.DataUtils.toHalfFloat(baked[i]);
    const formTex = new THREE.DataTexture(
      half, TEXW, ROWS * FORMATIONS,
      THREE.RGBAFormat, THREE.HalfFloatType
    );
    formTex.needsUpdate = true;
    formTex.generateMipmaps = false;
    formTex.minFilter = THREE.NearestFilter;
    formTex.magFilter = THREE.NearestFilter;

    const idx = new Float32Array(COUNT);
    const seeds = new Float32Array(COUNT);
    const sizes = new Float32Array(COUNT);
    const zero = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      idx[i] = i;
      seeds[i] = Math.random();
      // fine darts, not bokeh blobs: tight size range, rare medium sparks
      sizes[i] = 0.45 + Math.pow(Math.random(), 3.2) * 1.35;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(zero, 3));
    geo.setAttribute("aIndex", new THREE.BufferAttribute(idx, 1));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const uniforms = {
      uForm: { value: formTex },
      uTexW: { value: TEXW },
      uRows: { value: ROWS },
      uPhase: { value: 0 },
      uTime: { value: 0 },
      uTurb: { value: 0 },
      uPixelRatio: { value: dpr },
      uMouse: { value: new THREE.Vector2(99, 99) },
      uMouseForce: { value: 0 },
      uIgnite: { value: 0 },
      uCtaHeat: { value: 0 },
      uPerf: { value: 1 },
      uShiftX: { value: isCoarse ? 0 : 1.9 },
      uRepel: { value: [new THREE.Vector4(0, 0, 0, 0), new THREE.Vector4(0, 0, 0, 0), new THREE.Vector4(0, 0, 0, 0)] },
      uCool: { value: new THREE.Color("#621307") },
      uMid: { value: new THREE.Color("#FF5A1F") },
      uHot: { value: new THREE.Color("#FF9B5E") }, // hot orange — no gold/yellow drift
    };

    const mat = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    scene.add(points);

    // molten depth-field
    const fieldUniforms = {
      uTime: uniforms.uTime,
      uPhase: uniforms.uPhase,
      uRes: { value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr) },
      uMouseUV: { value: new THREE.Vector2(99, 99) },  // offscreen until first pointer move
      uHeat: uniforms.uCtaHeat,                        // CTA hover feeds the field bloom too
    };
    const fieldGeo = new THREE.BufferGeometry();
    fieldGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
    const fieldMat = new THREE.ShaderMaterial({
      vertexShader: FIELD_VERT, fragmentShader: FIELD_FRAG,
      uniforms: fieldUniforms, depthWrite: false, depthTest: false,
    });
    const field = new THREE.Mesh(fieldGeo, fieldMat);
    field.frustumCulled = false;
    field.renderOrder = -1;
    scene.add(field);

    /* ---- scroll → phase: one trigger per forged chapter ---- */
    // sections declare data-forge="<startPhase>:<endPhase>"
    const triggers: ScrollTrigger[] = [];
    const wire = () => {
      const secs = Array.from(document.querySelectorAll<HTMLElement>("[data-forge]"));
      const docH = document.documentElement.scrollHeight;
      const vh = window.innerHeight;
      secs.forEach((sec, i) => {
        const [a, b] = (sec.dataset.forge || "0:0").split(":").map(Number);
        // first chapter starts at load; a chapter ending at the page floor must
        // reach progress 1 at max scroll or its phase is never finished
        const isFirst = i === 0;
        const atFloor = sec.offsetTop + sec.offsetHeight >= docH - vh * 0.5;
        triggers.push(
          ScrollTrigger.create({
            trigger: sec,
            start: isFirst ? "top top" : "top bottom",
            end: atFloor ? "bottom bottom" : "bottom top",
            scrub: 0.7,
            onUpdate: (self) => {
              uniforms.uPhase.value = a + (b - a) * self.progress;
            },
          })
        );
      });
    };
    // wire after the page's own triggers exist (child effect runs before parent's,
    // so wait two frames for Landing's layout, then re-sync when fonts settle)
    let wireRaf = 0;
    wireRaf = requestAnimationFrame(() => {
      wireRaf = requestAnimationFrame(() => { wire(); ScrollTrigger.refresh(); });
    });
    document.fonts?.ready.then(() => { refreshRepelCache(); ScrollTrigger.refresh(); });

    // hero ignition surge
    gsap.to(uniforms.uIgnite, { value: 1, duration: 2.6, ease: "power3.out", delay: 0.15 });

    /* ---- scroll velocity → turbulence ---- */
    let lastScroll = window.scrollY;

    /* ---- mouse ---- */
    const mouseTarget = new THREE.Vector2(99, 99);
    const mouseUVTarget = new THREE.Vector2(99, 99);
    let lastX = 0, lastY = 0, vel = 0;
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      const worldH = Math.tan((50 * Math.PI) / 360) * 7.2 * 2;
      const worldW = worldH * (window.innerWidth / window.innerHeight);
      mouseTarget.set((nx * worldW) / 2, (ny * worldH) / 2);
      mouseUVTarget.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
      vel = Math.min(1, vel + Math.hypot(e.clientX - lastX, e.clientY - lastY) * 0.0045);
      lastX = e.clientX; lastY = e.clientY;
    };
    if (!isCoarse) window.addEventListener("pointermove", onMove, { passive: true });

    /* ---- CTA heat ---- */
    const ctaBtn = document.querySelector<HTMLElement>("[data-cta-heat]");
    const heatIn = () => gsap.to(uniforms.uCtaHeat, { value: 1, duration: 0.7, ease: "power2.out" });
    const heatOut = () => gsap.to(uniforms.uCtaHeat, { value: 0, duration: 1.1, ease: "power2.out" });
    ctaBtn?.addEventListener("mouseenter", heatIn);
    ctaBtn?.addEventListener("mouseleave", heatOut);

    /* ---- text repulsor rects (sacred airspace) ---- */
    const repelEls = () => Array.from(document.querySelectorAll<HTMLElement>("[data-repel]"));
    let repelCache: HTMLElement[] = [];
    const refreshRepelCache = () => { repelCache = repelEls(); };
    refreshRepelCache();
    const updateRepel = () => {
      let slot = 0;
      const vw = window.innerWidth, vh = window.innerHeight;
      for (const elR of repelCache) {
        if (slot >= 3) break;
        const r = elR.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        const v = uniforms.uRepel.value[slot];
        v.set(
          ((r.left + r.right) / 2 / vw) * 2 - 1,
          -(((r.top + r.bottom) / 2 / vh) * 2 - 1),
          Math.max((r.width / vw), 0.01),
          Math.max((r.height / vh), 0.01)
        );
        slot++;
      }
      for (; slot < 3; slot++) uniforms.uRepel.value[slot].set(0, 0, 0, 0);
    };

    /* ---- loop / lifecycle ---- */
    let raf = 0;
    let running = true;
    let contextLost = false;
    let frame = 0;
    let lastFrameAt = 0;
    let badFrames = 0;

    const tick = () => {
      if (!running || contextLost) return;

      // manual timer: clamped delta accumulation (no jump after tab switch,
      // no THREE.Clock deprecation)
      const now = performance.now();
      if (lastFrameAt > 0) {
        const dt = now - lastFrameAt;
        uniforms.uTime.value += Math.min(dt, 50) / 1000;

        // adaptive throttle: sustained >22ms frames shrink point size (overdraw is the cost)
        if (dt > 22) badFrames++;
        else badFrames = Math.max(0, badFrames - 1);
        if (badFrames > 30 && uniforms.uPerf.value > 0.55) {
          uniforms.uPerf.value *= 0.95;
          badFrames = 15;
        } else if (badFrames === 0 && uniforms.uPerf.value < 1) {
          // recover slowly once the GPU breathes again
          uniforms.uPerf.value = Math.min(1, uniforms.uPerf.value + 0.002);
        }
      }
      lastFrameAt = now;

      // turbulence from scroll velocity, decays 0.92/frame
      const sy = window.scrollY;
      uniforms.uTurb.value = Math.min(1, uniforms.uTurb.value * 0.92 + Math.abs(sy - lastScroll) * 0.0016);
      lastScroll = sy;

      uniforms.uMouse.value.lerp(mouseTarget, 0.08);
      fieldUniforms.uMouseUV.value.lerp(mouseUVTarget, 0.06);
      vel *= 0.94;
      uniforms.uMouseForce.value += (vel - uniforms.uMouseForce.value) * 0.1;

      if ((frame++ & 3) === 0) updateRepel(); // layout read throttled to every 4th frame

      // one continuous camera take: slow dolly + breathe, phase-aware drift
      const p = uniforms.uPhase.value;
      camera.position.z = 7.2 - Math.min(p, 2) * 0.35 + Math.sin(uniforms.uTime.value * 0.11) * 0.1;
      camera.position.x = Math.sin(p * 0.7) * 0.35 + uniforms.uMouse.value.x * 0.02;
      camera.position.y = Math.cos(p * 0.5) * 0.2 + uniforms.uMouse.value.y * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVis = () => {
      running = document.visibilityState === "visible";
      if (running && !contextLost) { lastFrameAt = 0; raf = requestAnimationFrame(tick); }
      else cancelAnimationFrame(raf);
    };
    document.addEventListener("visibilitychange", onVis);

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer.setPixelRatio(dpr);
      uniforms.uPixelRatio.value = dpr;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      fieldUniforms.uRes.value.set(window.innerWidth * dpr, window.innerHeight * dpr);
      refreshRepelCache();
    };
    window.addEventListener("resize", onResize);

    const canvas = renderer.domElement;
    const onLost = (e: Event) => { e.preventDefault(); contextLost = true; cancelAnimationFrame(raf); };
    const onRestored = () => { contextLost = false; raf = requestAnimationFrame(tick); };
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(wireRaf);
      triggers.forEach((t) => t.kill());
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      if (!isCoarse) window.removeEventListener("pointermove", onMove);
      ctaBtn?.removeEventListener("mouseenter", heatIn);
      ctaBtn?.removeEventListener("mouseleave", heatOut);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      geo.dispose(); mat.dispose(); fieldGeo.dispose(); fieldMat.dispose(); formTex.dispose();
      renderer.dispose();
      if (canvas.parentElement === el) el.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={mount}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ contain: "strict" }}
    />
  );
}
