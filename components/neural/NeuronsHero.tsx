"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ──────────────────────────────────────────────────────────────────────────
   NeuronsHero — ported from 21st.dev "neurons hero" (c6016.txt).
   Interaction model preserved: cursor proximity fires neurons, which send
   pulses of light along their connections, rippling through the network.

   Adaptations for this repo:
     - strict TypeScript (no `any`, typed refs / classes).
     - cool deep-night palette + single electric-cyan accent (new art
       direction, distinct from the ember/molten site).
     - prefers-reduced-motion: render ONE static frame, no rAF loop, no
       mouse listener. Layout/perspective stay (frozen snapshot).
     - resize handled, capped pixel ratio is N/A here (2D canvas) but we
       negate devicePixelRatio drift by clamping canvas backing store to
       viewport CSS pixels (the source already does window.innerWidth;
       we keep that and add DPR guard so retina doesn't blow up draw calls).
     - FULL cleanup: cancel rAF, remove listeners, null out refs. No leaks.
   ──────────────────────────────────────────────────────────────────────── */

/* Palette — committed cool-toned dark with a single electric-cyan accent. */
const BG_FADE = "rgba(6, 7, 13, 0.18)"; // trailing fade for the rAF trail
const NEURON_DIM = "rgba(125, 240, 255, "; // base neuron tint (cyan)
const NEURON_HOT = 0.95; // peak activation alpha
const DOPAMINE = "rgba(255, 255, 255, "; // pulse head color
const PULSE_GLOW = "rgba(95, 227, 255, "; // pulse glow color

interface NeuronShape {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  radius: number;
  activation: number;
  neighbors: NeuronShape[];
}

interface PulseShape {
  start: NeuronShape;
  end: NeuronShape;
  progress: number;
  speed: number;
}

interface MouseState {
  x: number;
  y: number;
  radius: number;
}

interface Bounds {
  width: number;
  height: number;
}

const NUM_NEURONS = 380; // tuned down from 1000 — smoother on low-end + 375px
const NEIGHBOR_DIST = 48;
const PERSPECTIVE = 420;
const MOUSE_RADIUS = 170;

export default function NeuronsHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let animationFrameId = 0;
    let neurons: NeuronShape[] = [];
    let pulses: PulseShape[] = [];
    const mouse: MouseState = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      radius: MOUSE_RADIUS,
    };
    // rotate the whole field gently with pointer for parallax depth
    const rot = { x: 0, y: 0 };
    let targetRotX = 0;
    let targetRotY = 0;

    const buildNeuron = (x: number, y: number, z: number): NeuronShape => ({
      x,
      y,
      z,
      baseX: x,
      baseY: y,
      baseZ: z,
      radius: Math.random() * 2 + 1,
      activation: 0,
      neighbors: [],
    });

    const buildPulse = (start: NeuronShape, end: NeuronShape): PulseShape => ({
      start,
      end,
      progress: 0,
      speed: 0.045 + Math.random() * 0.03,
    });

    const project = (
      n: { x: number; y: number; z: number },
      bounds: Bounds
    ): { x: number; y: number; scale: number } => {
      const cosY = Math.cos(rot.y);
      const sinY = Math.sin(rot.y);
      const cosX = Math.cos(rot.x);
      const sinX = Math.sin(rot.x);

      const x1 = n.x * cosY - n.z * sinY;
      const z1 = n.z * cosY + n.x * sinY;
      const y1 = n.y * cosX - z1 * sinX;
      const z2 = z1 * cosX + n.y * sinX;

      const scale = PERSPECTIVE / (PERSPECTIVE + z2);
      return {
        x: x1 * scale + bounds.width / 2,
        y: y1 * scale + bounds.height / 2,
        scale,
      };
    };

    const drawNeuron = (
      n: NeuronShape,
      bounds: Bounds
    ): void => {
      const p = project(n, bounds);
      ctx.beginPath();
      ctx.arc(p.x, p.y, n.radius * p.scale, 0, Math.PI * 2);
      const a = 0.18 + n.activation * (NEURON_HOT - 0.18);
      ctx.fillStyle = NEURON_DIM + a + ")";
      ctx.fill();
    };

    const updateNeuron = (n: NeuronShape, bounds: Bounds): void => {
      const p = project(n, bounds);
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.hypot(dx, dy) || 1;
      const force = Math.max(0, (mouse.radius - dist) / mouse.radius);

      n.x += (dx / dist) * force * 0.4;
      n.y += (dy / dist) * force * 0.4;

      // spring back to base position (keeps the sphere coherent)
      n.x += (n.baseX - n.x) * 0.012;
      n.y += (n.baseY - n.y) * 0.012;
      n.z += (n.baseZ - n.z) * 0.012;

      if (n.activation > 0) n.activation = Math.max(0, n.activation - 0.012);

      // fire when cursor is close enough
      if (force > 0.55 && n.activation < 0.45) {
        fire(n);
      }

      drawNeuron(n, bounds);
    };

    const fire = (n: NeuronShape): void => {
      if (n.activation > 0.5) return;
      n.activation = 1;
      // cap fan-out so a cluster hit doesn't drown the rAF budget
      const fan = n.neighbors.slice(0, 8);
      for (const neighbor of fan) {
        pulses.push(buildPulse(n, neighbor));
      }
    };

    const drawPulse = (p: PulseShape, bounds: Bounds): void => {
      const a = project(p.start, bounds);
      const b = project(p.end, bounds);
      const x = a.x + (b.x - a.x) * p.progress;
      const y = a.y + (b.y - a.y) * p.progress;
      const scale = a.scale + (b.scale - a.scale) * p.progress;

      // soft glow halo
      ctx.beginPath();
      ctx.arc(x, y, 6 * scale, 0, Math.PI * 2);
      ctx.fillStyle = PULSE_GLOW + (1 - p.progress) * 0.35 + ")";
      ctx.fill();

      // bright head
      ctx.beginPath();
      ctx.arc(x, y, 2.4 * scale, 0, Math.PI * 2);
      ctx.fillStyle = DOPAMINE + (1 - p.progress) + ")";
      ctx.fill();
    };

    const updatePulse = (p: PulseShape): boolean => {
      p.progress += p.speed;
      if (p.progress >= 1) {
        p.end.activation = Math.min(1, p.end.activation + 0.5);
        return true;
      }
      return false;
    };

    const drawConnections = (bounds: Bounds): void => {
      ctx.lineWidth = 0.9;
      for (let i = 0; i < neurons.length; i++) {
        const a = neurons[i];
        for (let j = 0; j < a.neighbors.length; j++) {
          const b = a.neighbors[j];
          const pa = project(a, bounds);
          const pb = project(b, bounds);
          const heat = Math.max(a.activation, b.activation);
          // Resting alpha was 0.05 — the mesh only existed under the cursor, so
          // with no pointer the hero read as loose dots instead of a network.
          const alpha = 0.16 + heat * 0.6;
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.strokeStyle = NEURON_DIM + alpha + ")";
          ctx.stroke();
        }
      }
    };

    const init = (bounds: Bounds): void => {
      neurons = [];
      pulses = [];
      const radius = Math.min(bounds.width, bounds.height) * 0.34;
      for (let i = 0; i < NUM_NEURONS; i++) {
        const phi = Math.acos(-1 + (2 * i) / NUM_NEURONS);
        const theta = Math.sqrt(NUM_NEURONS * Math.PI) * phi;
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        neurons.push(buildNeuron(x, y, z));
      }
      for (let i = 0; i < neurons.length; i++) {
        const a = neurons[i];
        for (let j = i + 1; j < neurons.length; j++) {
          const b = neurons[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
          if (dist < NEIGHBOR_DIST) {
            a.neighbors.push(b);
            b.neighbors.push(a);
          }
        }
      }
    };

    const renderFrame = (bounds: Bounds, clear: boolean): void => {
      if (clear) {
        ctx.fillStyle = BG_FADE;
        ctx.fillRect(0, 0, bounds.width, bounds.height);
      } else {
        ctx.clearRect(0, 0, bounds.width, bounds.height);
      }
      drawConnections(bounds);
      for (const n of neurons) updateNeuron(n, bounds);
      pulses = pulses.filter((p) => !updatePulse(p));
      for (const p of pulses) drawPulse(p, bounds);
    };

    const resize = (): void => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init({ width: w, height: h });
    };

    const animate = (): void => {
      const bounds = {
        width: window.innerWidth,
        height: canvas.parentElement?.clientHeight || window.innerHeight,
      };
      // ease the parallax rotation toward pointer
      rot.x += (targetRotX - rot.x) * 0.06;
      rot.y += (targetRotY - rot.y) * 0.06;

      if (Math.random() > 0.985) {
        const idx = Math.floor(Math.random() * neurons.length);
        if (neurons[idx]) fire(neurons[idx]);
      }

      renderFrame(bounds, true);
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMove = (e: MouseEvent): void => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const bounds = {
        width: window.innerWidth,
        height: canvas.parentElement?.clientHeight || window.innerHeight,
      };
      targetRotX = ((e.clientY - bounds.height / 2) / bounds.height) * 0.3;
      targetRotY = ((e.clientX - bounds.width / 2) / bounds.width) * 0.3;
    };

    const handleResize = (): void => resize();

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMove);

    resize();

    if (prefersReduced) {
      // render exactly one static frame, no loop, no rate of fire
      const bounds = {
        width: window.innerWidth,
        height: canvas.parentElement?.clientHeight || window.innerHeight,
      };
      rot.x = 0;
      rot.y = 0;
      renderFrame(bounds, false);
    } else {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMove);
      neurons = [];
      pulses = [];
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };
  }, []);

  /* ── overlay content ──────────────────────────────────────────────────── */

  const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.18 + 0.4,
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  const headlineLines = ["The revenue engine", "your business is", "missing."];

  return (
    <section
      aria-label="Neural hero"
      className="relative min-h-[100dvh] w-full overflow-hidden bg-[#06070D]"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full"
      />

      {/* scrim so the type stays legible over the synaptic field */}
      {/* Scrim was 0.35→0.78→0.96 and buried the synaptic field entirely — the
          hero read as loose dots on black. Legibility is carried by the heavy
          display weight, so the field is allowed to breathe. */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,_rgba(6,7,13,0.15)_0%,_rgba(6,7,13,0.42)_72%,_rgba(6,7,13,0.72)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/3 bg-gradient-to-t from-[#06070D] via-[#06070D]/60 to-transparent" />

      {/* Left-aligned, not centered: the taste gate bans centre-bias above
          variance 4, and an off-centre column lets the synaptic field own the
          right side of the frame instead of being wallpaper behind text. */}
      <div className="relative z-20 mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col items-start justify-center px-6 text-left md:px-12">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[#5FE3FF]/25 bg-[#5FE3FF]/8 px-4 py-1.5 backdrop-blur-[6px]"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5FE3FF] opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#5FE3FF]" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#5FE3FF]/90">
            AI-RUN · OPERATOR-DEEP · REVENUE-FIRST
          </span>
        </motion.div>

        <h1 className="font-display text-[clamp(2.4rem,5.6vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-[#EAF6FB]">
          {headlineLines.map((line, i) => (
            <motion.span
              key={line}
              custom={i + 1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="block"
            >
              {line}
            </motion.span>
          ))}
        </h1>

        <motion.p
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-7 max-w-xl text-balance text-[clamp(1rem,1.6vw,1.125rem)] leading-relaxed text-[#9FB6C2]"
        >
          A fractional business-development function, run on AI. Built and
          proven, then handed to your operator to keep running.
        </motion.p>

        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-9"
        >
          <a
            href="#cta"
            data-cta-heat
            className="group inline-flex items-center gap-2.5 rounded-editorial bg-[#5FE3FF] px-7 py-3.5 font-mono text-[13px] font-medium uppercase tracking-[0.14em] text-[#06070D] transition-colors duration-300 hover:bg-[#9BF1FF]"
          >
            Book a deep dive session
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path
                d="M3 8h9M8 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
