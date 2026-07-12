"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/* PropelBD — "The Molten Thread" (Fable-5 direction).
   Dark editorial. One weld-bright line ignites in the hero and becomes a scroll-scrubbed
   spine down the page. GSAP ScrollTrigger + Lenis. Cabinet display / General Sans body.
   Anti V3_AUTOPSY: one bespoke direction, real structure (Problem→Engine→Proof), no fake
   testimonial, no pricing, motion is narrative not decoration, reduced-motion safe. */

const ACCENT = "#FF5A1F";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8B8A83]">
      {children}
    </span>
  );
}

export default function Landing() {
  const root = useRef<HTMLDivElement>(null);
  const threadPath = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);

    // reveal fallback: always visible if reduced-motion or JS-light
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set("[data-reveal]", { opacity: 1, y: 0 });
        if (threadPath.current) {
          const len = threadPath.current.getTotalLength();
          threadPath.current.style.strokeDasharray = `${len}`;
          threadPath.current.style.strokeDashoffset = "0";
        }
        return;
      }

      // Lenis smooth scroll wired into ScrollTrigger
      const lenis = new Lenis({ duration: 1.1, smoothWheel: true, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      const ticker = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      // hero ignite
      const nav = gsap.timeline({ delay: 0.25 });
      nav.from("[data-hero]", { opacity: 0, y: 26, duration: 0.9, stagger: 0.09, ease: "power3.out" });
      nav.to(".ignite", { color: ACCENT, textShadow: "0 0 46px rgba(255,90,31,0.55), 0 0 12px rgba(255,90,31,0.7)", duration: 0.9, ease: "power2.out" }, "-=0.35");

      // molten thread draws with scroll (the spine)
      if (threadPath.current) {
        const len = threadPath.current.getTotalLength();
        gsap.set(threadPath.current, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(threadPath.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
        });
      }
      // thread nodes ignite as the spine passes (real molten dots, not SVG-fill-on-span)
      gsap.utils.toArray<HTMLElement>(".node").forEach((n) => {
        gsap.to(n, {
          backgroundColor: ACCENT, scale: 1.4, boxShadow: "0 0 16px rgba(255,90,31,0.9)",
          duration: 0.4, ease: "power2.out",
          scrollTrigger: { trigger: n.dataset.at || root.current, start: "top 70%", toggleActions: "play none none reverse" },
        });
      });

      // section reveals (GSAP vocab, not IntersectionObserver)
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          opacity: 0, y: 26, duration: 0.85, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 86%" },
        });
      });

      // CTA molten pulse when the close scrolls in (Fable P1-11)
      const cta = root.current?.querySelector<HTMLElement>("#contact a");
      if (cta) {
        gsap.to(cta, {
          boxShadow: "0 0 34px rgba(255,90,31,0.35)", repeat: -1, yoyo: true, duration: 2.5, ease: "sine.inOut",
          scrollTrigger: { trigger: "#contact", start: "top 70%" },
        });
      }

      // self-hosted variable fonts shift section heights after triggers measure
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => {
        gsap.ticker.remove(ticker);
        lenis.destroy();
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative min-h-screen bg-[#0B0B0C] text-[#ECEAE3] antialiased overflow-clip">
      {/* atmosphere */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-[0.05] mix-blend-soft-light"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "radial-gradient(120% 70% at 82% -8%, rgba(255,90,31,0.11), transparent 55%)" }} />

      {/* THE MOLTEN THREAD — fixed spine, drawn by scroll */}
      <svg aria-hidden className="pointer-events-none fixed left-[max(0.75rem,calc(50%-590px))] top-0 z-20 hidden h-screen w-[64px] md:block" viewBox="0 0 64 1000" preserveAspectRatio="none">
        <defs>
          <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d="M32 0 L32 120 C32 170 12 190 12 240 C12 300 52 320 52 380 C52 450 20 470 20 540 C20 620 44 640 44 720 C44 800 32 820 32 900 L32 1000"
          fill="none" stroke="#2A2A2E" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <path ref={threadPath}
          d="M32 0 L32 120 C32 170 12 190 12 240 C12 300 52 320 52 380 C52 450 20 470 20 540 C20 620 44 640 44 720 C44 800 32 820 32 900 L32 1000"
          fill="none" stroke={ACCENT} strokeWidth="2" vectorEffect="non-scaling-stroke" filter="url(#glow)" strokeLinecap="round" />
      </svg>

      {/* NAV */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#161619] bg-[#0B0B0C]/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="font-display text-lg font-bold tracking-tight">Propel<span style={{ color: ACCENT }}>BD</span></a>
          <a href="#contact" className="group inline-flex items-center gap-2 border border-[#2A2A2E] px-4 py-2 font-mono text-[12px] uppercase tracking-[0.16em] transition-colors duration-200 hover:border-[#FF5A1F] cursor-pointer">
            Book a teardown <span className="transition-transform group-hover:translate-x-0.5" style={{ color: ACCENT }}>→</span>
          </a>
        </div>
      </nav>

      <main id="top" className="relative z-10 mx-auto max-w-[1180px] px-5 md:px-8 md:pl-24">
        {/* HERO */}
        <section className="flex min-h-[92dvh] flex-col justify-center pt-28 pb-16">
          <div data-hero><Label>Fractional AI-BD · Dubai · Abu Dhabi</Label></div>
          <h1 data-hero className="mt-6 font-display font-bold leading-[0.95] tracking-[-0.02em]" style={{ fontSize: "clamp(2.7rem, 8vw, 6.6rem)" }}>
            The revenue engine<br />your business is<br /><span className="ignite">missing.</span>
          </h1>
          <p data-hero className="mt-8 max-w-[42ch] text-[17px] leading-relaxed text-[#B8B6AE] md:text-[19px]">
            PropelBD installs the AI-powered business-development engine for UAE companies
            behind on AI — lead-gen, outreach, sales, the backend strategy. We build it,
            prove it works, then it runs.
          </p>
          <div data-hero className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3.5 font-mono text-[13px] uppercase tracking-[0.14em] text-[#0B0B0C] transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer" style={{ backgroundColor: ACCENT }}>
              Book a revenue teardown →
            </a>
            <a href="#how" className="font-mono text-[13px] uppercase tracking-[0.14em] text-[#8B8A83] underline-offset-4 hover:text-[#ECEAE3] hover:underline cursor-pointer">See the engine</a>
          </div>
        </section>

        <Rule />

        {/* PROBLEM (new) */}
        <section className="py-24 md:py-32">
          <span className="node mb-5 block h-2.5 w-2.5 rounded-full bg-[#3A2A20]" data-at="#problem-h" /><div data-reveal><Label>01 — The problem</Label></div>
          <h2 id="problem-h" data-reveal className="mt-6 max-w-[18ch] font-display font-bold leading-[1.02] tracking-[-0.02em]" style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)" }}>
            Your pipeline runs on <span className="text-[#6E6D67]">referrals and luck.</span>
          </h2>
          <div className="mt-12 border-t border-[#1C1C1F]">
            {[
              ["No system", "New business shows up when someone remembers you. There’s no engine underneath it."],
              ["Behind on AI", "The tools that could find and warm your next 100 buyers exist — you just haven’t deployed them."],
              ["No time to build", "You could figure it out. But you’re running the business, not building a revenue engine."],
            ].map(([t, d], i) => (
              <div key={i} data-reveal className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 border-b border-[#1C1C1F] py-7 md:grid-cols-[3.5rem_15rem_1fr] md:gap-x-10 md:py-9">
                <div className="font-mono text-[13px] text-[#6E6D67]">{String(i + 1).padStart(2, "0")}</div>
                <div className="font-display text-lg font-semibold tracking-tight md:text-xl">{t}</div>
                <p className="col-start-2 text-[15px] leading-relaxed text-[#B8B6AE] md:col-start-3 md:text-[15.5px]">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <Rule />

        {/* ENGINE (new — show the product) */}
        <section className="py-24 md:py-32">
          <span className="node mb-5 block h-2.5 w-2.5 rounded-full bg-[#3A2A20]" data-at="#engine-h" /><div data-reveal><Label>02 — The engine</Label></div>
          <h2 id="engine-h" data-reveal className="mt-6 max-w-[20ch] font-display font-bold leading-[1.02] tracking-[-0.02em]" style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)" }}>
            One system. <span style={{ color: ACCENT }}>Five moving parts.</span>
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden rounded-none border border-[#1C1C1F] bg-[#1C1C1F] md:grid-cols-5">
            {[
              ["Targeting", "ICP, geography, STP — who to chase and why."],
              ["Lead-gen", "Verified pipeline, not scraped guesses."],
              ["Outreach", "Sequences that get replies, built to your voice."],
              ["Sales", "Trained to close what the engine surfaces."],
              ["Backend", "The strategy and data that keeps it compounding."],
            ].map(([t, d], i) => (
              <div key={i} data-reveal className="bg-[#0B0B0C] p-6 transition-colors duration-300 hover:bg-[#101012]">
                <div className="font-mono text-[12px]" style={{ color: ACCENT }}>{String(i + 1).padStart(2, "0")}</div>
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">{t}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[#9A988F]">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <Rule />

        {/* WEDGE (fixed — accountability, not comp-model) */}
        <section id="how" className="py-24 md:py-32">
          <span className="node mb-5 block h-2.5 w-2.5 rounded-full bg-[#3A2A20]" data-at="#wedge-h" /><div data-reveal><Label>03 — Why us</Label></div>
          <div id="wedge-h" className="mt-10 space-y-6 md:space-y-8">
            {[
              ["Agencies report hours.", "We report pipeline."],
              ["We’re not measured on decks —", "we’re measured on meetings that land."],
              ["Your revenue", "is the only scoreboard."],
            ].map(([a, b], i) => (
              <p key={i} data-reveal className="font-display font-semibold leading-[1.05] tracking-[-0.015em]" style={{ fontSize: "clamp(1.8rem, 4.4vw, 3.4rem)" }}>
                <span className="text-[#6E6D67]">{a}</span> <span className="text-[#ECEAE3]">{b}</span>
              </p>
            ))}
          </div>
        </section>

        <Rule />

        {/* PROOF (SupperClub — real framing, NO fabricated quote) */}
        <section className="py-24 md:py-32">
          <span className="node mb-5 block h-2.5 w-2.5 rounded-full bg-[#3A2A20]" data-at="#proof-h" /><div data-reveal><Label>04 — Proof</Label></div>
          <h2 id="proof-h" data-reveal className="mt-6 font-display font-bold leading-[1.02] tracking-[-0.02em]" style={{ fontSize: "clamp(2rem, 4.6vw, 3.4rem)" }}>
            We built the engine for <span style={{ color: ACCENT }}>SupperClub</span>.
          </h2>
          <p data-reveal className="mt-6 max-w-[52ch] text-[16px] leading-relaxed text-[#B8B6AE]">
            A UAE business that was behind on AI. We stood up the outbound engine, the
            targeting, and the corporate-membership pipeline — and the meetings started
            landing. The same playbook we install for you.
          </p>
          <div data-reveal className="mt-12 grid gap-px overflow-hidden border border-[#1C1C1F] bg-[#1C1C1F] sm:grid-cols-3">
            {[
              ["16", "corporate targets in live pipeline"],
              ["1st", "corporate membership deal closed"],
              ["321", "verified decision-makers surfaced"],
            ].map(([n, d]) => (
              <div key={n} className="bg-[#0B0B0C] p-7">
                <div className="font-display text-4xl font-bold tracking-tight md:text-5xl" style={{ color: ACCENT }}>{n}</div>
                <p className="mt-3 text-[13.5px] leading-relaxed text-[#9A988F]">{d}</p>
              </div>
            ))}
          </div>
          <p data-reveal className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[#6E6D67]">
            Anchor client · full case detail on request
          </p>
        </section>

        <Rule />

        {/* WHO */}
        <section className="py-24 md:py-32">
          <span className="node mb-5 block h-2.5 w-2.5 rounded-full bg-[#3A2A20]" data-at="#who-h" /><div data-reveal><Label>05 — Who it’s for</Label></div>
          <h2 id="who-h" data-reveal className="mt-6 max-w-[24ch] font-display font-bold leading-[1.02] tracking-[-0.02em]" style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)" }}>
            UAE companies <span className="text-[#6E6D67]">behind on AI.</span>
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {[
              ["You’re in", "Real revenue, real customers, a business worth scaling — but the pipeline still runs on referrals."],
              ["You know", "AI could find and warm buyers you don’t reach today. You just don’t have the system, or the time to build it."],
            ].map(([t, d], i) => (
              <div key={i} data-reveal>
                <div className="font-mono text-[12px] uppercase tracking-[0.18em]" style={{ color: ACCENT }}>{t}</div>
                <p className="mt-4 text-[15px] leading-relaxed text-[#B8B6AE]">{d}</p>
              </div>
            ))}
          </div>
          <div data-reveal className="mt-8 flex flex-col gap-2 border-t border-[#1C1C1F] pt-8 md:flex-row md:items-baseline md:gap-10">
            <div className="shrink-0 font-mono text-[12px] uppercase tracking-[0.18em] text-[#8B8A83]">Not for you</div>
            <p className="max-w-[60ch] text-[15px] leading-relaxed text-[#8B8A83]">
              A funded AI-native startup that already lives in this world. That’s not who we’re for.
            </p>
          </div>
        </section>

        <Rule />

        {/* FOUNDER (new — a human for the trust buy) */}
        <section className="py-24 md:py-32">
          <span className="node mb-5 block h-2.5 w-2.5 rounded-full bg-[#3A2A20]" data-at="#founder-h" /><div data-reveal><Label>06 — Who builds it</Label></div>
          <div className="mt-10 grid gap-10 md:grid-cols-[auto_1fr] md:items-center md:gap-14">
            <div data-reveal className="flex h-28 w-28 items-center justify-center border border-[#26262A] font-display text-3xl font-bold text-[#6E6D67]">AS</div>
            <div data-reveal>
              <h3 id="founder-h" className="font-display text-2xl font-semibold tracking-tight md:text-3xl">Ali Shaheen</h3>
              <p className="mt-4 max-w-[54ch] text-[16px] leading-relaxed text-[#B8B6AE]">
                Hands-on fractional operator. I don’t hand you a strategy and disappear — I build
                the engine, run it until it works, and stay in it. One client at a time, no agency
                bloat, no theater.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="py-28 md:py-40">
          <div data-reveal className="border border-[#26262A] p-10 md:p-16" style={{ background: "linear-gradient(180deg, #101012 0%, #0B0B0C 100%)" }}>
            <h2 className="max-w-[18ch] font-display font-bold leading-[1.0] tracking-[-0.02em]" style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.2rem)" }}>
              Let’s build your <span style={{ color: ACCENT }}>engine.</span>
            </h2>
            <p className="mt-6 max-w-[44ch] text-[17px] leading-relaxed text-[#B8B6AE]">
              A short, specific conversation about where your revenue is leaking and what
              we’d build first. No deck. No pitch theater.
            </p>
            <a href="mailto:alishaheen@supperclubme.com?subject=PropelBD%20%E2%80%94%20Revenue%20teardown" className="mt-10 inline-flex items-center gap-2 px-7 py-4 font-mono text-[13px] uppercase tracking-[0.14em] text-[#0B0B0C] transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer" style={{ backgroundColor: ACCENT }}>
              Book a revenue teardown →
            </a>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#161619]">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="font-display text-base font-bold">Propel<span style={{ color: ACCENT }}>BD</span></div>
          <div className="font-display text-[15px] italic text-[#8B8A83]">Your business, rebuilt to scale.</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#6E6D67]">© {new Date().getFullYear()} PropelBD · Dubai · Abu Dhabi</div>
        </div>
      </footer>
    </div>
  );
}

function Rule() {
  return <div className="h-px w-full bg-[#161619]" />;
}
