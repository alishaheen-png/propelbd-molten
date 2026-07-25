"use client";

/* EMBERFORGE ENGINE — vanilla Three.js scene, scroll-driven by GSAP/ScrollTrigger.
   Isolated from MoltenOrganism entirely: own file, own class, no shared imports beyond
   three/gsap. The chaotic ember field IS the building material — one InstancedMesh of
   ~480 boxes is baked into 3 states (DUST / CITY / TOWER) and blended per-instance by a
   scroll-driven phase scalar; nothing is a separate decorative particle layer.

   Register break 1 (IGNITION) is handled by the DOM (opaque section covers the fixed
   canvas) — the engine just holds camera position during that scroll range.
   Register break 2 (TOWER) is a genuine "hard cut": camera SNAPS to the final framing
   instead of continuing the curve — motion stops abruptly, which IS the break.

   Resource lifecycle: every buffer/geometry/material/texture disposed in .destroy().
   Context-loss handled. Reduced-motion callers should never construct this class at all
   (checked by the React wrapper) — it always assumes full motion is wanted. */

import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const COUNT = 480;

// scroll-progress breakpoints (fraction of total document scroll), matching STAGE1 brief
const T_DUST_END = 0.15;
const T_IGNITION_END = 0.22;
const T_CORE_END = 0.82;
const T_TOWER_END = 0.95;

