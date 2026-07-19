"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import * as THREE from "three";

/* PropelBD — ROYAL CIRCUIT v2.
   POV (law): "Revenue is a private matter."
   Every decision serves discretion: content sits behind veils that LIFT AS YOU
   SCROLL (scrubbed clip-path curtains, not enter-once fades); a single wax-seal
   mark — the confidential stamp — travels the page and settles beside whatever
   is being disclosed; the silk aurora breathes slowly behind. Hovering a client
   row declassifies it: the redaction bar slides off, the note is revealed.
   Exits faster than enters; transform/opacity only; reduced-motion = static. */

const VIOLET = "#8B5CF6";
const LILAC = "#C4B5FD";
const BLACK = "#060508";

const CLIENTS = [
  ["SupperClub", "Anchor client — outbound engine, targeting, B2B pipeline across two markets"],
  ["Hassan Allam Properties", "Enterprise real-estate group — decision-maker mapping"],
  ["FlapKap", "Fintech — revenue-side engagement"],
  ["Bold Routes", "Logistics — pipeline standing-up"],
  ["Qedreh & Mansaf", "Hospitality brand — launch and lead-gen support"],
] as const;

export default function RoyalSite() {
  const root = useRef<HTMLDivElement>(null);
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set("[data-hero-rule], [data-hero-kicker], [data-hero-line], [data-hero-sub], .veil-inner, .royal-row", { opacity: 1, y: 0, x: 0, clipPath: "none" });
        return;
      }

      const lenis = new Lenis({ duration: 1.35, smoothWheel: true, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      const ticker = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      /* silk aurora — the room's air */
      let renderer: THREE.WebGLRenderer | null = null;
      let raf = 0;
      const onRes = () => renderer?.setSize(window.innerWidth, window.innerHeight);
      try {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(window.innerWidth, window.innerHeight);
        mount.current!.appendChild(renderer.domElement);
        const scene = new THREE.Scene();
        const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const uni = {
          uT: { value: 0 },
          uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          uScroll: { value: 0 },
        };
        const mat = new THREE.ShaderMaterial({
          uniforms: uni,
          vertexShader: "void main(){gl_Position=vec4(position,1.0);}",
          fragmentShader: `
            uniform float uT; uniform vec2 uRes; uniform float uScroll;
            float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
            float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
              return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}
            float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.02+11.;a*=.5;}return v;}
            void main(){
              vec2 uv=gl_FragCoord.xy/uRes; vec2 p=uv*vec2(uRes.x/uRes.y,1.);
              float t=uT*.02;
              vec2 w=vec2(fbm(p*vec2(1.2,2.6)+t),fbm(p*vec2(1.2,2.6)-t*.6));
              float silk=fbm(p*vec2(0.9,3.2)+w*1.4+vec2(0.,uScroll*.3+t*.5));
              float band=smoothstep(.35,.75,silk);
              vec3 deep=vec3(.02,.008,.05);
              vec3 vio=vec3(.35,.16,.85)*band;
              vec3 lil=vec3(.66,.55,.95)*pow(smoothstep(.6,.95,silk),2.2);
              vec3 col=deep+vio*.45+lil*.35;
              float vig=1.-smoothstep(.4,1.35,length(uv-.5)*2.);
              float g=(h(uv*uRes+fract(uT)*37.)-.5)*.014;
              gl_FragColor=vec4(col*vig+g,1.);
            }`,
          depthWrite: false,
        });
        scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
        const loop = (t: number) => {
          uni.uT.value = t / 1000;
          uni.uScroll.value = window.scrollY / window.innerHeight;
          uni.uRes.value.set(window.innerWidth, window.innerHeight);
          renderer!.render(scene, cam);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        window.addEventListener("resize", onRes);
      } catch { /* gradient fallback */ }

      /* THE SEAL — persistent confidential mark, travels between chapters on scrub */
      const seal = root.current?.querySelector<HTMLElement>(".royal-seal");
      if (seal) {
        gsap.set(seal, { xPercent: -50, yPercent: -50, left: "82%", top: "38%", scale: 1 });
        const way = (sel: string, x: string, y: string, scale: number, rot: number) => {
          gsap.to(seal, {
            left: x, top: y, scale, rotate: rot, ease: "none",
            scrollTrigger: { trigger: sel, start: "top bottom", end: "top top", scrub: 0.7 },
          });
        };
        way("#r-register", "8%", "22%", 0.62, -18);
        way("#r-method", "90%", "30%", 0.5, 14);
        way("#r-cta", "50%", "16%", 0.8, 0);
      }

      /* hero entrance */
      const tl = gsap.timeline({ delay: 0.3 });
      tl.from("[data-hero-rule]", { scaleX: 0, duration: 1.1, ease: "power3.inOut" })
        .from("[data-hero-kicker]", { opacity: 0, y: 12, duration: 0.8, ease: "power2.out" }, "-=0.5")
        .from("[data-hero-line]", { opacity: 0, y: 34, duration: 1.0, stagger: 0.16, ease: "power3.out" }, "-=0.4")
        .from("[data-hero-sub]", { opacity: 0, y: 16, duration: 0.8, stagger: 0.1 }, "-=0.4");

      /* VEILS — chapters disclose by scrub: clip-path curtains tied to scroll */
      gsap.utils.toArray<HTMLElement>(".veil").forEach((v) => {
        const inner = v.querySelector(".veil-inner");
        if (!inner) return;
        gsap.fromTo(inner,
          { clipPath: "inset(0 0 100% 0)", opacity: 0.25 },
          {
            clipPath: "inset(0 0 0% 0)", opacity: 1, ease: "none",
            scrollTrigger: { trigger: v, start: "top 92%", end: "top 38%", scrub: 0.6 },
          });
      });

      /* register rows — scrubbed cascade */
      gsap.utils.toArray<HTMLElement>(".royal-row").forEach((el) => {
        gsap.fromTo(el, { opacity: 0, x: -34 }, {
          opacity: 1, x: 0, ease: "none",
          scrollTrigger: { trigger: el, start: "top 96%", end: "top 60%", scrub: 0.5 },
        });
      });

      /* magnetic CTAs + cursor accent */
      const cleanups: (() => void)[] = [];
      if (!window.matchMedia("(pointer: coarse)").matches) {
        root.current?.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((m) => {
          const qx = gsap.quickTo(m, "x", { duration: 0.35, ease: "power3.out" });
          const qy = gsap.quickTo(m, "y", { duration: 0.35, ease: "power3.out" });
          const mv = (e: PointerEvent) => {
            const r = m.getBoundingClientRect();
            qx(((e.clientX - (r.left + r.width / 2)) / r.width) * 12);
            qy(((e.clientY - (r.top + r.height / 2)) / r.height) * 8);
          };
          const lv = () => { qx(0); qy(0); };
          m.addEventListener("pointermove", mv, { passive: true });
          m.addEventListener("pointerleave", lv, { passive: true });
          cleanups.push(() => { m.removeEventListener("pointermove", mv); m.removeEventListener("pointerleave", lv); });
        });
        const dot = root.current?.querySelector<HTMLElement>(".cursor-dot");
        if (dot) {
          const cx = gsap.quickTo(dot, "x", { duration: 0.45, ease: "power3.out" });
          const cy = gsap.quickTo(dot, "y", { duration: 0.45, ease: "power3.out" });
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

  const kicker = "font-mono text-[11px] uppercase tracking-[0.34em]";

  return (
    <div ref={root} className="relative min-h-screen antialiased" style={{ backgroundColor: BLACK, color: "#EDEBF4" }}>
      <div ref={mount} aria-hidden className="fixed inset-0 z-0"
        style={{ background: "radial-gradient(90% 70% at 50% 20%, #17102E 0%, #060508 70%)" }} />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[1]"
        style={{ background: "radial-gradient(120% 120% at 50% 50%, transparent 55%, rgba(0,0,0,0.5) 100%)" }} />

      {/* THE SEAL — travels with the reader through the file */}
      <div aria-hidden className="royal-seal pointer-events-none fixed z-[6] hidden items-center justify-center md:flex"
        style={{ left: "82%", top: "38%", width: 130, height: 130 }}>
        <div className="absolute inset-0 rounded-full border" style={{ borderColor: "rgba(196,181,253,0.4)" }} />
        <div className="absolute inset-[10px] rounded-full border border-dashed" style={{ borderColor: "rgba(139,92,246,0.5)" }} />
        <div className="absolute inset-[26px] rounded-full" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.35), rgba(139,92,246,0.06))", boxShadow: "0 0 42px rgba(139,92,246,0.35)" }} />
        <span className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: LILAC }}>private</span>
      </div>

      {/* cursor accent */}
      <div aria-hidden className="cursor-dot pointer-events-none fixed left-0 top-0 z-[70] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        style={{ backgroundColor: LILAC, boxShadow: "0 0 14px rgba(196,181,253,0.9)" }} />

      <nav className="fixed inset-x-0 top-0 z-50 backdrop-blur-md" style={{ backgroundColor: "rgba(6,5,8,0.55)", borderBottom: "1px solid rgba(196,181,253,0.14)" }}>
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-4 md:px-10">
          <a href="#r-top" className="font-display text-lg font-bold tracking-tight">Propel<span style={{ color: LILAC }}>BD</span></a>
          <a href="#r-cta" data-magnetic className={`${kicker} inline-flex min-h-[44px] cursor-pointer items-center px-5 py-2.5 transition-colors duration-300 hover:text-white`}
            style={{ border: "1px solid rgba(196,181,253,0.35)", color: LILAC }}>
            Request an audience
          </a>
        </div>
      </nav>

      <main id="r-top" className="relative z-10">
        <section className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
          <p data-hero-kicker className={kicker} style={{ color: LILAC }}>PropelBD · Fractional business development</p>
          <div data-hero-rule className="mt-6 h-px w-24" style={{ backgroundColor: VIOLET }} />
          <h1 className="mt-8 font-display font-bold leading-[1.02] tracking-[-0.01em]" style={{ fontSize: "clamp(2.8rem, 7.5vw, 7rem)" }}>
            <span data-hero-line className="block">Revenue is</span>
            <span data-hero-line className="block" style={{ color: LILAC }}>a private matter.</span>
          </h1>
          <p data-hero-sub className="mt-8 max-w-[52ch] text-[17px] leading-[1.8] text-[#B9B4CC] md:text-[18px]">
            We install and run the business-development engine for companies that
            prefer results to noise — targeting, verified pipeline, outreach in
            your voice, meetings on your calendar. Quietly, and to a number.
          </p>
          <a data-hero-sub data-magnetic href="#r-cta" className="mt-10 inline-flex cursor-pointer items-center gap-3 px-8 py-4 font-mono text-[12px] uppercase tracking-[0.28em] text-[#060508] transition-transform duration-300 hover:-translate-y-0.5"
            style={{ backgroundColor: LILAC }}>
            Begin with the audit
          </a>
          <p data-hero-sub className={`${kicker} mt-12`} style={{ color: "#7E7896" }}>
            10,000+ leads · 6+ closed · 16 in live pipeline
          </p>
        </section>

        {/* THE REGISTER — discloses under scrub; hover declassifies */}
        <section id="r-register" className="relative py-32">
          <div className="mx-auto w-full max-w-[1240px] px-6 md:px-10">
            <div className="veil">
              <div className="veil-inner">
                <p className={kicker} style={{ color: LILAC }}>The register</p>
                <h2 className="mt-4 max-w-[22ch] font-display font-bold leading-[1.05]" style={{ fontSize: "clamp(2rem, 4.6vw, 3.8rem)" }}>
                  Houses we have served.
                </h2>
              </div>
            </div>
            <div className="mt-14">
              {CLIENTS.map(([name, note], i) => (
                <div key={i} className="royal-row group grid cursor-default grid-cols-[auto_1fr] items-baseline gap-6 border-t py-7 transition-colors duration-500 md:grid-cols-[6rem_1fr_1.2fr]"
                  style={{ borderColor: "rgba(196,181,253,0.14)" }}>
                  <span className="font-mono text-[12px] tracking-[0.2em] transition-colors duration-300 group-hover:text-white" style={{ color: VIOLET }}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-display text-2xl font-semibold tracking-tight transition-colors duration-500 group-hover:text-white md:text-4xl"
                    style={{ color: "#D6D2E6" }}>{name}</h3>
                  {/* declassified on hover: redaction bar slides off, note appears */}
                  <div className="relative hidden overflow-hidden md:block">
                    <p className="text-[15px] leading-[1.7] text-[#8F89A6] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ transitionTimingFunction: "var(--ease-out-quint)" }}>{note}</p>
                    <div className="absolute inset-x-0 top-1/2 h-[10px] -translate-y-1/2 transition-transform duration-500 group-hover:translate-x-full"
                      style={{ backgroundColor: "rgba(139,92,246,0.28)", transitionTimingFunction: "var(--ease-in-out-cubic)" }} />
                  </div>
                </div>
              ))}
              <div className="border-t" style={{ borderColor: "rgba(196,181,253,0.14)" }} />
            </div>
            <div className="veil mt-12"><div className="veil-inner grid gap-px overflow-hidden md:grid-cols-3" style={{ backgroundColor: "rgba(196,181,253,0.14)" }}>
              {[["10,000+", "verified leads generated"], ["6+", "deals closed across engagements"], ["16", "corporate targets in live pipeline"]].map(([n, d]) => (
                <div key={d} className="p-8 backdrop-blur-sm" style={{ backgroundColor: "rgba(6,5,8,0.72)" }}>
                  <div className="tnum font-display text-4xl font-bold md:text-5xl" style={{ color: LILAC }}>{n}</div>
                  <p className="mt-2 text-[14px] text-[#9F99B5]">{d}</p>
                </div>
              ))}
            </div></div>
          </div>
        </section>

        {/* METHOD */}
        <section id="r-method" className="relative py-32">
          <div className="mx-auto w-full max-w-[1240px] px-6 md:px-10">
            <p className={kicker} style={{ color: LILAC }}>The method</p>
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {[["I — Map", "A deep dive on where your revenue leaks. ICP, geography, decision-makers. The map is yours to keep, engagement or not."],
                ["II — Build", "Verified buyer lists and an outbound engine in your voice. No scraped spam; every contact a mapped decision-maker."],
                ["III — Run", "We operate it. Meetings land on your calendar, reported against the only scoreboard that matters — revenue."]].map(([t, d], i) => (
                <div key={i} className="border-t pt-7" style={{ borderColor: "rgba(196,181,253,0.2)" }}>
                  <h3 className="font-display text-xl font-semibold md:text-2xl">{t}</h3>
                  <p className="mt-4 max-w-[38ch] text-[15px] leading-[1.8] text-[#A29CB8]">{d}</p>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-24 max-w-[30ch] text-center font-display text-2xl font-semibold leading-[1.35] md:text-4xl">
              Agencies report hours. <span style={{ color: LILAC }}>We report pipeline.</span>
            </p>
          </div>
        </section>

        <section id="r-cta" className="relative flex min-h-[80dvh] items-center py-32">
          <div className="mx-auto w-full max-w-[720px] px-6 text-center">
            <div className="veil"><div className="veil-inner">
              <div className="mx-auto h-px w-24" style={{ backgroundColor: VIOLET }} />
              <h2 className="mt-8 font-display font-bold leading-[1.05]" style={{ fontSize: "clamp(2.4rem, 6vw, 4.6rem)" }}>
                An audience,<br />not a pitch.
              </h2>
              <p className="mx-auto mt-7 max-w-[46ch] text-[17px] leading-[1.8] text-[#B9B4CC]">
                Twenty minutes. We map where your revenue is leaking and what we would
                build first. You keep the map. No deck, no theater.
              </p>
              <a data-magnetic href="mailto:a.shaheen7853@gmail.com?subject=PropelBD%20%E2%80%94%20Deep%20dive%20session"
                className="mt-10 inline-flex cursor-pointer items-center px-9 py-4 font-mono text-[12px] uppercase tracking-[0.28em] text-[#060508] transition-transform duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: LILAC }}>
                Request the session
              </a>
              <p className={`${kicker} mt-8`} style={{ color: "#7E7896" }}>Replies within one business day</p>
            </div></div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t py-8" style={{ borderColor: "rgba(196,181,253,0.14)" }}>
        <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-2 px-6 text-center md:flex-row md:justify-between">
          <span className="font-display font-bold">Propel<span style={{ color: LILAC }}>BD</span></span>
          <span className={kicker} style={{ color: "#7E7896" }}>© 2026 · Dubai · Abu Dhabi · worldwide</span>
          <a href="mailto:a.shaheen7853@gmail.com" className={`${kicker} hover:underline`} style={{ color: "#7E7896" }}>a.shaheen7853@gmail.com</a>
        </div>
      </footer>
    </div>
  );
}
