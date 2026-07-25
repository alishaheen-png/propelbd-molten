"use client";

/* NEURAL EMBER — a living AI neural field, awakening.
   Isolated from MoltenOrganism.tsx (never edited). Same engineering discipline
   (baked-formation texture + vertex-shader blend, DPR clamp, visibility pause,
   context-loss handling, reduced-motion bail) but a DIFFERENT shape story:

     0 VOID      — near-empty scatter, cold, sparse. Dread, not yet danger.
     1 MESH      — the SAME chaotic embers coalesce into a travelling neural-mesh
                   silhouette (an icosahedral node cloud) — the signature 3D
                   character. Never clean: chaos jitter rides on top always.
     2 RUPTURE   — violent outward fragmentation, blood-red flash. The register
                   break made physical.
     3 RELEASE   — settles to a calmer warm ember field for the close.

   A discrete synapse-edge LineSegments graph rides the same phase (CPU-lerped,
   ~70 nodes) so the mesh reads as a structure, not just denser dust — the
   travelling shape identity the doctrine requires.

   uPhase driven 0..3 by one ScrollTrigger per [data-ember] section.
   uRupture is a one-shot 0->1->0 GSAP pulse fired when the RUPTURE chapter
   is entered — the physical register-break. Skipped entirely on
   prefers-reduced-motion (bails before mount, CSS poster remains). */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FORMATIONS = 4;
const NODES = 70;

const VERT = /* glsl */ `
  in float aIndex;
  in float aSeed;
  in float aSize;

  uniform sampler2D uForm;
  uniform float uTexW;
  uniform float uRows;
  uniform float uPhase;      // 0..3
  uniform float uTime;
  uniform float uTurb;
  uniform float uPixelRatio;
  uniform float uRupture;    // 0..1 one-shot flash
  uniform float uPerf;

  out float vHeat;
  out float vRupture;

  vec4 formation(float f, float idx) {
    float x = mod(idx, uTexW);
    float y = floor(idx / uTexW) + f * uRows;
    return texelFetch(uForm, ivec2(int(x), int(y)), 0);
  }

  vec3 drift(vec3 p, float t) {
    return vec3(
      sin(p.y * 1.8 + t)       * cos(p.z * 1.4 + t * 0.8),
      sin(p.z * 1.6 + t * 1.2) * cos(p.x * 1.2 + t * 0.9),
      sin(p.x * 1.4 + t * 0.7) * cos(p.y * 2.0 + t)
    );
  }
  float hash(float n) { return fract(sin(n) * 43758.5453123); }

  void main() {
    float f0 = clamp(floor(uPhase), 0.0, 2.0);
    float f1 = f0 + 1.0;
    float blend = smoothstep(0.0, 1.0, uPhase - f0);

    vec4 A = formation(f0, aIndex);
    vec4 B = formation(f1, aIndex);
    vec3 pos = mix(A.xyz, B.xyz, blend);
    float bright = mix(A.w, B.w, blend);

    // the chaos is SACRED — never removed, even at peak coalescence. It just
    // organizes around a shape instead of pure random wander.
    float inVoid = 1.0 - smoothstep(0.0, 1.0, uPhase);
    float amp = 0.22 + inVoid * 0.35 + uTurb * 0.6;
    pos += drift(pos * 0.9 + aSeed * 6.2831, uTime * (0.18 + uTurb * 0.4)) * amp;
    pos += drift(pos * 2.1 + aSeed * 14.1, uTime * 0.5) * (0.09 + inVoid * 0.1);

    // RUPTURE: explode outward from center, hot
    vec3 outward = normalize(pos + vec3(hash(aSeed * 3.1) - 0.5, hash(aSeed * 7.7) - 0.5, hash(aSeed * 11.3) - 0.5) * 0.4 + 0.0001);
    pos += outward * uRupture * (1.4 + hash(aSeed * 5.9) * 2.2);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float flicker = 0.75 + 0.18 * sin(uTime * (1.5 + hash(aSeed) * 2.8) + aSeed * 40.0);
    vHeat = clamp(bright * flicker + uTurb * 0.4, 0.0, 3.0);
    vRupture = uRupture;

    float safeDepth = max(abs(-mv.z), 0.05);
    gl_PointSize = aSize * uPixelRatio * uPerf * (1.0 + uRupture * 1.6) * (5.2 / safeDepth);
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uCool;
  uniform vec3 uMid;
  uniform vec3 uHot;
  uniform vec3 uBlood;
  in float vHeat;
  in float vRupture;
  out vec4 fragColor;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = 1.0 - smoothstep(0.04, 0.34, d);
    float core  = 1.0 - smoothstep(0.0, 0.13, d);
    float heat = clamp(vHeat, 0.0, 1.0);
    vec3 ember = mix(uCool, uMid, smoothstep(0.1, 0.75, heat));
    ember = mix(ember, uHot, core * min(vHeat * 0.55, 1.2));
    ember = mix(ember, uBlood, vRupture);
    float a = alpha * (0.42 + heat * 0.6) * (1.0 + vRupture * 0.5);
    if (a < 0.012) discard;
    fragColor = vec4(ember, a);
  }
`;

