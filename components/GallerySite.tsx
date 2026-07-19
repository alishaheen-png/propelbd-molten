"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/* PropelBD — THE GALLERY v2.
   POV (law): "The work speaks."
   Museum curation: every motion is a curation gesture — frames HANG (settle
   from a slight tilt as they arrive under scrub), labels settle after their
   frame, a cobalt plumb-line drops down the page keeping everything true, and
   the horizontal wing is walked by scroll. Ivory paper, cobalt ink, serif
   masthead. Everything defers to the client wing. Reduced-motion: static. */

const COBALT = "#1D4ED8";
const INKC = "#191714";
const IVORY = "#F7F4ED";

const WORKS = [
  ["SupperClub", "Anchor client", "Outbound engine, targeting and B2B pipeline across two markets. The engagement that built the method."],
  ["Hassan Allam Properties", "Enterprise real estate", "Decision-maker mapping across an enterprise group."],
  ["FlapKap", "Fintech", "Revenue-side engagement."],
  ["Bold Routes", "Logistics", "Pipeline standing-up."],
  ["Qedreh & Mansaf", "Hospitality", "Launch and lead-gen support."],
] as const;

export default function GallerySite() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const wing = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set("[data-g], .g-hero-word, [data-hero-g], .g-hero-rule, .hang", { opacity: 1, y: 0, rotate: 0 });
        return;
      }

      const lenis = new Lenis({ duration: 1.25, smoothWheel: true, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      const ticker = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      const tl = gsap.timeline({ delay: 0.25 });
      tl.from(".g-hero-word", { opacity: 0, y: 40, duration: 0.9, stagger: 0.12, ease: "power3.out" })
        .from("[data-hero-g]", { opacity: 0, y: 16, duration: 0.7, stagger: 0.1 }, "-=0.4")
        .from(".g-hero-rule", { scaleX: 0, transformOrigin: "0 50%", duration: 1.0, ease: "power3.inOut" }, "-=0.6");

      /* PLUMB-LINE — the curator's vertical: a cobalt thread that extends down
         the page edge as you scroll (page-length scrub), with a bob that stays
         at the reading line. */
      const plumb = root.current?.querySelector<HTMLElement>(".plumb-line");
      if (plumb) {
        gsap.fromTo(plumb, { scaleY: 0 }, {
          scaleY: 1, transformOrigin: "50% 0%", ease: "none",
          scrollTrigger: {
            trigger: document.documentElement, start: 0,
            end: () => document.documentElement.scrollHeight - window.innerHeight, scrub: 0.4,
          },
        });
      }

      /* HANG — everything arrives like a frame being hung: slight tilt that
         settles to true under scrub. */
      gsap.utils.toArray<HTMLElement>(".hang").forEach((el, i) => {
        const tilt = (i % 2 === 0 ? 1 : -1) * 2.4;
        gsap.fromTo(el, { opacity: 0, y: 44, rotate: tilt }, {
          opacity: 1, y: 0, rotate: 0, ease: "none",
          scrollTrigger: { trigger: el, start: "top 95%", end: "top 55%", scrub: 0.55 },
        });
      });

      /* the wing: horizontal walk, scrubbed; frames inside settle as they pass
         the center of the room */
      if (track.current && wing.current && window.innerWidth >= 768) {
        const total = track.current.scrollWidth - window.innerWidth;
        const walk = gsap.to(track.current, {
          x: -total, ease: "none",
          scrollTrigger: {
            trigger: wing.current, start: "top top", end: () => `+=${total}`,
            pin: true, scrub: 0.6, invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>(".wing-frame").forEach((f, i) => {
          gsap.fromTo(f, { rotate: i % 2 === 0 ? 1.6 : -1.6, y: 18 }, {
            rotate: 0, y: 0, ease: "none",
            scrollTrigger: { trigger: f, containerAnimation: walk, start: "left 85%", end: "left 45%", scrub: 0.5 },
          });
        });
      }

      gsap.utils.toArray<HTMLElement>(".g-rule").forEach((el) => {
        gsap.fromTo(el, { scaleX: 0 }, {
          scaleX: 1, transformOrigin: "0 50%", ease: "none",
          scrollTrigger: { trigger: el, start: "top 88%", end: "top 55%", scrub: 0.5 },
        });
      });

      /* magnetic invitation + cursor bob */
      const cleanups: (() => void)[] = [];
      if (!window.matchMedia("(pointer: coarse)").matches) {
        root.current?.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((m) => {
          const qx = gsap.quickTo(m, "x", { duration: 0.35, ease: "power3.out" });
          const qy = gsap.quickTo(m, "y", { duration: 0.35, ease: "power3.out" });
          const mv = (e: PointerEvent) => {
            const r = m.getBoundingClientRect();
            qx(((e.clientX - (r.left + r.width / 2)) / r.width) * 10);
            qy(((e.clientY - (r.top + r.height / 2)) / r.height) * 7);
          };
          const lv = () => { qx(0); qy(0); };
          m.addEventListener("pointermove", mv, { passive: true });
          m.addEventListener("pointerleave", lv, { passive: true });
          cleanups.push(() => { m.removeEventListener("pointermove", mv); m.removeEventListener("pointerleave", lv); });
        });
        const bob = root.current?.querySelector<HTMLElement>(".cursor-bob");
        if (bob) {
          const cx = gsap.quickTo(bob, "x", { duration: 0.55, ease: "power3.out" });
          const cy = gsap.quickTo(bob, "y", { duration: 0.55, ease: "power3.out" });
          const mv = (e: PointerEvent) => { cx(e.clientX); cy(e.clientY); };
          window.addEventListener("pointermove", mv, { passive: true });
          gsap.to(bob, { opacity: 1, duration: 0.8, delay: 1 });
          cleanups.push(() => window.removeEventListener("pointermove", mv));
        }
      }

      return () => { cleanups.forEach((f) => f()); gsap.ticker.remove(ticker); lenis.destroy(); };
    }, root);
    return () => ctx.revert();
  }, []);

  const label = "font-mono text-[11px] uppercase tracking-[0.26em]";
  const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

  return (
    <div ref={root} className="relative min-h-screen antialiased" style={{ backgroundColor: IVORY, color: INKC }}>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] opacity-[0.05] mix-blend-multiply"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* the curator's plumb-line — extends with the reader */}
      <div aria-hidden className="plumb-line pointer-events-none fixed left-6 top-0 z-[2] hidden h-full w-px md:block"
        style={{ backgroundColor: "rgba(29,78,216,0.35)" }} />

      {/* cursor bob — small cobalt weight */}
      <div aria-hidden className="cursor-bob pointer-events-none fixed left-0 top-0 z-[70] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        style={{ backgroundColor: COBALT }} />

      <nav className="fixed inset-x-0 top-0 z-50 border-b" style={{ borderColor: "#D8D2C4", backgroundColor: "rgba(247,244,237,0.85)", backdropFilter: "blur(8px)" }}>
        <div className="mx-auto flex max-w-[1360px] items-center justify-between px-6 py-4 md:px-10">
          <a href="#g-top" className="text-lg font-bold tracking-tight" style={serif}>Propel<span style={{ color: COBALT }}>BD</span></a>
          <span className={`${label} hidden text-[#7C766A] md:block`}>An exhibition of revenue work</span>
          <a href="#g-cta" data-magnetic className={`${label} inline-flex min-h-[44px] cursor-pointer items-center border-b-2 pb-1 transition-opacity duration-300 hover:opacity-70`}
            style={{ borderColor: COBALT, color: COBALT }}>
            Private viewing
          </a>
        </div>
      </nav>

      <main id="g-top" className="relative z-10">
        {/* HERO — masthead */}
        <section className="relative flex min-h-[100dvh] flex-col justify-center pt-24">
          <div className="mx-auto w-full max-w-[1360px] px-6 md:px-10">
            <p data-hero-g className={label} style={{ color: COBALT }}>PropelBD — fractional business development</p>
            <h1 className="mt-8 leading-[1.0] tracking-[-0.015em]" style={{ ...serif, fontSize: "clamp(3rem, 9.5vw, 9rem)", fontWeight: 400 }}>
              <span className="g-hero-word inline-block">The</span>{" "}
              <span className="g-hero-word inline-block italic" style={{ color: COBALT }}>quiet</span>{" "}
              <span className="g-hero-word inline-block">art</span>
              <br />
              <span className="g-hero-word inline-block">of</span>{" "}
              <span className="g-hero-word inline-block">filled</span>{" "}
              <span className="g-hero-word inline-block italic">calendars.</span>
            </h1>
            <div className="g-hero-rule mt-10 h-[2px] w-full max-w-[38rem]" style={{ backgroundColor: INKC }} />
            <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
              <p data-hero-g className="max-w-[52ch] text-[17px] leading-[1.8] text-[#524C42] md:text-[18px]">
                We build and run business-development engines for companies that
                want meetings, not noise: targeting, verified pipeline, outreach in
                your voice. This is a gallery of the work — walk the wing.
              </p>
              <p data-hero-g className={`${label} text-[#7C766A]`}>10,000+ leads · 6+ closed · 16 live</p>
            </div>
          </div>
        </section>

        {/* THE WING — horizontal walk; frames hang as you pass */}
        <div ref={wing} className="relative">
          <section className="relative overflow-hidden" style={{ height: "100vh" }}>
            <div className="absolute left-6 top-24 z-10 md:left-10">
              <p className={label} style={{ color: COBALT }}>The client wing</p>
              <h2 className="mt-2 text-3xl md:text-5xl" style={serif}>Who we&apos;ve worked with</h2>
              <div className="g-rule mt-3 h-[2px] w-40" style={{ backgroundColor: INKC }} />
            </div>
            <div ref={track} className="flex h-full items-center gap-10 pl-6 pr-[20vw] pt-24 md:gap-16 md:pl-[34vw]">
              {WORKS.map(([name, tag, note], i) => (
                <article key={i} className="wing-frame group w-[78vw] shrink-0 cursor-default border-2 p-8 transition-shadow duration-500 hover:shadow-[12px_12px_0_rgba(29,78,216,0.15)] md:w-[44vw] md:p-12"
                  style={{ borderColor: INKC, backgroundColor: "#FBF9F4" }}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-mono text-[12px] tracking-[0.2em]" style={{ color: COBALT }}>No. {String(i + 1).padStart(2, "0")}</span>
                    <span className={`${label} text-[#7C766A]`}>{tag}</span>
                  </div>
                  <h3 className="mt-10 leading-[1.05]" style={{ ...serif, fontSize: "clamp(2rem, 4.2vw, 3.6rem)" }}>{name}</h3>
                  <div className="mt-6 h-[2px] w-16 transition-all duration-500 group-hover:w-32" style={{ backgroundColor: COBALT, transitionTimingFunction: "var(--ease-out-quint)" }} />
                  <p className="mt-6 max-w-[44ch] text-[16px] leading-[1.8] text-[#524C42]">{note}</p>
                </article>
              ))}
              <article className="wing-frame w-[78vw] shrink-0 border-2 p-8 md:w-[44vw] md:p-12" style={{ borderColor: COBALT, backgroundColor: COBALT, color: IVORY }}>
                <span className="font-mono text-[12px] tracking-[0.2em]">The ledger</span>
                <div className="mt-10 space-y-7">
                  {[["10,000+", "verified leads generated"], ["6+", "deals closed across engagements"], ["16", "corporate targets in live pipeline"]].map(([n, d]) => (
                    <div key={d}>
                      <div className="tnum leading-none" style={{ ...serif, fontSize: "clamp(2.4rem, 5vw, 4.4rem)" }}>{n}</div>
                      <p className={`${label} mt-1 opacity-80`}>{d}</p>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </section>
        </div>

        {/* PRACTICE */}
        <section className="relative py-32">
          <div className="mx-auto w-full max-w-[1360px] px-6 md:px-10">
            <p data-g className={`hang ${label}`} style={{ color: COBALT }}>The practice</p>
            <h2 className="hang mt-3 max-w-[20ch] text-3xl md:text-5xl" style={serif}>Three rooms, one discipline.</h2>
            <div className="g-rule mt-4 h-[2px] w-40" style={{ backgroundColor: INKC }} />
            <div className="mt-14 grid gap-10 md:grid-cols-3">
              {[["Map", "A deep dive on where your revenue leaks — ICP, geography, decision-makers. The map is yours to keep, engagement or not."],
                ["Build", "Verified buyer lists and an outbound engine in your voice. Every contact a mapped decision-maker, never scraped spam."],
                ["Run", "We operate it. Meetings land on your calendar, reported against the only scoreboard that matters: revenue."]].map(([t, d], i) => (
                <div key={i} className="hang border-l-2 pl-7" style={{ borderColor: i === 1 ? COBALT : "#D8D2C4" }}>
                  <span className="font-mono text-[12px] tracking-[0.2em]" style={{ color: COBALT }}>{["I", "II", "III"][i]}</span>
                  <h3 className="mt-3 text-2xl md:text-3xl" style={serif}>{t}</h3>
                  <p className="mt-4 max-w-[36ch] text-[16px] leading-[1.8] text-[#524C42]">{d}</p>
                </div>
              ))}
            </div>
            <blockquote className="hang mx-auto mt-28 max-w-[26ch] text-center text-3xl leading-[1.3] md:text-4xl" style={serif}>
              &ldquo;Agencies report hours. <span className="italic" style={{ color: COBALT }}>We report pipeline.</span>&rdquo;
            </blockquote>
          </div>
        </section>

        {/* CTA — the invitation card, hung last */}
        <section id="g-cta" className="relative py-32">
          <div className="mx-auto w-full max-w-[860px] px-6">
            <div className="hang border-2 px-8 py-16 text-center md:px-16" style={{ borderColor: INKC, backgroundColor: "#FBF9F4" }}>
              <p className={label} style={{ color: COBALT }}>An invitation</p>
              <h2 className="mt-6 leading-[1.05]" style={{ ...serif, fontSize: "clamp(2.2rem, 5.5vw, 4.2rem)" }}>
                A private viewing of<br />your own pipeline.
              </h2>
              <p className="mx-auto mt-7 max-w-[46ch] text-[17px] leading-[1.8] text-[#524C42]">
                Twenty minutes. We map where your revenue is leaking and what we
                would build first. You keep the map — engagement or not. No deck,
                no pitch theater.
              </p>
              <a data-magnetic href="mailto:a.shaheen7853@gmail.com?subject=PropelBD%20%E2%80%94%20Deep%20dive%20session"
                className="mt-10 inline-flex cursor-pointer items-center gap-3 px-9 py-4 font-mono text-[12px] uppercase tracking-[0.24em] transition-transform duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: INKC, color: IVORY }}>
                Request the viewing
              </a>
              <p className={`${label} mt-8 text-[#7C766A]`}>Replies within one business day</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t py-8" style={{ borderColor: "#D8D2C4" }}>
        <div className="mx-auto flex max-w-[1360px] flex-col items-center gap-2 px-6 text-center md:flex-row md:justify-between md:px-10">
          <span className="font-bold" style={serif}>Propel<span style={{ color: COBALT }}>BD</span></span>
          <span className={`${label} text-[#7C766A]`}>© 2026 · Dubai · Abu Dhabi · worldwide</span>
          <a href="mailto:a.shaheen7853@gmail.com" className={`${label} text-[#7C766A] hover:underline`}>a.shaheen7853@gmail.com</a>
        </div>
      </footer>
    </div>
  );
}
