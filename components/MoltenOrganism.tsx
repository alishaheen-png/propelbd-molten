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

    // organic drift — violent in scatter + scroll turbulence, calm in formations
    float amp = 0.06 + inDust * 0.10 + inScatter * 0.42 + uTurb * 0.5;
    pos += drift(pos * 0.9 + aSeed * 6.2831, uTime * (0.16 + inScatter * 0.3 + uTurb * 0.4)) * amp;

    // scatter: order almost forms, then bursts (slow gather, fast release)
    float saw = fract(uTime * 0.11 + aSeed * 0.13);
    float gather = smoothstep(0.0, 0.75, saw) * (1.0 - smoothstep(0.75, 1.0, saw));
    pos *= 1.0 - 0.16 * gather * inScatter;

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

  float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vnoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash21(i), hash21(i + vec2(1, 0)), u.x),
               mix(hash21(i + vec2(0, 1)), hash21(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 3; i++) { v += a * vnoise(p); p = p * 2.03 + 17.0; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uRes;
    vec2 p = uv * vec2(uRes.x / uRes.y, 1.0) * 2.2;
    float t = uTime * 0.028;
    vec2 w = vec2(fbm(p + t), fbm(p - t * 0.7));
    float m = fbm(p + w * 1.8 + vec2(0.0, uPhase * 0.22));
    float glow = smoothstep(0.48, 0.95, m);
    // heat follows the story: dim through problem, warm at the engine, hot at the close
    float heat = 0.35 + 0.65 * smoothstep(2.0, 9.0, uPhase);
    vec3 ember = mix(vec3(0.045, 0.012, 0.005), vec3(0.30, 0.095, 0.028), glow) * heat;
    float vig = 1.0 - smoothstep(0.35, 1.3, length(uv - 0.5) * 2.0);
    gl_FragColor = vec4(ember * vig, 1.0);
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

  const TAU = Math.PI * 2;

  for (let i = 0; i < count; i++) {
    const r01 = Math.random();

    // 0 DUST — cold ember dust, deep-Z spread
    set(0, i, gauss() * 5.6, gauss() * 3.2, gauss() * 3.4 - 0.6,
      Math.random() < 0.1 ? 0.55 + Math.random() * 0.4 : 0.06 + Math.pow(Math.random(), 3) * 0.18);

    // 1 SCATTER — entropy peak, mostly ash with dying embers
    set(1, i, gauss() * 6.4, gauss() * 4.0, gauss() * 3.2 - 0.6,
      Math.random() < 0.68 ? -(0.15 + Math.random() * 0.2) : 0.2 + Math.random() * 0.25);

    // 2 RETICLE — targeting: two hairline rings + crosshair + 24 tick marks
    {
      const pick = r01;
      let x = 0, y = 0, z = 0, w = 0.5;
      if (pick < 0.34) { const a = Math.random() * TAU; const rr = 2.1 + gauss() * 0.02; x = Math.cos(a) * rr; y = Math.sin(a) * rr; z = gauss() * 0.03; w = 0.9; }
      else if (pick < 0.55) { const a = Math.random() * TAU; const rr = 3.0 + gauss() * 0.02; x = Math.cos(a) * rr; y = Math.sin(a) * rr; z = gauss() * 0.03; w = 0.45; }
      else if (pick < 0.75) { const s = Math.floor(Math.random() * 4); const t = 0.25 + Math.random() * 2.7; const a = (s / 4) * TAU + Math.PI / 4; x = Math.cos(a) * t; y = Math.sin(a) * t; z = gauss() * 0.03; w = 0.6; }
      else if (pick < 0.92) { const s = Math.floor(Math.random() * 24); const a = (s / 24) * TAU; const t = 3.0 + Math.random() * 0.22; x = Math.cos(a) * t; y = Math.sin(a) * t; z = gauss() * 0.02; w = 0.75; }
      else { x = (Math.random() - 0.5) * 7.5; y = (Math.random() - 0.5) * 4.6; z = gauss() * 0.4 - 0.4; w = 0.12; }
      set(2, i, x, y, z - 0.2, w);
    }

    // 3 FUNNEL — lead-gen: spiral rain tightening into a hairline stream
    {
      const t = Math.random();
      const y = 2.6 - t * 5.0;
      const shrink = Math.pow(1 - t, 1.6);
      const a = Math.random() * TAU + t * 9.0;
      const rr = (0.1 + shrink * 2.7) * (0.92 + Math.random() * 0.16);
      set(3, i, Math.cos(a) * rr, y, Math.sin(a) * rr - 0.3, 0.18 + t * 0.85);
    }

    // 4 ARCS — outreach: emission arcs firing out, some returning brighter
    {
      const arc = Math.floor(Math.random() * 9);
      const ret = arc % 3 === 0;               // a third of the arcs are replies
      const t = Math.random();
      const base = (arc / 9) * TAU;
      const reach = 0.4 + Math.sin(t * Math.PI) * (2.4 + (arc % 4) * 0.35);
      const a = base + t * 0.9;
      set(4, i, Math.cos(a) * reach, Math.sin(a) * reach * 0.72, gauss() * 0.08 - 0.3,
        (ret ? 1.15 : 0.4) * (0.5 + t * 0.7));
    }

    // 5 ORBIT — sales: elliptic orbits tightening, captured inner ring
    {
      const ringPick = Math.random();
      let rr: number, wv: number, ecc: number;
      if (ringPick < 0.4) { rr = 0.9 + gauss() * 0.015; wv = 1.05; ecc = 1.0; }
      else if (ringPick < 0.7) { rr = 1.7 + gauss() * 0.02; wv = 0.55; ecc = 1.25; }
      else { rr = 2.6 + gauss() * 0.03; wv = 0.3; ecc = 1.45; }
      const a = Math.random() * TAU;
      set(5, i, Math.cos(a) * rr * ecc, Math.sin(a) * rr * 0.8, gauss() * 0.04 - 0.25, wv);
    }

    // 6 CORE — backend: the gyroscope. Bright nucleus + 3 orthogonal hairline
    // rings on different planes (council-gated: precision machine, zero
    // organic read; spokes dropped — their wedges echoed the flower).
    {
      if (r01 < 0.3) {
        const a = Math.random() * TAU;
        const ph = Math.acos(2 * Math.random() - 1);
        const rr = 0.5 + gauss() * 0.03;
        set(6, i, rr * Math.sin(ph) * Math.cos(a), rr * Math.sin(ph) * Math.sin(a) * 0.9, rr * Math.cos(ph) - 0.2, 1.3 + Math.random() * 0.4);
      } else if (r01 < 0.78) {
        const ring = Math.floor(Math.random() * 3);
        const R = [1.35, 1.7, 2.05][ring];
        const a = Math.random() * TAU;
        const c = Math.cos(a) * R, s = Math.sin(a) * R;
        const j = () => gauss() * 0.015;
        let x: number, y: number, z: number;
        if (ring === 0) { x = c; y = s * 0.82; z = 0; }
        else if (ring === 1) { x = c; y = 0; z = s; }
        else { x = 0; y = c * 0.82; z = s; }
        set(6, i, x + j(), y + j(), z + j() - 0.2, 0.9 + (ring === 0 ? 0.25 : 0));
      } else {
        const a = Math.random() * TAU; const rr = 2.3 + Math.pow(Math.random(), 2) * 1.5;
        set(6, i, Math.cos(a) * rr, Math.sin(a) * rr * 0.72, gauss() * 0.4 - 0.3, 0.1 + Math.random() * 0.12);
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
        const a = Math.random() * TAU; const rr = 3.2 + Math.pow(Math.random(), 1.5) * 3.4;
        set(8, i, Math.cos(a) * rr, Math.sin(a) * rr * 0.7, gauss() * 1.4 - 1.2, 0.05 + Math.random() * 0.06);
      }
    }

    // 9 VORTEX — molten ring around the close (never crossing center)
    {
      const a = Math.random() * TAU;
      const R = 2.7, tube = 0.13 + Math.pow(Math.random(), 2) * 0.3;
      const b = Math.random() * TAU;
      const rr = R + Math.cos(b) * tube;
      set(9, i, Math.cos(a) * rr, Math.sin(a) * rr * 0.62, Math.sin(b) * tube - 0.2,
        r01 < 0.75 ? 0.9 + Math.random() * 0.6 : 0.3);
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
    const COUNT = isCoarse ? 20000 : 60000;
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
    let lastX = 0, lastY = 0, vel = 0;
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      const worldH = Math.tan((50 * Math.PI) / 360) * 7.2 * 2;
      const worldW = worldH * (window.innerWidth / window.innerHeight);
      mouseTarget.set((nx * worldW) / 2, (ny * worldH) / 2);
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