function bakeFormations(count: number, texW: number, rows: number) {
  const data = new Float32Array(texW * rows * FORMATIONS * 4);
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) * 0.8;
  const set = (f: number, i: number, x: number, y: number, z: number, w: number) => {
    const o = (f * texW * rows + i) * 4;
    data[o] = x; data[o + 1] = y; data[o + 2] = z; data[o + 3] = w;
  };

  // icosahedron-derived node cloud — the MESH particle target
  const ico = new THREE.IcosahedronGeometry(2.6, 2);
  const icoPos = ico.attributes.position;

  for (let i = 0; i < count; i++) {
    // 0 VOID — sparse cold scatter, wide field, mostly dim
    {
      const spark = Math.random();
      const w = spark < 0.02 ? 0.9 + Math.random() * 0.5 : spark < 0.15 ? 0.4 + Math.random() * 0.35 : 0.06 + Math.pow(Math.random(), 3) * 0.2;
      set(0, i, gauss() * 6.5, gauss() * 4.0, gauss() * 3.6 - 0.4, w);
    }
    // 1 MESH — sample icosahedron vertices (with repeats + jitter for density), warming
    {
      const vi = (i % icoPos.count) * 3;
      const jitter = 0.14;
      const x = icoPos.array[vi] + gauss() * jitter;
      const y = icoPos.array[vi + 1] + gauss() * jitter;
      const z = icoPos.array[vi + 2] + gauss() * jitter;
      const w = 0.55 + Math.random() * 0.6;
      set(1, i, x, y, z, w);
    }
    // 2 RUPTURE — same mesh positions (outward explosion happens in-shader via uRupture), max heat
    {
      const vi = (i % icoPos.count) * 3;
      set(2, i, icoPos.array[vi], icoPos.array[vi + 1], icoPos.array[vi + 2], 1.4 + Math.random() * 0.8);
    }
    // 3 RELEASE — calmer warm field, medium density, gentle spread
    {
      set(3, i, gauss() * 5.2, gauss() * 3.2, gauss() * 2.8 - 0.3, 0.4 + Math.random() * 0.45);
    }
  }
  return data;
}

