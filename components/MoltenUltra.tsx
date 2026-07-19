"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import * as THREE from "three";

/* PropelBD — MOLTEN ULTRA (Site B).
   The ember palette, rebuilt from zero structure. Industrial-premium: a single
   signature 3D object — a molten orb of displaced metal — hangs in the hero and
   cools as you scroll. Palette narrative: black -> deep heat -> WHITE-HOT proof
   chapter (light inversion, ink type — the clients chapter IS the bright moment)
   -> black close. Diagonal clip-path section breaks, 12vw statements.
   Reduced-motion: static, everything readable. */

const EMBER = "#FF5A1F";
const HOT = "#FF9B5E";
const INKB = "#0A0908";

const CLIENTS = [
  ["SupperClub", "Anchor client — outbound engine, targeting, B2B pipeline, UAE + KSA"],
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
      if (reduce) { gsap.set("[data-u]", { opacity: 1, y: 0 }); return; }

      const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      const ticker = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      /* signature object: molten orb — icosphere displaced by noise in the vertex
         shader, fresnel ember glow. Heat follows scroll (uHeat 1 -> 0 cooled). */
      let renderer: THREE.WebGLRenderer | null = null;
      let raf = 0;
      const onRes = () => {
        if (!renderer) return;
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(window.innerWidth, window.innerHeight);
        mount.current!.appendChild(renderer.domElement);
        const scene = new THREE.Scene();
        const cam = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 30);
        cam.position.set(0, 0, 5.4);
        const uni = {
          uT: { value: 0 },
          uHeat: { value: 1 },
        };
        const mat = new THREE.ShaderMaterial({
          uniforms: uni,
          vertexShader: `
            uniform float uT; uniform float uHeat;
            varying vec3 vN; varying vec3 vP; varying float vD;
            // classic value-noise displacement, cheap + organic
            float h(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
            float n3(vec3 p){vec3 i=floor(p),f=fract(p);vec3 u=f*f*(3.-2.*f);
              return mix(mix(mix(h(i),h(i+vec3(1,0,0)),u.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),u.x),u.y),
                         mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),u.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),u.x),u.y),u.z);}
            void main(){
              float t=uT*.25;
              float d=n3(normal*2.6+vec3(t,t*.7,0.))*.5+n3(normal*6.2-t)*.22;
              d*= (0.35+0.65*uHeat);
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
              vec3 cool=vec3(.06,.05,.05);
              vec3 mid=mix(vec3(.24,.07,.02), vec3(.55,.14,.03), uHeat);
              vec3 hot=vec3(1.0,.42,.14);
              vec3 col=cool+mid*smoothstep(.05,.5,vD)+hot*pow(smoothstep(.3,.75,vD),2.)*uHeat;
              col+=hot*fres*(.35+.45*uHeat);
              gl_FragColor=vec4(col,1.);
            }`,
        });
        const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(1.55, 48), mat);
        orb.position.x = 1.15;
        scene.add(orb);
        const loop = (t: number) => {
          uni.uT.value = t / 1000;
          const sc = Math.min(1, window.scrollY / (window.innerHeight * 2.2));
          uni.uHeat.value = 1 - sc * 0.85;
          orb.rotation.y = t / 9000;
          orb.rotation.x = Math.sin(t / 12000) * 0.3;
          const vw = window.innerWidth;
          orb.position.x = vw < 768 ? 0 : 1.15;
          // orb drifts up + shrinks as it cools, parks top-right by the proof chapter
          orb.position.y = sc * 2.6;
          const s = 1 - sc * 0.45;
          orb.scale.setScalar(s);
          renderer!.render(scene, cam);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        window.addEventListener("resize", onRes);
      } catch { /* static gradient fallback */ }

      // hero statement rises like poured metal
      const tl = gsap.timeline({ delay: 0.25 });
      tl.from(".mu-line", { yPercent: 110, duration: 1.0, stagger: 0.12, ease: "power4.out" })
        .from("[data-hero-el]", { opacity: 0, y: 20, duration: 0.7, stagger: 0.1 }, "-=0.4");

      gsap.utils.toArray<HTMLElement>("[data-u]").forEach((el) => {
        gsap.from(el, {
          opacity: 0, y: 24, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        });
      });

      // white-hot chapter: client names scale-pop in sequence
      gsap.utils.toArray<HTMLElement>(".mu-client").forEach((el, i) => {
        gsap.from(el, {
          opacity: 0, scale: 0.92, y: 30, duration: 0.7, delay: (i % 5) * 0.08, ease: "back.out(1.4)",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      // counters
      gsap.utils.toArray<HTMLElement>("[data-count-u]").forEach((c) => {
        const target = Number(c.dataset.countU || "0");
        const suffix = c.dataset.suffix || "";
        const proxy = { v: 0 };
        gsap.to(proxy, {
          v: target, duration: 1.6, ease: "power2.out",
          scrollTrigger: { trigger: c, start: "top 80%" },
          onUpdate: () => { c.textContent = Math.round(proxy.v).toLocaleString() + suffix; },
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

  const mono = "font-mono text-[11px] uppercase tracking-[0.2em]";

  return (
    <div ref={root} className="relative min-h-screen antialiased" style={{ backgroundColor: INKB, color: "#F0EDE8" }}>
      <div ref={mount} aria-hidden className="fixed inset-0 z-0"
        style={{ background: "radial-gradient(80% 60% at 70% 40%, #1C0A03 0%, #0A0908 65%)" }} />

      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#221E1A] backdrop-blur-md" style={{ backgroundColor: "rgba(10,9,8,0.6)" }}>
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-10">
          <a href="#u-top" className="font-display text-lg font-bold tracking-tight">Propel<span style={{ color: EMBER }}>BD</span></a>
          <a href="#u-cta" className={`${mono} inline-flex min-h-[44px] cursor-pointer items-center gap-2 px-5 py-2.5 text-[#0A0908] transition-transform duration-200 hover:-translate-y-0.5`}
            style={{ backgroundColor: EMBER }}>
            Book the deep dive →
          </a>
        </div>
      </nav>

      <main id="u-top" className="relative z-10">
        {/* HERO — statement + orb */}
        <section className="relative flex min-h-[100dvh] flex-col justify-center pt-24">
          <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
            <p data-hero-el className={mono} style={{ color: HOT }}>PropelBD — fractional business development, Dubai + Abu Dhabi</p>
            <h1 className="mt-6 font-display font-bold leading-[0.88] tracking-[-0.03em]" style={{ fontSize: "clamp(3.2rem, 11.5vw, 11rem)" }}>
              <span className="block overflow-hidden"><span className="mu-line block">HEAT</span></span>
              <span className="block overflow-hidden"><span className="mu-line block">MAKES<span style={{ color: EMBER }}> PIPELINE</span>.</span></span>
            </h1>
            <div className="mt-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
              <p data-hero-el className="max-w-[44ch] text-[17px] leading-[1.7] text-[#C6C0B8] md:text-[19px]">
                We forge the outbound engine your company is missing — targeting,
                verified buyers, outreach in your voice — and we run it until the
                meetings land. The orb cools. The pipeline doesn&apos;t.
              </p>
              <p data-hero-el className={`${mono} text-[#8A847B]`}>scroll — watch it cool ↓</p>
            </div>
          </div>
        </section>

        {/* PROBLEM — deep heat */}
        <section className="relative py-36" style={{ background: "linear-gradient(180deg, transparent 0%, #150602 30%, #1C0803 100%)" }}>
          <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
            <h2 data-u className="max-w-[16ch] font-display font-bold leading-[0.95]" style={{ fontSize: "clamp(2.4rem, 7vw, 6rem)" }}>
              Referrals are a <span style={{ color: HOT }}>campfire</span>.<br />Not a furnace.
            </h2>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {[["No system", "New business shows up when someone remembers you. There is no engine underneath it."],
                ["Behind on AI", "The tools that could warm your next hundred buyers exist. They are simply not deployed."],
                ["No time to build", "You run the company. Nobody is building the furnace while you do."]].map(([t, d], i) => (
                <div key={i} data-u className="border-t-2 pt-6" style={{ borderColor: "#3A1A0C" }}>
                  <h3 className="font-display text-xl font-semibold md:text-2xl" style={{ color: HOT }}>{t}</h3>
                  <p className="mt-3 max-w-[36ch] text-[16px] leading-[1.7] text-[#C6C0B8]">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHITE-HOT — the clients chapter IS the bright moment */}
        <section className="relative py-36" style={{ backgroundColor: "#F5F1EA", color: "#141210", clipPath: "polygon(0 3vw, 100% 0, 100% calc(100% - 3vw), 0 100%)" }}>
          <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 py-10">
            <p data-u className={mono} style={{ color: "#B4430F" }}>White hot — who we&apos;ve worked with</p>
            <h2 data-u className="mt-4 font-display font-bold leading-[0.92] tracking-[-0.02em]" style={{ fontSize: "clamp(2.6rem, 8vw, 7rem)" }}>
              Forged with them.
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
                <div key={d} data-u>
                  <div data-count-u={n} data-suffix={s} className="tnum font-display font-bold" style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", color: "#B4430F" }}>0{s}</div>
                  <p className="mt-1 text-[15px] text-[#4A453E]">{d}</p>
                </div>
              ))}
            </div>
            <p data-u className="mt-12 max-w-[56ch] text-[17px] leading-[1.7] text-[#4A453E]">
              First for our anchor client SupperClub, now across every engagement —
              we stand up the outbound engine, the targeting and the B2B pipeline.
              The meetings land.
            </p>
          </div>
        </section>

        {/* OFFER — back to black */}
        <section className="relative py-36">
          <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
            <h2 data-u className="max-w-[18ch] font-display font-bold leading-[0.95]" style={{ fontSize: "clamp(2.4rem, 6.5vw, 5.5rem)" }}>
              The furnace, installed. <span style={{ color: EMBER }}>You keep the map.</span>
            </h2>
            <div className="mt-12 grid gap-x-14 gap-y-8 md:grid-cols-2">
              {[["Deep dive first", "We map where your pipeline leaks. The map is yours to keep, engagement or not."],
                ["Verified buyer lists", "Decision-makers mapped and verified. Never scraped spam."],
                ["Outbound engine, live", "Sequences in your voice, tracking, reporting — built, then run under our hand."],
                ["Meetings on your calendar", "Revenue is the only scoreboard we report against."]].map(([t, d], i) => (
                <div key={i} data-u className="grid grid-cols-[auto_1fr] items-baseline gap-4 border-b border-[#2A241E] pb-7">
                  <span className="font-mono text-[13px]" style={{ color: EMBER }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold md:text-2xl">{t}</h3>
                    <p className="mt-2 max-w-[46ch] text-[16px] leading-[1.7] text-[#C6C0B8]">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="u-cta" className="relative flex min-h-[85dvh] items-center py-32">
          <div className="mx-auto w-full max-w-[1440px] px-5 text-center md:px-10">
            <h2 data-u className="font-display font-bold leading-[0.9]" style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}>
              LIGHT THE<br /><span style={{ color: EMBER }}>FURNACE.</span>
            </h2>
            <p data-u className="mx-auto mt-8 max-w-[46ch] text-[17px] leading-[1.7] text-[#C6C0B8]">
              A 20-minute deep dive: we map where your revenue is leaking and what
              we would build first. You keep the map. No deck. No pitch theater.
            </p>
            <a data-u href="mailto:a.shaheen7853@gmail.com?subject=PropelBD%20%E2%80%94%20Deep%20dive%20session"
              className="mt-10 inline-flex cursor-pointer items-center gap-2 px-9 py-5 font-mono text-[14px] uppercase tracking-[0.14em] text-[#0A0908] transition-transform duration-200 hover:-translate-y-0.5"
              style={{ backgroundColor: EMBER }}>
              Book the deep dive →
            </a>
            <p data-u className={`${mono} mt-8 text-[#8A847B]`}>Replies within one business day</p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#221E1A] py-8">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-2 px-5 text-center md:flex-row md:justify-between md:px-10">
          <span className="font-display font-bold">Propel<span style={{ color: EMBER }}>BD</span></span>
          <span className={`${mono} text-[#8A847B]`}>© 2026 · Dubai · Abu Dhabi</span>
          <a href="mailto:a.shaheen7853@gmail.com" className={`${mono} text-[#8A847B] hover:underline`}>a.shaheen7853@gmail.com</a>
        </div>
      </footer>
    </div>
  );
}
