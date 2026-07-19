"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import * as THREE from "three";

/* PropelBD — MOLTEN ULTRA v2.
   POV (law): "We are the ones who actually build."
   The page CONSTRUCTS ITSELF as you scroll: rules draw, blocks slide into
   position, the raw orb is machined into a finished form (scrub-linked
   displacement collapse), and the white chapter is the finished build revealed
   under work-lights — the clients who commissioned it, in lights. Ember palette;
   industrial-premium; no metaphor copy — build language only. Reduced-motion:
   static, all readable. */

const EMBER = "#FF5A1F";
const HOT = "#FF9B5E";
const INKB = "#0A0908";

const CLIENTS = [
  ["SupperClub", "Anchor client — outbound engine, targeting, B2B pipeline"],
  ["Hassan Allam Properties", "Enterprise real estate — decision-maker mapping"],
  ["FlapKap", "Fintech — revenue-side engagement"],
  ["Bold Routes", "Logistics — pipeline standing-up"],
  ["Qedreh & Mansaf", "Hospitality — launch and lead-gen"],
] as const;

export default function MoltenUltra() {
  const root = useRef<HTMLDivElement>(null);
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(".mu-line, [data-hero-el], .build, .mu-client, .mu-rule", { opacity: 1, y: 0, yPercent: 0, x: 0, scaleX: 1, scale: 1 });
        return;
      }

      const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      const ticker = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      /* THE WORKPIECE — raw noisy orb machined smooth by scroll (uHeat AND
         displacement collapse are scrub-driven: raw -> finished part). */
      let renderer: THREE.WebGLRenderer | null = null;
      let raf = 0;
      const onRes = () => renderer?.setSize(window.innerWidth, window.innerHeight);
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(window.innerWidth, window.innerHeight);
        mount.current!.appendChild(renderer.domElement);
        const scene = new THREE.Scene();
        const cam = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 30);
        cam.position.set(0, 0, 5.4);
        const uni = { uT: { value: 0 }, uHeat: { value: 1 } };
        const mat = new THREE.ShaderMaterial({
          uniforms: uni,
          vertexShader: `
            uniform float uT; uniform float uHeat;
            varying vec3 vN; varying vec3 vP; varying float vD;
            float h(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
            float n3(vec3 p){vec3 i=floor(p),f=fract(p);vec3 u=f*f*(3.-2.*f);
              return mix(mix(mix(h(i),h(i+vec3(1,0,0)),u.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),u.x),u.y),
                         mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),u.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),u.x),u.y),u.z);}
            void main(){
              float t=uT*.25;
              float d=n3(normal*2.6+vec3(t,t*.7,0.))*.5+n3(normal*6.2-t)*.22;
              d*=(0.12+0.88*uHeat);          // machining: displacement collapses to near-smooth
              vec3 pos=position+normal*d*.55;
              vD=d;
              vN=normalMatrix*normal;
              vec4 mv=modelViewMatrix*vec4(pos,1.);
              vP=mv.xyz;
              gl_Position=projectionMatrix*mv;
            }`,
          fragmentShader: `
            uniform float uHeat;
            varying vec3 vN; varying vec3 vP; varying float vD;
            void main(){
              vec3 N=normalize(vN); vec3 V=normalize(-vP);
              float fres=pow(1.-max(dot(N,V),0.),2.2);
              vec3 cool=vec3(.07,.065,.062);   // finished steel
              vec3 mid=mix(vec3(.20,.09,.05), vec3(.55,.14,.03), uHeat);
              vec3 hot=vec3(1.0,.42,.14);
              vec3 col=cool+mid*smoothstep(.05,.5,vD)+hot*pow(smoothstep(.3,.75,vD),2.)*uHeat;
              col+=mix(vec3(.55,.58,.62), hot, uHeat)*fres*.4;   // cooled = steel rim, hot = ember rim
              gl_FragColor=vec4(col,1.);
            }`,
        });
        const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(1.55, 48), mat);
        orb.position.x = 1.15;
        scene.add(orb);
        const loop = (t: number) => {
          uni.uT.value = t / 1000;
          const sc = Math.min(1, window.scrollY / (window.innerHeight * 2.4));
          uni.uHeat.value = 1 - sc * 0.92;
          orb.rotation.y = t / 9000;
          orb.rotation.x = Math.sin(t / 12000) * 0.3;
          orb.position.x = window.innerWidth < 768 ? 0 : 1.15;
          orb.position.y = sc * 2.7;
          orb.scale.setScalar(1 - sc * 0.45);
          renderer!.render(scene, cam);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        window.addEventListener("resize", onRes);
      } catch { /* static gradient fallback */ }

      /* hero: poured lines */
      const tl = gsap.timeline({ delay: 0.25 });
      tl.from(".mu-line", { yPercent: 110, duration: 1.0, stagger: 0.12, ease: "power4.out" })
        .from("[data-hero-el]", { opacity: 0, y: 20, duration: 0.7, stagger: 0.1 }, "-=0.4");

      /* CONSTRUCTION — every .build element ASSEMBLES under scrub: slides in
         from its data-from direction while its edge-rule draws. The page is
         being built in front of you; that is the argument. */
      gsap.utils.toArray<HTMLElement>(".build").forEach((el) => {
        const dir = el.dataset.from || "left";
        const x = dir === "left" ? -60 : dir === "right" ? 60 : 0;
        const y = dir === "up" ? 60 : 0;
        gsap.fromTo(el, { opacity: 0, x, y }, {
          opacity: 1, x: 0, y: 0, ease: "none",
          scrollTrigger: { trigger: el, start: "top 94%", end: "top 55%", scrub: 0.5 },
        });
      });
      gsap.utils.toArray<HTMLElement>(".mu-rule").forEach((el) => {
        gsap.fromTo(el, { scaleX: 0 }, {
          scaleX: 1, transformOrigin: "0 50%", ease: "none",
          scrollTrigger: { trigger: el, start: "top 92%", end: "top 55%", scrub: 0.5 },
        });
      });

      /* white chapter reveal — the diagonal sheet slides open under scrub */
      const white = root.current?.querySelector<HTMLElement>("#u-clients");
      if (white) {
        gsap.fromTo(white, { clipPath: "polygon(0 3vw, 100% 0, 100% 0, 0 3vw)" }, {
          clipPath: "polygon(0 3vw, 100% 0, 100% calc(100% - 3vw), 0 100%)", ease: "none",
          scrollTrigger: { trigger: white, start: "top 90%", end: "top 30%", scrub: 0.6 },
        });
      }
      /* client names pop as the lights come on — scrubbed stagger */
      gsap.utils.toArray<HTMLElement>(".mu-client").forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, scale: 0.9, y: 34 }, {
          opacity: 1, scale: 1, y: 0, ease: "none",
          scrollTrigger: { trigger: el, start: `top ${96 - (i % 5) * 2}%`, end: `top ${62 - (i % 5) * 2}%`, scrub: 0.5 },
        });
      });

      /* counters */
      gsap.utils.toArray<HTMLElement>("[data-count-u]").forEach((c) => {
        const target = Number(c.dataset.countU || "0");
        const suffix = c.dataset.suffix || "";
        const proxy = { v: 0 };
        gsap.to(proxy, {
          v: target, duration: 1.6, ease: "power2.out",
          scrollTrigger: { trigger: c, start: "top 80%", toggleActions: "play none none none" },
          onUpdate: () => { c.textContent = Math.round(proxy.v).toLocaleString() + suffix; },
        });
      });

      /* magnetic + cursor accent */
      const cleanups: (() => void)[] = [];
      if (!window.matchMedia("(pointer: coarse)").matches) {
        root.current?.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((m) => {
          const qx = gsap.quickTo(m, "x", { duration: 0.35, ease: "power3.out" });
          const qy = gsap.quickTo(m, "y", { duration: 0.35, ease: "power3.out" });
          const mv = (e: PointerEvent) => {
            const r = m.getBoundingClientRect();
            qx(((e.clientX - (r.left + r.width / 2)) / r.width) * 14);
            qy(((e.clientY - (r.top + r.height / 2)) / r.height) * 10);
          };
          const lv = () => { qx(0); qy(0); };
          m.addEventListener("pointermove", mv, { passive: true });
          m.addEventListener("pointerleave", lv, { passive: true });
          cleanups.push(() => { m.removeEventListener("pointermove", mv); m.removeEventListener("pointerleave", lv); });
        });
        const dot = root.current?.querySelector<HTMLElement>(".cursor-dot-u");
        if (dot) {
          const cx = gsap.quickTo(dot, "x", { duration: 0.5, ease: "power3.out" });
          const cy = gsap.quickTo(dot, "y", { duration: 0.5, ease: "power3.out" });
          const mv = (e: PointerEvent) => { cx(e.clientX); cy(e.clientY); };
          window.addEventListener("pointermove", mv, { passive: true });
          gsap.to(dot, { opacity: 1, duration: 0.8, delay: 1 });
          cleanups.push(() => window.removeEventListener("pointermove", mv));
        }
      }

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onRes);
        cleanups.forEach((f) => f());
        if (renderer) { renderer.dispose(); renderer.domElement.parentNode?.removeChild(renderer.domElement); }
        gsap.ticker.remove(ticker);
        lenis.destroy();
      };
    }, root);
    return () => ctx.revert();
  }, []);

  const mono = "font-mono text-[11px] uppercase tracking-[0.2em]";

  return (
    <div ref={root} className="relative min-h-screen antialiased" style={{ backgroundColor: INKB, color: "#F0EDE8" }}>
      <div ref={mount} aria-hidden className="fixed inset-0 z-0"
        style={{ background: "radial-gradient(80% 60% at 70% 40%, #1C0A03 0%, #0A0908 65%)" }} />

      {/* cursor accent — a small work-light */}
      <div aria-hidden className="cursor-dot-u pointer-events-none fixed left-0 top-0 z-[70] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        style={{ backgroundColor: EMBER, boxShadow: "0 0 16px rgba(255,90,31,0.9)" }} />

      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#221E1A] backdrop-blur-md" style={{ backgroundColor: "rgba(10,9,8,0.6)" }}>
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-10">
          <a href="#u-top" className="font-display text-lg font-bold tracking-tight">Propel<span style={{ color: EMBER }}>BD</span></a>
          <a href="#u-cta" data-magnetic className={`${mono} inline-flex min-h-[44px] cursor-pointer items-center gap-2 px-5 py-2.5 text-[#0A0908] transition-transform duration-200 hover:-translate-y-0.5`}
            style={{ backgroundColor: EMBER }}>
            Book the deep dive →
          </a>
        </div>
      </nav>

      <main id="u-top" className="relative z-10">
        {/* HERO — the workpiece, raw */}
        <section className="relative flex min-h-[100dvh] flex-col justify-center pt-24">
          <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
            <p data-hero-el className={mono} style={{ color: HOT }}>PropelBD — fractional business development</p>
            <h1 className="mt-6 font-display font-bold leading-[0.88] tracking-[-0.03em]" style={{ fontSize: "clamp(3.2rem, 11.5vw, 11rem)" }}>
              <span className="block overflow-hidden"><span className="mu-line block">WE BUILD</span></span>
              <span className="block overflow-hidden"><span className="mu-line block">WHAT<span style={{ color: EMBER }}> CLOSES</span>.</span></span>
            </h1>
            <div className="mt-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
              <p data-hero-el className="max-w-[44ch] text-[17px] leading-[1.7] text-[#C6C0B8] md:text-[19px]">
                Targeting, verified buyers, outreach in your voice — an outbound
                engine built once and run until the meetings land. Watch this page
                assemble itself. That is how we work.
              </p>
              <p data-hero-el className={`${mono} text-[#8A847B]`}>scroll — the raw part gets machined ↓</p>
            </div>
          </div>
        </section>

        {/* PROBLEM — assembled from parts */}
        <section className="relative py-36" style={{ background: "linear-gradient(180deg, transparent 0%, #150602 30%, #1C0803 100%)" }}>
          <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
            <h2 className="build max-w-[16ch] font-display font-bold leading-[0.95]" data-from="left" style={{ fontSize: "clamp(2.4rem, 7vw, 6rem)" }}>
              Referrals are luck.<br /><span style={{ color: HOT }}>Luck doesn&apos;t scale.</span>
            </h2>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {[["No system", "New business shows up when someone remembers you. There is no engine underneath it.", "left"],
                ["Behind on AI", "The tools that could map your next hundred buyers exist. They are simply not deployed.", "up"],
                ["No time to build", "You run the company. Nobody is building the pipeline while you do.", "right"]].map(([t, d, dir], i) => (
                <div key={i} className="build" data-from={dir}>
                  <div className="mu-rule h-[3px] w-full" style={{ backgroundColor: "#3A1A0C" }} />
                  <h3 className="mt-5 font-display text-xl font-semibold md:text-2xl" style={{ color: HOT }}>{t}</h3>
                  <p className="mt-3 max-w-[36ch] text-[16px] leading-[1.7] text-[#C6C0B8]">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* THE FINISHED BUILD — white chapter: clients under work-lights */}
        <section id="u-clients" className="relative py-36" style={{ backgroundColor: "#F5F1EA", color: "#141210", clipPath: "polygon(0 3vw, 100% 0, 100% calc(100% - 3vw), 0 100%)" }}>
          <div className="mx-auto w-full max-w-[1440px] px-5 py-10 md:px-10">
            <p><span className={mono} style={{ color: "#B4430F" }}>The record — who we&apos;ve built for</span></p>
            <h2 className="build mt-4 font-display font-bold leading-[0.92] tracking-[-0.02em]" data-from="left" style={{ fontSize: "clamp(2.6rem, 8vw, 7rem)" }}>
              Built with them.
            </h2>
            <div className="mt-16 flex flex-wrap items-baseline gap-x-12 gap-y-10">
              {CLIENTS.map(([name], i) => (
                <span key={i} className="mu-client font-display font-bold leading-none tracking-[-0.02em]"
                  style={{ fontSize: `clamp(1.8rem, ${5.8 - i * 0.5}vw, ${5.2 - i * 0.45}rem)`, color: i === 0 ? "#B4430F" : "#141210" }}>
                  {name}
                </span>
              ))}
            </div>
            <div className="mt-16 grid gap-8 border-t-2 border-[#141210] pt-10 md:grid-cols-3">
              {[["10000", "+", "verified leads generated for clients"], ["6", "+", "deals closed across engagements"], ["16", "", "corporate targets in live pipeline"]].map(([n, s, d]) => (
                <div key={d} className="build" data-from="up">
                  <div data-count-u={n} data-suffix={s} className="tnum font-display font-bold" style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", color: "#B4430F" }}>0{s}</div>
                  <p className="mt-1 text-[15px] text-[#4A453E]">{d}</p>
                </div>
              ))}
            </div>
            <p className="mt-12 max-w-[56ch] text-[17px] leading-[1.7] text-[#4A453E]">
              First for our anchor client SupperClub, now across every engagement —
              we stand up the outbound engine, the targeting and the B2B pipeline.
              The meetings land.
            </p>
          </div>
        </section>

        {/* OFFER — back to the shop floor */}
        <section className="relative py-36">
          <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
            <h2 className="build max-w-[18ch] font-display font-bold leading-[0.95]" data-from="left" style={{ fontSize: "clamp(2.4rem, 6.5vw, 5.5rem)" }}>
              The engine, installed. <span style={{ color: EMBER }}>You keep the map.</span>
            </h2>
            <div className="mt-12 grid gap-x-14 gap-y-8 md:grid-cols-2">
              {[["Deep dive first", "We map where your pipeline leaks. The map is yours to keep, engagement or not.", "left"],
                ["Verified buyer lists", "Decision-makers mapped and verified. Never scraped spam.", "right"],
                ["Outbound engine, live", "Sequences in your voice, tracking, reporting — built, then run under our hand.", "left"],
                ["Meetings on your calendar", "Revenue is the only scoreboard we report against.", "right"]].map(([t, d, dir], i) => (
                <div key={i} className="build grid grid-cols-[auto_1fr] items-baseline gap-4 pb-7" data-from={dir}>
                  <span className="font-mono text-[13px]" style={{ color: EMBER }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold md:text-2xl">{t}</h3>
                    <p className="mt-2 max-w-[46ch] text-[16px] leading-[1.7] text-[#C6C0B8]">{d}</p>
                    <div className="mu-rule mt-6 h-px w-full" style={{ backgroundColor: "#2A241E" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="u-cta" className="relative flex min-h-[85dvh] items-center py-32">
          <div className="mx-auto w-full max-w-[1440px] px-5 text-center md:px-10">
            <h2 className="build font-display font-bold leading-[0.9]" data-from="up" style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}>
              YOUR TURN<span style={{ color: EMBER }}>.</span>
            </h2>
            <p className="mx-auto mt-8 max-w-[46ch] text-[17px] leading-[1.7] text-[#C6C0B8]">
              A 20-minute deep dive: we map where your revenue is leaking and what
              we would build first. You keep the map. No deck. No pitch theater.
            </p>
            <a data-magnetic href="mailto:a.shaheen7853@gmail.com?subject=PropelBD%20%E2%80%94%20Deep%20dive%20session"
              className="build mt-10 inline-flex cursor-pointer items-center gap-2 px-9 py-5 font-mono text-[14px] uppercase tracking-[0.14em] text-[#0A0908] transition-transform duration-200 hover:-translate-y-0.5"
              data-from="up" style={{ backgroundColor: EMBER }}>
              Book the deep dive →
            </a>
            <p className={`${mono} mt-8 text-[#8A847B]`}>Replies within one business day</p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#221E1A] py-8">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-2 px-5 text-center md:flex-row md:justify-between md:px-10">
          <span className="font-display font-bold">Propel<span style={{ color: EMBER }}>BD</span></span>
          <span className={`${mono} text-[#8A847B]`}>© 2026 · Dubai · Abu Dhabi · worldwide</span>
          <a href="mailto:a.shaheen7853@gmail.com" className={`${mono} text-[#8A847B] hover:underline`}>a.shaheen7853@gmail.com</a>
        </div>
      </footer>
    </div>
  );
}