// synapse node/edge graph — CPU-lerped each frame, cheap (NODES ~70)
function buildSynapseGraph() {
  const ico = new THREE.IcosahedronGeometry(2.6, 1); // fewer verts than particle bake
  const pos = ico.attributes.position;
  const n = Math.min(NODES, pos.count);
  const meshPos: THREE.Vector3[] = [];
  const voidPos: THREE.Vector3[] = [];
  for (let i = 0; i < n; i++) {
    meshPos.push(new THREE.Vector3(pos.array[i * 3], pos.array[i * 3 + 1], pos.array[i * 3 + 2]));
    voidPos.push(new THREE.Vector3((Math.random() - 0.5) * 11, (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 6 - 0.4));
  }
  const edges: [number, number][] = [];
  for (let a = 0; a < n; a++) {
    for (let b = a + 1; b < n; b++) {
      if (meshPos[a].distanceTo(meshPos[b]) < 1.35) edges.push([a, b]);
    }
  }
  return { meshPos, voidPos, edges };
}

export default function NeuralEmberScene() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mount.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = mount.current;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }
    if (renderer.capabilities.maxVertexTextures < 1) {
      renderer.dispose();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const isCoarse = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    const COUNT = isCoarse ? 12000 : 42000;
    const TEXW = 512;
    const ROWS = Math.ceil(COUNT / TEXW);
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 60);
    camera.position.set(0, 0, 7.6);

    const baked = bakeFormations(COUNT, TEXW, ROWS);
    const half = new Uint16Array(baked.length);
    for (let i = 0; i < baked.length; i++) half[i] = THREE.DataUtils.toHalfFloat(baked[i]);
    const formTex = new THREE.DataTexture(half, TEXW, ROWS * FORMATIONS, THREE.RGBAFormat, THREE.HalfFloatType);
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
      sizes[i] = 0.45 + Math.pow(Math.random(), 3.2) * 1.3;
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
      uRupture: { value: 0 },
      uPerf: { value: 1 },
      uCool: { value: new THREE.Color("#3a0f06") },
      uMid: { value: new THREE.Color("#FF5A1F") },
      uHot: { value: new THREE.Color("#FF8A4C") },
      uBlood: { value: new THREE.Color("#FF2E1F") },
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

    // synapse graph — travelling shape identity
    const { meshPos, voidPos, edges } = buildSynapseGraph();
    const edgePositions = new Float32Array(edges.length * 2 * 3);
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(edgePositions, 3));
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xff5a1f, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
    const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
    edgeLines.frustumCulled = false;
    scene.add(edgeLines);

    const tmpA = new THREE.Vector3();
    const tmpB = new THREE.Vector3();
    const updateSynapse = (phase: number, rupture: number) => {
      const inMesh = THREE.MathUtils.smoothstep(phase, 0.7, 1.6) * (1 - THREE.MathUtils.smoothstep(phase, 1.85, 2.4));
      const arr = edgeGeo.attributes.position.array as Float32Array;
      let o = 0;
      for (const [a, b] of edges) {
        tmpA.lerpVectors(voidPos[a], meshPos[a], inMesh);
        tmpB.copy(tmpA).normalize();
        tmpA.addScaledVector(tmpB, rupture * 2.0);
        arr[o++] = tmpA.x; arr[o++] = tmpA.y; arr[o++] = tmpA.z;
        tmpA.lerpVectors(voidPos[b], meshPos[b], inMesh);
        tmpB.copy(tmpA).normalize();
        tmpA.addScaledVector(tmpB, rupture * 2.0);
        arr[o++] = tmpA.x; arr[o++] = tmpA.y; arr[o++] = tmpA.z;
      }
      edgeGeo.attributes.position.needsUpdate = true;
      edgeMat.opacity = inMesh * 0.5 * (1 - rupture * 0.8);
    };

    /* ---- scroll -> phase (one trigger per [data-ember] chapter) + tension meter ---- */
    const triggers: ScrollTrigger[] = [];
    let ruptureFired = false;
    const wire = () => {
      const secs = Array.from(document.querySelectorAll<HTMLElement>("[data-ember]"));
      const docH = document.documentElement.scrollHeight;
      const vh = window.innerHeight;
      secs.forEach((sec, i) => {
        const [a, b] = (sec.dataset.ember || "0:0").split(":").map(Number);
        const isFirst = i === 0;
        const atFloor = sec.offsetTop + sec.offsetHeight >= docH - vh * 0.5;
        triggers.push(
          ScrollTrigger.create({
            trigger: sec,
            start: isFirst ? "top top" : "top bottom",
            end: atFloor ? "bottom bottom" : "bottom top",
            scrub: 0.6,
            onUpdate: (self) => {
              const phase = a + (b - a) * self.progress;
              uniforms.uPhase.value = phase;
              // rupture chapter is [2:2.5] on the ember timeline — one-shot flash on entry
              if (phase >= 2.02 && !ruptureFired) {
                ruptureFired = true;
                gsap.fromTo(
                  uniforms.uRupture,
                  { value: 0 },
                  { value: 1, duration: 0.35, ease: "power4.out", yoyo: true, repeat: 1, repeatDelay: 0.05 }
                );
                document.dispatchEvent(new CustomEvent("ember:rupture"));
              }
              if (phase < 1.9 && ruptureFired) ruptureFired = false;
              // tension meter: 0..1 across VOID->RUPTURE (phase 0..2), DOM-driven
              const tensionEl = document.querySelector<HTMLElement>("[data-ember-tension]");
              if (tensionEl) {
                const t = Math.min(1, phase / 2);
                tensionEl.style.transform = `scaleY(${t})`;
              }
            },
          })
        );
      });
    };
    let wireRaf = 0;
    wireRaf = requestAnimationFrame(() => {
      wireRaf = requestAnimationFrame(() => { wire(); ScrollTrigger.refresh(); });
    });
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    let lastScroll = window.scrollY;
    let raf = 0;
    let running = true;
    let contextLost = false;
    let lastFrameAt = 0;

    const tick = () => {
      if (!running || contextLost) return;
      const now = performance.now();
      if (lastFrameAt > 0) uniforms.uTime.value += Math.min(now - lastFrameAt, 50) / 1000;
      lastFrameAt = now;

      const sy = window.scrollY;
      uniforms.uTurb.value = Math.min(1, uniforms.uTurb.value * 0.92 + Math.abs(sy - lastScroll) * 0.0016);
      lastScroll = sy;

      updateSynapse(uniforms.uPhase.value, uniforms.uRupture.value);

      camera.position.z = 7.6 - Math.min(uniforms.uPhase.value, 2) * 0.4;
      camera.position.x = Math.sin(uniforms.uPhase.value * 0.6) * 0.3;
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
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      geo.dispose(); mat.dispose(); formTex.dispose();
      edgeGeo.dispose(); edgeMat.dispose();
      renderer.dispose();
      if (canvas.parentElement === el) el.removeChild(canvas);
    };
  }, []);

  return <div ref={mount} aria-hidden className="pointer-events-none fixed inset-0 z-0" style={{ contain: "strict" }} />;
}