type Vec3 = [number, number, number];

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeGlyphTexture(text: string, sub?: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 640;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "#FF5A1F";
  ctx.shadowBlur = 46;
  ctx.fillStyle = "#FFB07A";
  ctx.font = "700 260px 'Arial', sans-serif";
  ctx.fillText(text, canvas.width / 2, sub ? canvas.height / 2 - 60 : canvas.height / 2);
  if (sub) {
    ctx.shadowBlur = 18;
    ctx.font = "500 56px 'Arial', sans-serif";
    ctx.fillStyle = "#FF5A1F";
    ctx.fillText(sub, canvas.width / 2, canvas.height / 2 + 110);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface BakedState {
  positions: Float32Array; // COUNT*3
  quats: Float32Array; // COUNT*4
  scales: Float32Array; // COUNT*3
}

function bakeDust(rng: () => number): BakedState {
  const positions = new Float32Array(COUNT * 3);
  const quats = new Float32Array(COUNT * 4);
  const scales = new Float32Array(COUNT * 3);
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  for (let i = 0; i < COUNT; i++) {
    const r = 4 + rng() * 11;
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi) * 0.6;
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 2;
    e.set(rng() * Math.PI, rng() * Math.PI, rng() * Math.PI);
    q.setFromEuler(e);
    quats[i * 4] = q.x;
    quats[i * 4 + 1] = q.y;
    quats[i * 4 + 2] = q.z;
    quats[i * 4 + 3] = q.w;
    const s = 0.06 + rng() * 0.16;
    scales[i * 3] = s;
    scales[i * 3 + 1] = s;
    scales[i * 3 + 2] = s;
  }
  return { positions, quats, scales };
}

// procedural organic footprint: varying max radius per angle so the skyline isn't a square
function footprintRadius(theta: number, rng: () => number): number {
  return 9 + Math.sin(theta * 3.1) * 2.4 + Math.cos(theta * 5.3) * 1.6 + rng() * 1.2;
}

function bakeCity(rng: () => number, tower: boolean): BakedState {
  const positions = new Float32Array(COUNT * 3);
  const quats = new Float32Array(COUNT * 4);
  const scales = new Float32Array(COUNT * 3);
  const identity = new THREE.Quaternion();
  const spacing = 1.15;
  const grid = Math.ceil(Math.sqrt(COUNT));
  let idx = 0;
  for (let gx = 0; gx < grid && idx < COUNT; gx++) {
    for (let gz = 0; gz < grid && idx < COUNT; gz++) {
      const x = (gx - grid / 2) * spacing + (rng() - 0.5) * 0.35;
      const z = (gz - grid / 2) * spacing + (rng() - 0.5) * 0.35 - 2;
      const dist = Math.sqrt(x * x + z * z);
      const theta = Math.atan2(z, x);
      const maxR = footprintRadius(theta, rng);
      if (dist > maxR) continue;
      const centerPull = 1 - Math.min(dist / maxR, 1);
      const baseHeight = 0.6 + centerPull * (tower ? 9 : 5.5) + rng() * (tower ? 3.5 : 2.2);
      positions[idx * 3] = x;
      positions[idx * 3 + 1] = baseHeight / 2;
      positions[idx * 3 + 2] = z;
      quats[idx * 4] = identity.x;
      quats[idx * 4 + 1] = identity.y;
      quats[idx * 4 + 2] = identity.z;
      quats[idx * 4 + 3] = identity.w;
      scales[idx * 3] = 0.32 + rng() * 0.24;
      scales[idx * 3 + 1] = baseHeight;
      scales[idx * 3 + 2] = 0.32 + rng() * 0.24;
      idx++;
    }
  }
  // any unfilled slack (footprint carved holes) -> park far below, invisible
  for (; idx < COUNT; idx++) {
    positions[idx * 3] = 0;
    positions[idx * 3 + 1] = -50;
    positions[idx * 3 + 2] = 0;
    quats[idx * 4] = identity.x;
    quats[idx * 4 + 1] = identity.y;
    quats[idx * 4 + 2] = identity.z;
    quats[idx * 4 + 3] = identity.w;
    scales[idx * 3] = 0.001;
    scales[idx * 3 + 1] = 0.001;
    scales[idx * 3 + 2] = 0.001;
  }
  return { positions, quats, scales };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Palette-arc anchor colors (STAGE1 brief: cold dust -> amber city -> white-hot tower).
// Applied as a single uniform `material.color`, lerped by the same phase/local scalar that
// drives the instance-matrix blend — NOT per-instance `instanceColor`. Per-instance vertex
// color via InstancedMesh.setColorAt was verified correct in the JS-side buffer (read back
// bright HSL values) but rendered solid black on-screen across multiple Chromium/software-GL
// configs (default headless, swiftshader, --enable-unsafe-swiftshader) — an unresolved
// three.js r185 / driver interaction, not a data or logic bug. A single uniform color
// sidesteps it entirely and is proven reliable (isolated diagnostic: readPixels + screenshot
// both showed the assigned color correctly). Trade-off: buildings no longer vary shade by
// individual centrality — the palette still arcs by SCROLL PHASE, just uniformly per state.
const DUST_COLOR = new THREE.Color().setHSL(0.035, 0.9, 0.38);
const CITY_COLOR = new THREE.Color().setHSL(0.075, 0.85, 0.46);
const TOWER_COLOR = new THREE.Color().setHSL(0.11, 0.35, 0.82);

export class EmberforgeEngine {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private mesh: THREE.InstancedMesh;
  private heroPlane: THREE.Mesh;
  private facadePlanes: THREE.Mesh[] = [];
  private dust: BakedState;
  private city: BakedState;
  private tower: BakedState;
  private raf = 0;
  private disposed = false;
  private st: ScrollTrigger | null = null;
  private phaseNow = -1; // last baked phase, skip recompute if unchanged beyond epsilon
  private onProgress?: (t: number) => void;
  private curvePts: THREE.Vector3[];
  private lookPts: THREE.Vector3[];
  private towerCamPos = new THREE.Vector3(0, 15, 27);
  private towerLookAt = new THREE.Vector3(0, 2, 0);
  private visible = true;
  private contextLost = false;
  private posCurve!: THREE.CatmullRomCurve3;
  private lookCurve!: THREE.CatmullRomCurve3;

  constructor(canvas: HTMLCanvasElement, opts: { onProgress?: (t: number) => void } = {}) {
    this.onProgress = opts.onProgress;
    const rng = mulberry32(1337);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    canvas.addEventListener("webglcontextlost", this.onContextLost);
    canvas.addEventListener("webglcontextrestored", this.onContextRestored);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 200);
    this.camera.position.set(0, 0, 9);

    this.dust = bakeDust(rng);
    this.city = bakeCity(rng, false);
    this.tower = bakeCity(rng, true);

    const geo = new THREE.BoxGeometry(1, 1, 1);
    // toneMapped:false — ACES filmic compresses mid-lightness colors toward black; the
    // baked palette is already the intended literal brightness. vertexColors:false —
    // see DUST_COLOR/CITY_COLOR/TOWER_COLOR comment above for why this is a uniform color,
    // not per-instance.
    const mat = new THREE.MeshBasicMaterial({ vertexColors: false, toneMapped: false, color: DUST_COLOR });
    this.mesh = new THREE.InstancedMesh(geo, mat, COUNT);
    this.scene.add(this.mesh);

    this.heroPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 2.8),
      new THREE.MeshBasicMaterial({
        map: makeGlyphTexture("EMBERFORGE"),
        transparent: true,
        depthWrite: false,
      })
    );
    this.heroPlane.position.set(0, 0.6, -1);
    this.scene.add(this.heroPlane);

    const facadeSpecs: Array<[string, string]> = [
      ["SUPPERCLUB MIDDLE EAST", "the proof beat"],
      ["DUBAI · ABU DHABI", "live markets"],
      ["THE ENGINE THAT RUNS", "not a campaign"],
    ];
    const facadePositions: Vec3[] = [
      [5.5, 3.2, 2],
      [-6, 4.5, -3],
      [2.5, 2.2, -6],
    ];
    facadeSpecs.forEach(([t, s], i) => {
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(4.4, 1.4),
        new THREE.MeshBasicMaterial({
          map: makeGlyphTexture(t, s),
          transparent: true,
          opacity: 0,
          depthWrite: false,
        })
      );
      plane.position.set(...facadePositions[i]);
      plane.lookAt(0, plane.position.y, 0);
      this.scene.add(plane);
      this.facadePlanes.push(plane);
    });

    // camera path: DUST(0)->pull-back(1)->FORGE-rise(2)->overview(3)->street-descend(4)->street(5)->CORE(6)
    // STREETS/CORE waypoints (4-6) MUST stay outside the city footprint radius (~9-13 units,
    // see footprintRadius()) — a waypoint inside that radius plants the camera inside a
    // building volume (front-face culling then shows near-nothing but gaps, a degenerate
    // "mostly empty" frame). Keep radius >= ~14 for every waypoint from here on.
    this.curvePts = [
      new THREE.Vector3(0, 0, 9),
      new THREE.Vector3(0, 1.5, 11),
      new THREE.Vector3(0, 7, 17),
      new THREE.Vector3(0, 11, 21),
      new THREE.Vector3(9, 4, 13),
      new THREE.Vector3(-9, 3.5, 9),
      new THREE.Vector3(0, 6.5, 14),
    ];
    this.lookPts = [
      new THREE.Vector3(0, 0, -2),
      new THREE.Vector3(0, 0, -2),
      new THREE.Vector3(0, 1, -2),
      new THREE.Vector3(0, 1.5, -2),
      new THREE.Vector3(0, 2.5, -2),
      new THREE.Vector3(0, 2.5, -2),
      new THREE.Vector3(0, 3.5, -2),
    ];

    // built once, reused every frame — avoid allocating a new curve per scroll tick
    this.posCurve = new THREE.CatmullRomCurve3(this.curvePts.slice(1), false, "catmullrom", 0.5);
    this.lookCurve = new THREE.CatmullRomCurve3(this.lookPts.slice(1), false, "catmullrom", 0.5);

    this.setPhase(0);
    this.updateCamera(0);

    window.addEventListener("resize", this.onResize);
    document.addEventListener("visibilitychange", this.onVisibility);

    this.st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4,
      onUpdate: (self) => {
        this.updateCamera(self.progress);
        this.setPhase(self.progress);
        this.onProgress?.(self.progress);
      },
    });

    this.raf = requestAnimationFrame(this.tick);
  }

  private onContextLost = (e: Event) => {
    e.preventDefault();
    this.contextLost = true;
    cancelAnimationFrame(this.raf);
  };
  private onContextRestored = () => {
    this.contextLost = false;
    this.raf = requestAnimationFrame(this.tick);
  };
  private onVisibility = () => {
    this.visible = !document.hidden;
  };
  private onResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
  };

  private updateCamera(t: number) {
    if (t <= T_DUST_END) {
      const u = t / T_DUST_END;
      this.camera.position.lerpVectors(this.curvePts[0], this.curvePts[1], u);
      const look = new THREE.Vector3().lerpVectors(this.lookPts[0], this.lookPts[1], u);
      this.camera.lookAt(look);
      return;
    }
    if (t <= T_IGNITION_END) {
      this.camera.position.copy(this.curvePts[1]);
      this.camera.lookAt(this.lookPts[1]);
      return;
    }
    if (t <= T_CORE_END) {
      const u = Math.min(Math.max((t - T_IGNITION_END) / (T_CORE_END - T_IGNITION_END), 0), 1);
      this.camera.position.copy(this.posCurve.getPointAt(u));
      this.camera.lookAt(this.lookCurve.getPointAt(u));
      return;
    }
    // TOWER + CLOSE — hard cut, camera SNAPS and holds (the register break)
    this.camera.position.copy(this.towerCamPos);
    this.camera.lookAt(this.towerLookAt);
  }

  private setPhase(t: number) {
    // phase 0..1 = dust->city (spans DUST through end of FORGE/STREETS/CORE)
    // phase 1..2 = city->tower (spans TOWER)
    let phase: number;
    if (t <= T_IGNITION_END) {
      phase = 0;
    } else if (t <= T_CORE_END) {
      const u = (t - T_IGNITION_END) / (T_CORE_END - T_IGNITION_END);
      phase = THREE.MathUtils.smoothstep(u, 0, 1);
    } else if (t <= T_TOWER_END) {
      phase = 1 + (t - T_CORE_END) / (T_TOWER_END - T_CORE_END);
    } else {
      phase = 2;
    }
    // hero/facade opacity are driven by raw scroll `t` directly (not the derived instance
    // blend `phase`) so they update every scroll tick regardless of the instance-mesh
    // recompute throttle below — decoupled on purpose, brief calls for the hero to be fully
    // gone shortly after IGNITION, well before the instance blend finishes assembling.
    const heroOpacity = 1 - THREE.MathUtils.smoothstep(t, T_IGNITION_END, T_IGNITION_END + 0.15);
    (this.heroPlane.material as THREE.MeshBasicMaterial).opacity = heroOpacity;
    this.heroPlane.visible = heroOpacity > 0.01;

    const facadeOpacity =
      THREE.MathUtils.smoothstep(t, 0.56, 0.6) * (1 - THREE.MathUtils.smoothstep(t, 0.68, 0.72));
    this.facadePlanes.forEach((p) => {
      (p.material as THREE.MeshBasicMaterial).opacity = Math.max(0, facadeOpacity);
    });

    if (Math.abs(phase - this.phaseNow) < 0.002) return;
    this.phaseNow = phase;

    const a = phase <= 1 ? this.dust : this.city;
    const b = phase <= 1 ? this.city : this.tower;
    const local = phase <= 1 ? phase : phase - 1;

    const m = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    const qa = new THREE.Quaternion();
    const qb = new THREE.Quaternion();
    const q = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    for (let i = 0; i < COUNT; i++) {
      pos.set(
        lerp(a.positions[i * 3], b.positions[i * 3], local),
        lerp(a.positions[i * 3 + 1], b.positions[i * 3 + 1], local),
        lerp(a.positions[i * 3 + 2], b.positions[i * 3 + 2], local)
      );
      qa.set(a.quats[i * 4], a.quats[i * 4 + 1], a.quats[i * 4 + 2], a.quats[i * 4 + 3]);
      qb.set(b.quats[i * 4], b.quats[i * 4 + 1], b.quats[i * 4 + 2], b.quats[i * 4 + 3]);
      q.copy(qa).slerp(qb, local);
      scale.set(
        lerp(a.scales[i * 3], b.scales[i * 3], local),
        lerp(a.scales[i * 3 + 1], b.scales[i * 3 + 1], local),
        lerp(a.scales[i * 3 + 2], b.scales[i * 3 + 2], local)
      );
      m.compose(pos, q, scale);
      this.mesh.setMatrixAt(i, m);
    }
    this.mesh.instanceMatrix.needsUpdate = true;

    // uniform palette-arc color (see DUST_COLOR/CITY_COLOR/TOWER_COLOR comment)
    const colorA = phase <= 1 ? DUST_COLOR : CITY_COLOR;
    const colorB = phase <= 1 ? CITY_COLOR : TOWER_COLOR;
    (this.mesh.material as THREE.MeshBasicMaterial).color.copy(colorA).lerp(colorB, local);
  }

  private tick = () => {
    if (this.disposed || this.contextLost) return;
    if (this.visible) {
      this.renderer.render(this.scene, this.camera);
    }
    this.raf = requestAnimationFrame(this.tick);
  };

  destroy() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.st?.kill();
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.renderer.domElement.removeEventListener("webglcontextlost", this.onContextLost);
    this.renderer.domElement.removeEventListener("webglcontextrestored", this.onContextRestored);
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
    (this.heroPlane.material as THREE.MeshBasicMaterial).map?.dispose();
    (this.heroPlane.material as THREE.Material).dispose();
    this.heroPlane.geometry.dispose();
    this.facadePlanes.forEach((p) => {
      (p.material as THREE.MeshBasicMaterial).map?.dispose();
      (p.material as THREE.Material).dispose();
      p.geometry.dispose();
    });
    this.renderer.dispose();
  }
}
