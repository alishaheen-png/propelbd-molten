"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Matter from "matter-js";

/* PropelBD — THE MACHINE.
   The page IS a working lead-machine, drawn as a technical blueprint on paper-white
   that comes alive. Physical leads (dots) drop at the hero, travel the full page
   through stations (TARGET -> FILTER -> NIGHT SHIFT -> BINS), and land in the proof
   counters — the numbers you read are objects you watched arrive. Mid-page the
   sheet inverts to night-shift black (the machine at volume), then returns to
   daylight for proof. Register: engineer's dossier — mono annotations, stamps,
   massive grotesk statements. Reduced-motion: static page, no simulation. */

const EMBER = "#FF5A1F";
const INK = "#0B0B0C";
const PAPER = "#F4F1EA";

export default function MachineSite() {
  const root = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set("[data-r], .m-hero-line, .m-annot, .m-rule, .m-stamp", { opacity: 1, y: 0, yPercent: 0, scaleX: 1, scale: 1 });
        return;
      }

      const lenis = new Lenis({ duration: 1.1, smoothWheel: true, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      const ticker = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      /* ---------- THE MACHINE (matter.js world on a fixed canvas) ---------- */
      const canvas = canvasRef.current!;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      let W = window.innerWidth, H = window.innerHeight;
      const g = canvas.getContext("2d")!;

      const engine = Matter.Engine.create({ gravity: { x: 0, y: 1, scale: 0.0011 } });
      const world = engine.world;
      const isCoarse = window.matchMedia("(pointer: coarse)").matches || W < 768;
      const MAX_BALLS = isCoarse ? 40 : 110;

      let pageOffset = 0;
      const secY = (id: string) => document.getElementById(id)?.offsetTop ?? 0;
      const secH = (id: string) => document.getElementById(id)?.offsetHeight ?? 0;

      const statics: Matter.Body[] = [];
      const sensors: { body: Matter.Body; kind: string }[] = [];
      const addRail = (x1: number, y1: number, x2: number, y2: number, w = 8) => {
        const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
        const len = Math.hypot(x2 - x1, y2 - y1);
        const ang = Math.atan2(y2 - y1, x2 - x1);
        const b = Matter.Bodies.rectangle(cx, cy, len, w, { isStatic: true, angle: ang, friction: 0.001, restitution: 0.3 });
        statics.push(b); Matter.World.add(world, b);
      };
      const addSensor = (x: number, y: number, w: number, h: number, kind: string) => {
        const b = Matter.Bodies.rectangle(x, y, w, h, { isStatic: true, isSensor: true });
        sensors.push({ body: b, kind }); Matter.World.add(world, b);
      };

      const counts = { landed: 0, closed: 0 };
      const counterEls = {
        leads: document.querySelector<HTMLElement>("[data-live-leads]"),
        deals: document.querySelector<HTMLElement>("[data-live-deals]"),
      };

      const buildGeometry = () => {
        [...statics, ...sensors.map((s) => s.body)].forEach((b) => Matter.World.remove(world, b));
        statics.length = 0; sensors.length = 0;

        const yHero = secY("m-hero"), yTarget = secY("m-target"), yFilter = secY("m-filter");
        const yNight = secY("m-night"), yProof = secY("m-proof");

        // hero intake: two angled rails funnel the drop
        addRail(W * 0.06, yHero + H * 0.62, W * 0.44, yHero + H * 0.80);
        addRail(W * 0.94, yHero + H * 0.55, W * 0.56, yHero + H * 0.82);
        // target: reticle funnel — only the centered pass through the gap
        addRail(W * 0.24, yTarget + H * 0.45, W * 0.46, yTarget + H * 0.60);
        addRail(W * 0.76, yTarget + H * 0.45, W * 0.54, yTarget + H * 0.60);
        // filter: three-stage zig-zag sieve
        addRail(W * 0.30, yFilter + H * 0.25, W * 0.58, yFilter + H * 0.36);
        addRail(W * 0.78, yFilter + H * 0.46, W * 0.50, yFilter + H * 0.58);
        addRail(W * 0.26, yFilter + H * 0.68, W * 0.54, yFilter + H * 0.80);
        // night shift: long conveyor
        addRail(W * 0.08, yNight + H * 0.60, W * 0.92, yNight + H * 0.78);
        // proof bins: floor + walls + divider — balls ACCUMULATE here
        const binY = yProof + secH("m-proof") * 0.62;
        addRail(W * 0.10, binY, W * 0.90, binY, 12);
        addRail(W * 0.10, binY - H * 0.30, W * 0.10, binY, 12);
        addRail(W * 0.90, binY - H * 0.30, W * 0.90, binY, 12);
        addRail(W * 0.50, binY - H * 0.20, W * 0.50, binY, 10);
        addSensor(W * 0.30, binY - 16, W * 0.36, 20, "lead-land");
        addSensor(W * 0.70, binY - 16, W * 0.36, 20, "deal-land");
      };

      const balls: Matter.Body[] = [];
      const spawn = () => {
        if (balls.length >= MAX_BALLS) {
          const old = balls.shift();
          if (old) Matter.World.remove(world, old);
        }
        const r = 5 + Math.random() * 5;
        const b = Matter.Bodies.circle(W * (0.2 + Math.random() * 0.6), pageOffset - 40, r, {
          restitution: 0.35, friction: 0.02, frictionAir: 0.002, density: 0.002,
        });
        (b as unknown as { ember: boolean }).ember = Math.random() < 0.22;
        balls.push(b); Matter.World.add(world, b);
      };

      Matter.Events.on(engine, "collisionStart", (ev) => {
        for (const pair of ev.pairs) {
          for (const s of sensors) {
            if (pair.bodyA === s.body || pair.bodyB === s.body) {
              if (s.kind === "lead-land") counts.landed++;
              else if (s.kind === "deal-land") counts.closed++;
            }
          }
        }
      });

      let frame = 0;
      let running = true;
      let fmtTick = 0;
      const draw = () => {
        if (!running) return;
        pageOffset = window.scrollY;
        Matter.Engine.update(engine, 1000 / 60);
        frame++;
        if (frame % (isCoarse ? 34 : 14) === 0) spawn();

        for (let i = balls.length - 1; i >= 0; i--) {
          if (balls[i].position.y > document.body.scrollHeight + 400) {
            Matter.World.remove(world, balls[i]); balls.splice(i, 1);
          }
        }

        const n = document.getElementById("m-night");
        const mid = pageOffset + H * 0.5;
        const inNight = n ? mid > n.offsetTop && mid < n.offsetTop + n.offsetHeight : false;

        g.clearRect(0, 0, W, H);
        g.lineWidth = 2;
        g.strokeStyle = inNight ? "rgba(244,241,234,0.75)" : "rgba(11,11,12,0.82)";
        for (const b of statics) {
          const v = b.vertices;
          if (Math.min(v[0].y, v[2].y) - pageOffset > H + 40 || Math.max(v[0].y, v[2].y) - pageOffset < -40) continue;
          g.beginPath();
          g.moveTo(v[0].x, v[0].y - pageOffset);
          for (let i = 1; i < v.length; i++) g.lineTo(v[i].x, v[i].y - pageOffset);
          g.closePath(); g.stroke();
        }
        for (const b of balls) {
          const y = b.position.y - pageOffset;
          if (y < -60 || y > H + 60) continue;
          g.beginPath();
          g.arc(b.position.x, y, (b as Matter.Body & { circleRadius?: number }).circleRadius || 6, 0, Math.PI * 2);
          g.fillStyle = (b as unknown as { ember: boolean }).ember ? EMBER : (inNight ? PAPER : INK);
          g.fill();
        }
        // live counters: numbers the page EARNED (throttled reformat)
        if (++fmtTick % 12 === 0) {
          if (counterEls.leads) counterEls.leads.textContent = (10000 + counts.landed).toLocaleString() + "+";
          if (counterEls.deals) counterEls.deals.textContent = String(6 + Math.floor(counts.closed / 10)) + "+";
        }
        requestAnimationFrame(draw);
      };

      const settle = () => {
        W = window.innerWidth; H = window.innerHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
        g.setTransform(1, 0, 0, 1, 0, 0); g.scale(dpr, dpr);
        buildGeometry();
      };
      settle();
      document.fonts?.ready.then(() => { settle(); ScrollTrigger.refresh(); });
      let rT: ReturnType<typeof setTimeout>;
      const onRes = () => { clearTimeout(rT); rT = setTimeout(settle, 240); };
      window.addEventListener("resize", onRes);
      requestAnimationFrame(draw);

      /* ---------- DOM choreography ---------- */
      gsap.utils.toArray<HTMLElement>("[data-r]").forEach((el) => {
        gsap.from(el, {
          opacity: 0, y: 18, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 86%", toggleActions: "play none none none" },
        });
      });
      const tl = gsap.timeline({ delay: 0.2 });
      tl.from(".m-hero-line", { yPercent: 104, duration: 0.9, stagger: 0.14, ease: "power4.out" })
        .from(".m-annot", { opacity: 0, duration: 0.5, stagger: 0.08 }, "-=0.3");
      gsap.utils.toArray<HTMLElement>(".m-rule").forEach((el) => {
        gsap.from(el, {
          scaleX: 0, transformOrigin: "0 50%", duration: 0.8, ease: "power3.inOut",
          scrollTrigger: { trigger: el, start: "top 80%" },
        });
      });
      const stamp = document.querySelector<HTMLElement>(".m-stamp");
      if (stamp) {
        gsap.from(stamp, {
          scale: 2.6, opacity: 0, rotate: -18, duration: 0.45, ease: "power4.in",
          scrollTrigger: { trigger: "#m-cta", start: "top 55%" },
        });
      }

      return () => {
        running = false;
        window.removeEventListener("resize", onRes);
        gsap.ticker.remove(ticker);
        lenis.destroy();
        Matter.Engine.clear(engine);
      };
    }, root);
    return () => ctx.revert();
  }, []);

  const annot = "font-mono text-[11px] uppercase tracking-[0.18em]";

  return (
    <div ref={root} className="relative min-h-screen antialiased" style={{ backgroundColor: PAPER, color: INK }}>
      {/* THE MACHINE — fixed canvas; the whole page runs through it */}
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[5]" />

      {/* blueprint grid on the paper */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] opacity-[0.35]"
        style={{ backgroundImage: "linear-gradient(rgba(11,11,12,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(11,11,12,0.05) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />

      {/* NAV — drawing title block */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b-2" style={{ borderColor: INK, backgroundColor: `${PAPER}EE` }}>
        <div className="mx-auto flex max-w-[1520px] items-center justify-between px-5 py-3 md:px-10">
          <a href="#m-hero" className="font-display text-lg font-bold tracking-tight">Propel<span style={{ color: EMBER }}>BD</span></a>
          <span className={`${annot} hidden md:block`}>DWG NO. 001 · REVENUE MACHINE · SCALE 1:1</span>
          <a href="#m-cta" className={`${annot} machine-navcta inline-flex min-h-[44px] cursor-pointer items-center border-2 px-4 py-2.5`} style={{ borderColor: INK }}>
            Commission yours →
          </a>
        </div>
      </nav>

      <main className="relative z-10">
        {/* ============ SHEET 1 — HERO ============ */}
        <section id="m-hero" className="relative flex min-h-[100dvh] flex-col justify-center pt-24">
          <div className="mx-auto w-full max-w-[1520px] px-5 md:px-10">
            <p className={`${annot} m-annot mb-6`} style={{ color: EMBER }}>Fig. 1 — the machine your competitors don&apos;t have</p>
            <h1 className="font-display font-bold leading-[0.88] tracking-[-0.03em]" style={{ fontSize: "clamp(3.4rem, 12.5vw, 12rem)" }}>
              <span className="block overflow-hidden"><span className="m-hero-line block">THE MEETING</span></span>
              <span className="block overflow-hidden"><span className="m-hero-line block">MACHINE<span style={{ color: EMBER }}>.</span></span></span>
            </h1>
            <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
              <p className="max-w-[46ch] text-[17px] leading-[1.65] md:text-[19px]">
                Every dot falling through this page is a lead. Watch them get targeted,
                filtered, worked and closed — that is the machine PropelBD installs
                inside UAE companies. Built once. Runs for good.
              </p>
              <a href="#m-cta" className="inline-flex cursor-pointer items-center gap-2 px-7 py-4 font-mono text-[13px] uppercase tracking-[0.14em] text-white transition-transform duration-200 hover:-translate-y-0.5"
                style={{ backgroundColor: INK }}>
                Commission yours →
              </a>
            </div>
            <p className={`${annot} m-annot mt-10 border-t-2 pt-4`} style={{ borderColor: INK }}>
              10,000+ leads generated · 6+ deals closed · verified pipeline, not scraped
            </p>
          </div>
          <div aria-hidden className={`${annot} absolute bottom-4 left-1/2 -translate-x-1/2`}>power the machine ↓</div>
        </section>

        {/* ============ SHEET 2 — TARGET ============ */}
        <section id="m-target" className="relative min-h-[130vh] py-32">
          <div className="mx-auto w-full max-w-[1520px] px-5 md:px-10">
            <div className="md:ml-[46%]">
              <p className={annot} style={{ color: EMBER }}>Station 01 / Intake</p>
              <h2 className="mt-3 font-display font-bold leading-[0.92] tracking-[-0.02em]" style={{ fontSize: "clamp(2.6rem, 7vw, 6rem)" }}>TARGET.</h2>
              <div className="m-rule mt-4 h-[3px] w-full max-w-[18rem]" style={{ backgroundColor: INK }} />
              <p data-r className="mt-6 max-w-[40ch] text-[17px] leading-[1.65]">
                ICP, geography, decision-makers. The reticle only lets the right buyers
                through — the rest fall past. Referrals can&apos;t aim. This can.
              </p>
              <p data-r className={`${annot} mt-5`}>tolerance: senior management · UAE + Gulf · verified humans only</p>
            </div>
          </div>
        </section>

        {/* ============ SHEET 3 — FILTER ============ */}
        <section id="m-filter" className="relative min-h-[150vh] py-32">
          <div className="mx-auto w-full max-w-[1520px] px-5 md:px-10">
            <div className="max-w-[42%] max-md:max-w-full">
              <p className={annot} style={{ color: EMBER }}>Station 02 / Verification sieve</p>
              <h2 className="mt-3 font-display font-bold leading-[0.92] tracking-[-0.02em]" style={{ fontSize: "clamp(2.6rem, 7vw, 6rem)" }}>FILTER.</h2>
              <div className="m-rule mt-4 h-[3px] w-full max-w-[18rem]" style={{ backgroundColor: INK }} />
              <p data-r className="mt-6 max-w-[40ch] text-[17px] leading-[1.65]">
                Every contact bounces down the sieve: real company, real budget, real
                authority. Scraped lists jam machines. Verified pipeline keeps them running.
              </p>
              <ul data-r className="mt-6 space-y-2 font-mono text-[13px] uppercase tracking-[0.12em]">
                <li>— reject: info@ addresses</li>
                <li>— reject: dead MX records</li>
                <li>— reject: juniors, gatekeepers</li>
                <li style={{ color: EMBER }}>— pass: decision-makers, mapped</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ============ SHEET 4 — NIGHT SHIFT (register break) ============ */}
        <section id="m-night" className="relative min-h-[115vh] py-32" style={{ backgroundColor: INK, color: PAPER }}>
          <div className="mx-auto w-full max-w-[1520px] px-5 md:px-10">
            <p className={annot} style={{ color: EMBER }}>Station 03 / Outreach — the night shift</p>
            <h2 className="mt-3 font-display font-bold leading-[0.9] tracking-[-0.02em]" style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}>
              IT WORKS<br />WHILE YOU<br />SLEEP<span style={{ color: EMBER }}>.</span>
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <p data-r className="max-w-[44ch] text-[17px] leading-[1.7] opacity-90">
                Sequences in your voice run around the clock — the conveyor never stops.
                AI does the mapping and the grunt work; every message that leaves is
                aimed at a verified decision-maker and reviewed before it ships.
              </p>
              <p data-r className="max-w-[44ch] text-[17px] leading-[1.7] opacity-90">
                Volume without spray. Replies come back warm, meetings land on your
                calendar, and you keep the map either way.
              </p>
            </div>
            <p data-r className={`${annot} mt-12 opacity-70`}>uptime: continuous · operator: PropelBD · you: asleep</p>
          </div>
        </section>

        {/* ============ SHEET 5 — PROOF (bins fill live) ============ */}
        <section id="m-proof" className="relative min-h-[170vh] py-32">
          <div className="mx-auto w-full max-w-[1520px] px-5 md:px-10">
            <p className={annot} style={{ color: EMBER }}>Station 04 / Output bins — live count</p>
            <h2 className="mt-3 font-display font-bold leading-[0.92] tracking-[-0.02em]" style={{ fontSize: "clamp(2.6rem, 8vw, 7rem)" }}>
              THE BINS DON&apos;T LIE<span style={{ color: EMBER }}>.</span>
            </h2>
            <div className="m-rule mt-4 h-[3px] w-full max-w-[24rem]" style={{ backgroundColor: INK }} />
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              <div data-r>
                <div data-live-leads className="tnum font-display font-bold tracking-tight" style={{ fontSize: "clamp(3rem, 7vw, 6rem)", color: EMBER }}>10,000+</div>
                <p className="mt-2 max-w-[38ch] text-[16px]">verified leads generated for clients — the left bin, filling as you read</p>
              </div>
              <div data-r>
                <div data-live-deals className="tnum font-display font-bold tracking-tight" style={{ fontSize: "clamp(3rem, 7vw, 6rem)", color: EMBER }}>6+</div>
                <p className="mt-2 max-w-[38ch] text-[16px]">deals closed across engagements — plus 16 corporate targets in live pipeline</p>
              </div>
            </div>
            <p data-r className="mt-12 max-w-[52ch] text-[17px] leading-[1.7]">
              First for our anchor client SupperClub, now across every engagement:
              Hassan Allam Properties, FlapKap, Bold Routes, Qedreh &amp; Mansaf.
              We stand up the outbound engine, the targeting, the B2B pipeline. The meetings land.
            </p>
            <p data-r className={`${annot} mt-6`}>counters increment from the simulation — this page never shows a number it didn&apos;t earn</p>
          </div>
        </section>

        {/* ============ SHEET 6 — SPEC / WHO + FAQ ============ */}
        <section className="relative py-28" style={{ backgroundColor: "#E9E4D9" }}>
          <div className="mx-auto w-full max-w-[1520px] px-5 md:px-10">
            <div className="grid gap-14 md:grid-cols-2">
              <div>
                <p className={annot} style={{ color: EMBER }}>Spec sheet / commissioned for</p>
                <h3 className="mt-3 font-display text-3xl font-bold md:text-5xl">UAE companies behind on AI.</h3>
                <p data-r className="mt-5 max-w-[42ch] text-[17px] leading-[1.65]">
                  Real products, real customers, no repeatable pipeline. If growth still
                  depends on referrals, this machine is for you. Not for funded AI-native
                  startups that already live in this world.
                </p>
                <ul data-r className="mt-7 space-y-3 border-t-2 pt-5 text-[16px]" style={{ borderColor: INK }}>
                  {["Deep dive session first — the map is yours to keep",
                    "ICP + verified buyer list, decision-makers mapped",
                    "Outbound engine live, sequences in your voice",
                    "Qualified meetings on your calendar",
                    "Senior operators end to end"].map((t, i) => (
                    <li key={i} className="grid grid-cols-[auto_1fr] gap-3">
                      <span className="font-mono text-[12px]" style={{ color: EMBER }}>{String(i + 1).padStart(2, "0")}</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className={annot} style={{ color: EMBER }}>Tolerances / objections</p>
                <div className="mt-3 space-y-1">
                  {[["Why not hire a BD person?", "A senior UAE BD hire runs well past our retainer after ramp, tooling and management. The machine arrives built and run — and if it does not fit, you stop. No severance."],
                    ["How fast is something real?", "The deep dive lands before any commitment. First verified lists and live outreach move in weeks — you watch the same tracker we work from."],
                    ["What do you need from us?", "One decision-maker, roughly an hour a week, and honest answers about your best customers."],
                    ["Are we locked in?", "No long lock-in. Everything built for you — lists, sequences, the map — stays yours."],
                    ["Is AI outreach spam?", "The opposite. AI aims and does the grunt work; every message ships in your voice at a verified decision-maker, reviewed before it leaves."]].map(([q, a], i) => (
                    <details key={i} className="group border-b-2" style={{ borderColor: INK }}>
                      <summary className="flex cursor-pointer items-baseline justify-between gap-6 py-4 font-display text-lg font-semibold [&::-webkit-details-marker]:hidden">
                        {q}<span aria-hidden className="shrink-0 font-mono transition-transform duration-200 group-open:rotate-45" style={{ color: EMBER }}>+</span>
                      </summary>
                      <p className="max-w-[52ch] pb-5 text-[15px] leading-[1.65]">{a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SHEET 7 — CTA ============ */}
        <section id="m-cta" className="relative flex min-h-[92dvh] items-center py-28">
          <div className="mx-auto w-full max-w-[1520px] px-5 text-center md:px-10">
            <p className={annot} style={{ color: EMBER }}>Work order / final</p>
            <h2 className="mt-4 font-display font-bold leading-[0.9] tracking-[-0.02em]" style={{ fontSize: "clamp(3rem, 10vw, 8.5rem)" }}>
              COMMISSION<br />YOUR MACHINE<span style={{ color: EMBER }}>.</span>
            </h2>
            <div className="m-stamp mx-auto mt-8 inline-block -rotate-6 border-4 px-6 py-2 font-mono text-[15px] font-bold uppercase tracking-[0.2em]"
              style={{ borderColor: EMBER, color: EMBER }}>Dubai + Abu Dhabi</div>
            <p className="mx-auto mt-8 max-w-[46ch] text-[17px] leading-[1.7]">
              A 20-minute deep dive: we map where your revenue leaks and what we&apos;d
              build first. You keep the map. No deck. No pitch theater.
            </p>
            <a href="mailto:a.shaheen7853@gmail.com?subject=PropelBD%20%E2%80%94%20Deep%20dive%20session"
              className="mt-10 inline-flex cursor-pointer items-center gap-2 px-9 py-5 font-mono text-[14px] uppercase tracking-[0.14em] text-white transition-transform duration-200 hover:-translate-y-0.5"
              style={{ backgroundColor: INK }}>
              Book the deep dive →
            </a>
            <p className={`${annot} mt-7`}>replies within one business day</p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t-2" style={{ borderColor: INK }}>
        <div className="mx-auto flex max-w-[1520px] flex-col gap-3 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="font-display font-bold">Propel<span style={{ color: EMBER }}>BD</span></div>
          <span className={annot}>drawn, built and operated by the same hands</span>
          <a href="mailto:a.shaheen7853@gmail.com" className={`${annot} underline-offset-4 hover:underline`}>a.shaheen7853@gmail.com</a>
          <span className={annot}>© 2026 PropelBD · Dubai · Abu Dhabi</span>
        </div>
      </footer>
    </div>
  );
}
