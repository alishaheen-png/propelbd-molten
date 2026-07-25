"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* THE FORGE-STONE, scroll-forged (frame-sequence scrub).
   A 132-frame photoreal ignition sequence (NIM-flux keyframe -> deterministic
   local ignition-ramp render, $0) scrubbed by the hero chapter's scroll
   progress on a <canvas> — the Apple image-sequence technique. The dormant
   cracked obsidian stone ignites, fissure by fissure, into the glowing
   revenue-engine core as the visitor scrolls. Replaces the procedural WebGL
   orb (richer, photoreal, pixel-stable — same plate every frame, so zero
   AI-video warping). The ember-dust organism behind it is untouched.

   Perf/craft:
   - canvas redraws ONLY when the frame index changes; mouse parallax is a
     CSS transform on the canvas element (GPU, zero redraw).
   - progressive preload: poster first, then stride passes (8/4/2/1) so a
     mid-page landing scrub finds a nearby frame immediately.
   - nearest-loaded-frame fallback while the sequence streams in.
   - IntersectionObserver + document.hidden pause; DPR capped at 2.
   - prefers-reduced-motion: static forged poster (final frame), no scrub. */

const FRAMES = 132;
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function ForgeSequence() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const el = wrap.current;
    if (!canvas || !el) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    const dir = small ? "640" : "1080";
    const src = (i: number) => `${BASE}/forge/${dir}/frame_${String(i).padStart(3, "0")}.webp`;

    const fit = () => {
      // dpr read per-call: zoom / monitor-swap mid-session keeps the backing store sharp
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const s = Math.round(el.clientWidth * dpr);
      if (canvas.width !== s) { canvas.width = s; canvas.height = s; }
    };
    fit();

    const imgs: (HTMLImageElement | undefined)[] = new Array(FRAMES);
    const ready: boolean[] = new Array(FRAMES).fill(false);
    let disposed = false;
    let shownFrame = -1;

    const drawFrame = (i: number) => {
      const im = imgs[i];
      if (!im || !ready[i]) return;
      fit();
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      ctx2d.drawImage(im, 0, 0, canvas.width, canvas.height);
    };

    const load = (i: number) =>
      new Promise<void>((res) => {
        if (ready[i] || disposed) return res();
        const im = new Image();
        im.decoding = "async";
        im.onload = () => { imgs[i] = im; ready[i] = true; res(); };
        im.onerror = () => res(); // missing frame -> nearest-loaded fallback covers it
        im.src = src(i);
      });

    if (reduce) {
      // static forged poster — the ignited end-state, no motion
      load(FRAMES - 1).then(() => { if (!disposed) drawFrame(FRAMES - 1); });
      return () => { disposed = true; }; // unmount guard: never draw to a detached canvas
    }

    // progressive preload: poster + end, then stride passes, then fill
    const queued: boolean[] = new Array(FRAMES).fill(false);
    const order: number[] = [];
    const enq = (i: number) => { if (!queued[i]) { queued[i] = true; order.push(i); } };
    enq(0); enq(FRAMES - 1);
    for (const stride of [8, 4, 2, 1]) for (let i = 0; i < FRAMES; i += stride) enq(i);
    let cursor = 0;
    const pump = (): void => {
      if (disposed || cursor >= order.length) return;
      const i = order[cursor++];
      load(i).then(() => {
        if (i === 0 && shownFrame < 0) { shownFrame = 0; drawFrame(0); }
        pump();
      });
    };
    for (let c = 0; c < 8; c++) pump(); // 8-wide request pipeline

    const nearestReady = (i: number) => {
      if (ready[i]) return i;
      for (let d = 1; d < FRAMES; d++) {
        if (i - d >= 0 && ready[i - d]) return i - d;
        if (i + d < FRAMES && ready[i + d]) return i + d;
      }
      return -1;
    };

    // scroll progress -> target frame (the hero chapter owns the scrub)
    gsap.registerPlugin(ScrollTrigger);
    let target = 0;
    const st = ScrollTrigger.create({
      trigger: "#hero-forge",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => { target = self.progress * (FRAMES - 1); },
    });

    // mouse parallax — CSS transform only (no canvas redraw)
    let mx = 0, my = 0, px = 0, py = 0;
    const onMove = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    io.observe(el);

    let smooth = 0;
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      smooth += (target - smooth) * 0.22; // catch-up glide keeps fast flicks fluid
      const want = nearestReady(Math.round(smooth));
      if (want >= 0 && want !== shownFrame) { shownFrame = want; drawFrame(want); }
      if (fine) {
        px += (mx - px) * 0.06;
        py += (my - py) * 0.06;
        canvas.style.transform =
          `translate3d(${px * 12}px, ${py * 9}px, 0) rotateZ(${px * 0.6}deg) scale(1.02)`;
      }
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => { fit(); if (shownFrame >= 0) drawFrame(shownFrame); };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      st.kill();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      if (fine) window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      ref={wrap}
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-[2] w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 opacity-[0.5] md:left-auto md:right-[1vw] md:w-[min(42vw,80vh)] md:translate-x-0 md:opacity-100"
      style={{
        aspectRatio: "1 / 1",
        // feather the plate into the page black — the stone must float, never
        // read as a rectangular image box (silk-atlas: object, not frame)
        WebkitMaskImage: "radial-gradient(72% 72% at 50% 47%, #000 52%, transparent 76%)",
        maskImage: "radial-gradient(72% 72% at 50% 47%, #000 52%, transparent 76%)",
      }}
    >
      <canvas ref={canvasRef} className="h-full w-full will-change-transform" />
    </div>
  );
}
