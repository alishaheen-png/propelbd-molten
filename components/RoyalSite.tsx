"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import * as THREE from "three";

/* PropelBD — ROYAL CIRCUIT (Site A).
   Private-bank register in black and electric violet. A silk aurora — one slow
   WebGL ribbon field — breathes behind a formal, centered composition. Glass
   panels, hairline rules, sentence-case restraint. The client register is the
   centerpiece: a formal roll-call, each name lit on hover. The luxury is in
   the pacing. Reduced-motion: static gradient, everything visible. */

const VIOLET = "#8B5CF6";
const LILAC = "#C4B5FD";
const BLACK = "#060508";

const CLIENTS = [
  ["SupperClub", "Anchor client — outbound engine, targeting, B2B pipeline across UAE and KSA"],
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
      if (reduce) { gsap.set("[data-v]", { opacity: 1, y: 0 }); return; }

      const lenis = new Lenis({ duration: 1.35, smoothWheel: true, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      const ticker = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      /* aurora silk — fullscreen shader, violet ribbons drifting like fabric */
      let renderer: THREE.WebGLRenderer | null = null;
      let raf = 0;
      const onRes = () => {
        if (!renderer) return;
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
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
      } catch { /* CSS gradient fallback stays */ }

      const tl = gsap.timeline({ delay: 0.3 });
      tl.from("[data-hero-rule]", { scaleX: 0, duration: 1.1, ease: "power3.inOut" })
        .from("[data-hero-kicker]", { opacity: 0, y: 12, duration: 0.8, ease: "power2.out" }, "-=0.5")
        .from("[data-hero-line]", { opacity: 0, y: 34, duration: 1.0, stagger: 0.16, ease: "power3.out" }, "-=0.4")
        .from("[data-hero-sub]", { opacity: 0, y: 16, duration: 0.8, stagger: 0.1 }, "-=0.4");

      gsap.utils.toArray<HTMLElement>("[data-v]").forEach((el) => {
        gsap.from(el, {
          opacity: 0, y: 22, duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        });
      });
      gsap.utils.toArray<HTMLElement>(".royal-row").forEach((el, i) => {
        gsap.from(el, {
          opacity: 0, x: -28, duration: 0.7, delay: (i % 5) * 0.06, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onRes);
        if (renderer) {
          renderer.dispose();
          renderer.domElement.parentNode?.removeChild(renderer.domElement);
        }
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

      <nav className="fixed inset-x-0 top-0 z-50 backdrop-blur-md" style={{ backgroundColor: "rgba(6,5,8,0.55)", borderBottom: "1px solid rgba(196,181,253,0.14)" }}>
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-4 md:px-10">
          <a href="#r-top" className="font-display text-lg font-bold tracking-tight">Propel<span style={{ color: LILAC }}>BD</span></a>
          <a href="#r-cta" className={`${kicker} inline-flex min-h-[44px] cursor-pointer items-center px-5 py-2.5 transition-colors duration-300 hover:text-white`}
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
            <span data-hero-line className="block">Revenue, conducted</span>
            <span data-hero-line className="block" style={{ color: LILAC }}>with intent.</span>
          </h1>
          <p data-hero-sub className="mt-8 max-w-[52ch] text-[17px] leading-[1.8] text-[#B9B4CC] md:text-[18px]">
            We install and run the business-development engine for UAE companies —
            targeting, verified pipeline, outreach in your voice, meetings on your
            calendar. Quietly, and to a number.
          </p>
          <a data-hero-sub href="#r-cta" className="mt-10 inline-flex cursor-pointer items-center gap-3 px-8 py-4 font-mono text-[12px] uppercase tracking-[0.28em] text-[#060508] transition-transform duration-300 hover:-translate-y-0.5"
            style={{ backgroundColor: LILAC }}>
            Begin with the audit
          </a>
          <p data-hero-sub className={`${kicker} mt-12`} style={{ color: "#7E7896" }}>
            10,000+ leads · 6+ closed · 16 in live pipeline
          </p>
        </section>

        {/* THE REGISTER — clients as the centerpiece */}
        <section className="relative py-32">
          <div className="mx-auto w-full max-w-[1240px] px-6 md:px-10">
            <p data-v className={kicker} style={{ color: LILAC }}>The register</p>
            <h2 data-v className="mt-4 max-w-[22ch] font-display font-bold leading-[1.05]" style={{ fontSize: "clamp(2rem, 4.6vw, 3.8rem)" }}>
              Houses we have served.
            </h2>
            <div className="mt-14">
              {CLIENTS.map(([name, note], i) => (
                <div key={i} className="royal-row group grid cursor-default grid-cols-[auto_1fr] items-baseline gap-6 border-t py-7 transition-colors duration-500 md:grid-cols-[6rem_1fr_1.2fr]"
                  style={{ borderColor: "rgba(196,181,253,0.14)" }}>
                  <span className="font-mono text-[12px] tracking-[0.2em]" style={{ color: VIOLET }}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-display text-2xl font-semibold tracking-tight transition-colors duration-500 group-hover:text-white md:text-4xl"
                    style={{ color: "#D6D2E6" }}>{name}</h3>
                  <p className="hidden text-[15px] leading-[1.7] text-[#8F89A6] md:block">{note}</p>
                </div>
              ))}
              <div className="border-t" style={{ borderColor: "rgba(196,181,253,0.14)" }} />
            </div>
            <div data-v className="mt-12 grid gap-px overflow-hidden md:grid-cols-3" style={{ backgroundColor: "rgba(196,181,253,0.14)" }}>
              {[["10,000+", "verified leads generated"], ["6+", "deals closed across engagements"], ["16", "corporate targets in live pipeline"]].map(([n, d]) => (
                <div key={d} className="p-8 backdrop-blur-sm" style={{ backgroundColor: "rgba(6,5,8,0.72)" }}>
                  <div className="tnum font-display text-4xl font-bold md:text-5xl" style={{ color: LILAC }}>{n}</div>
                  <p className="mt-2 text-[14px] text-[#9F99B5]">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* METHOD — three movements */}
        <section className="relative py-32">
          <div className="mx-auto w-full max-w-[1240px] px-6 md:px-10">
            <p data-v className={kicker} style={{ color: LILAC }}>The method</p>
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {[["I — Map", "A deep dive on where your revenue leaks. ICP, geography, decision-makers. The map is yours to keep, engagement or not."],
                ["II — Build", "Verified buyer lists and an outbound engine in your voice. No scraped spam; every contact a mapped decision-maker."],
                ["III — Run", "We operate it. Meetings land on your calendar, reported against the only scoreboard that matters — revenue."]].map(([t, d], i) => (
                <div key={i} data-v className="border-t pt-7" style={{ borderColor: "rgba(196,181,253,0.2)" }}>
                  <h3 className="font-display text-xl font-semibold md:text-2xl">{t}</h3>
                  <p className="mt-4 max-w-[38ch] text-[15px] leading-[1.8] text-[#A29CB8]">{d}</p>
                </div>
              ))}
            </div>
            <p data-v className="mx-auto mt-24 max-w-[30ch] text-center font-display text-2xl font-semibold leading-[1.35] md:text-4xl">
              Agencies report hours. <span style={{ color: LILAC }}>We report pipeline.</span>
            </p>
          </div>
        </section>

        <section id="r-cta" className="relative flex min-h-[80dvh] items-center py-32">
          <div className="mx-auto w-full max-w-[720px] px-6 text-center">
            <div data-v className="mx-auto h-px w-24" style={{ backgroundColor: VIOLET }} />
            <h2 data-v className="mt-8 font-display font-bold leading-[1.05]" style={{ fontSize: "clamp(2.4rem, 6vw, 4.6rem)" }}>
              An audience,<br />not a pitch.
            </h2>
            <p data-v className="mx-auto mt-7 max-w-[46ch] text-[17px] leading-[1.8] text-[#B9B4CC]">
              Twenty minutes. We map where your revenue is leaking and what we would
              build first. You keep the map. No deck, no theater.
            </p>
            <a data-v href="mailto:a.shaheen7853@gmail.com?subject=PropelBD%20%E2%80%94%20Deep%20dive%20session"
              className="mt-10 inline-flex cursor-pointer items-center px-9 py-4 font-mono text-[12px] uppercase tracking-[0.28em] text-[#060508] transition-transform duration-300 hover:-translate-y-0.5"
              style={{ backgroundColor: LILAC }}>
              Request the session
            </a>
            <p data-v className={`${kicker} mt-8`} style={{ color: "#7E7896" }}>Replies within one business day</p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t py-8" style={{ borderColor: "rgba(196,181,253,0.14)" }}>
        <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-2 px-6 text-center md:flex-row md:justify-between">
          <span className="font-display font-bold">Propel<span style={{ color: LILAC }}>BD</span></span>
          <span className={kicker} style={{ color: "#7E7896" }}>© 2026 · Dubai · Abu Dhabi</span>
          <a href="mailto:a.shaheen7853@gmail.com" className={`${kicker} hover:underline`} style={{ color: "#7E7896" }}>a.shaheen7853@gmail.com</a>
        </div>
      </footer>
    </div>
  );
}
