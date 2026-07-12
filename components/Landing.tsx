"use client";

import { useEffect, useState } from "react";

/* PropelBD — dark editorial / industrial. Warm near-black + bone + one molten-signal accent.
   Cabinet Grotesk display, General Sans body, JetBrains mono labels. Anti V3_AUTOPSY:
   one bespoke direction, real proof (no fake dashboards), varied intentional motion, zero pricing. */

const ACCENT = "#FF5A1F";

function useReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // progressive enhancement: only hide+animate when JS is live (content is visible by default -> no blank page)
    document.documentElement.classList.add("js");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (reduce) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8B8A83]">
      {children}
    </span>
  );
}

export default function Landing() {
  useReveal();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0B0B0C] text-[#ECEAE3] antialiased overflow-clip">
      {/* grain + vignette atmosphere */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-[0.05] mix-blend-soft-light"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "radial-gradient(120% 80% at 78% -10%, rgba(255,90,31,0.10), transparent 55%)" }} />

      {/* NAV */}
      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "backdrop-blur-md bg-[#0B0B0C]/70 border-b border-[#1C1C1F]" : "border-b border-transparent"}`}>
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="font-display text-lg font-bold tracking-tight">
            Propel<span style={{ color: ACCENT }}>BD</span>
          </a>
          <a href="#contact"
            className="group inline-flex items-center gap-2 border border-[#2A2A2E] px-4 py-2 font-mono text-[12px] uppercase tracking-[0.16em] text-[#ECEAE3] transition-colors duration-200 hover:border-[#FF5A1F] cursor-pointer">
            Book a teardown
            <span className="transition-transform duration-200 group-hover:translate-x-0.5" style={{ color: ACCENT }}>→</span>
          </a>
        </div>
      </nav>

      <main id="top" className="relative z-10 mx-auto max-w-[1200px] px-5 md:px-8">
        {/* HERO */}
        <section className="flex min-h-[92vh] flex-col justify-center pt-28 pb-20">
          <div data-reveal className="reveal">
            <Label>Fractional AI-BD · Dubai · Abu Dhabi</Label>
          </div>
          <h1 data-reveal className="reveal mt-6 font-display font-bold leading-[0.95] tracking-[-0.02em]"
            style={{ fontSize: "clamp(2.7rem, 8vw, 6.5rem)" }}>
            The revenue engine
            <br />
            your business is
            <br />
            <span style={{ color: ACCENT }}>missing.</span>
          </h1>
          <p data-reveal className="reveal mt-8 max-w-[42ch] text-[17px] leading-relaxed text-[#B8B6AE] md:text-[19px]"
            style={{ transitionDelay: "80ms" }}>
            PropelBD installs the AI-powered business-development engine for UAE companies
            behind on AI — lead-gen, outreach, sales, the backend strategy. We build it,
            prove it works, then it runs.
          </p>
          <div data-reveal className="reveal mt-10 flex flex-wrap items-center gap-4" style={{ transitionDelay: "160ms" }}>
            <a href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 font-mono text-[13px] uppercase tracking-[0.14em] text-[#0B0B0C] transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer"
              style={{ backgroundColor: ACCENT }}>
              Book a revenue teardown →
            </a>
            <a href="#how" className="font-mono text-[13px] uppercase tracking-[0.14em] text-[#8B8A83] underline-offset-4 hover:text-[#ECEAE3] hover:underline cursor-pointer">
              See how it works
            </a>
          </div>
        </section>

        <Rule />

        {/* WEDGE */}
        <section className="py-24 md:py-32">
          <div data-reveal className="reveal"><Label>01 — Why us</Label></div>
          <div className="mt-10 space-y-6 md:space-y-8">
            {[
              ["Agencies invoice for hours.", "We invoice for revenue."],
              ["We don’t sell decks —", "we sell the check."],
              ["Your growth", "is our only deliverable."],
            ].map(([a, b], i) => (
              <p key={i} data-reveal className="reveal font-display font-semibold leading-[1.05] tracking-[-0.015em]"
                style={{ fontSize: "clamp(1.8rem, 4.4vw, 3.4rem)", transitionDelay: `${i * 70}ms` }}>
                <span className="text-[#6E6D67]">{a}</span> <span className="text-[#ECEAE3]">{b}</span>
              </p>
            ))}
          </div>
        </section>

        <Rule />

        {/* HOW IT WORKS */}
        <section id="how" className="py-24 md:py-32">
          <div data-reveal className="reveal"><Label>02 — How it works</Label></div>
          <h2 data-reveal className="reveal mt-6 max-w-[20ch] font-display font-bold leading-[1.0] tracking-[-0.02em]"
            style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)" }}>
            Built, proven, then scaled.
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden border border-[#1C1C1F] bg-[#1C1C1F] md:grid-cols-3">
            {[
              ["01", "Build the engine", "We install the AI-powered BD system your business doesn’t have — targeting, outreach, sequences, the backend strategy."],
              ["02", "Prove it works", "Real pipeline, real meetings, real numbers — before anything scales. No theater."],
              ["03", "Scale the results", "The engine runs and compounds. You keep the system, the data, and the momentum."],
            ].map(([n, t, d], i) => (
              <div key={i} data-reveal className="reveal group bg-[#0B0B0C] p-8 transition-colors duration-300 hover:bg-[#101012] md:p-10"
                style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="font-mono text-[13px]" style={{ color: ACCENT }}>{n}</div>
                <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">{t}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#9A988F]">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <Rule />

        {/* PROOF — SupperClub (real, no fake dashboards) */}
        <section className="py-24 md:py-32">
          <div data-reveal className="reveal"><Label>03 — Proof</Label></div>
          <div className="mt-10 grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
            <div>
              <h2 data-reveal className="reveal font-display font-bold leading-[1.02] tracking-[-0.02em]"
                style={{ fontSize: "clamp(2rem, 4.6vw, 3.4rem)" }}>
                We built the engine
                <br />for <span style={{ color: ACCENT }}>SupperClub</span>.
              </h2>
              <p data-reveal className="reveal mt-6 max-w-[46ch] text-[16px] leading-relaxed text-[#B8B6AE]" style={{ transitionDelay: "80ms" }}>
                A UAE business that was behind on AI. We stood up the outbound engine, the
                targeting, the corporate-membership pipeline — and the meetings started
                landing. Same playbook we install for you.
              </p>
            </div>
            <div data-reveal className="reveal self-end border-l border-[#26262A] pl-8" style={{ transitionDelay: "120ms" }}>
              <blockquote className="font-display text-xl leading-snug text-[#ECEAE3] md:text-2xl">
                “They didn’t hand us a strategy deck. They built the thing and made it work.”
              </blockquote>
              <div className="mt-5 font-mono text-[12px] uppercase tracking-[0.16em] text-[#8B8A83]">
                SupperClub — anchor client
              </div>
            </div>
          </div>
        </section>

        <Rule />

        {/* WHO IT'S FOR */}
        <section className="py-24 md:py-32">
          <div data-reveal className="reveal"><Label>04 — Who it’s for</Label></div>
          <h2 data-reveal className="reveal mt-6 max-w-[24ch] font-display font-bold leading-[1.02] tracking-[-0.02em]"
            style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)" }}>
            UAE companies <span className="text-[#6E6D67]">behind on AI.</span>
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              ["You’re in", "Real revenue, real customers, a business worth scaling — but your pipeline still runs on referrals and gut feel."],
              ["You know", "AI could transform how you find and close business. You just don’t have the system, or the time to build it."],
              ["You’re not", "A funded AI-native startup that already lives in this world. That’s not who we’re for."],
            ].map(([t, d], i) => (
              <div key={i} data-reveal className="reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                <div className="font-mono text-[12px] uppercase tracking-[0.18em]" style={{ color: i === 2 ? "#6E6D67" : ACCENT }}>{t}</div>
                <p className="mt-4 text-[15px] leading-relaxed text-[#B8B6AE]">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="py-28 md:py-40">
          <div data-reveal className="reveal rounded-none border border-[#26262A] p-10 md:p-16"
            style={{ background: "linear-gradient(180deg, #101012 0%, #0B0B0C 100%)" }}>
            <h2 className="max-w-[18ch] font-display font-bold leading-[1.0] tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.2rem)" }}>
              Let’s build your <span style={{ color: ACCENT }}>engine.</span>
            </h2>
            <p className="mt-6 max-w-[44ch] text-[17px] leading-relaxed text-[#B8B6AE]">
              A short, specific conversation about where your revenue is leaking and what
              we’d build first. No deck. No pitch theater.
            </p>
            <a href="mailto:ali@propelbd.com"
              className="mt-10 inline-flex items-center gap-2 px-7 py-4 font-mono text-[13px] uppercase tracking-[0.14em] text-[#0B0B0C] transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer"
              style={{ backgroundColor: ACCENT }}>
              Book a revenue teardown →
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[#1C1C1F]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="font-display text-base font-bold">Propel<span style={{ color: ACCENT }}>BD</span></div>
          <div className="font-display text-[15px] italic text-[#8B8A83]">Your business, rebuilt to scale.</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#6E6D67]">
            © {new Date().getFullYear()} PropelBD · Dubai · Abu Dhabi
          </div>
        </div>
      </footer>

      <style>{`
        .reveal { opacity: 1; transform: none; }
        .js .reveal { opacity: 0; transform: translateY(22px); transition: opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1); }
        .js .reveal.is-in { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) { .js .reveal { opacity: 1; transform: none; transition: none; } }
      `}</style>
    </div>
  );
}

function Rule() {
  return <div className="h-px w-full bg-[#1C1C1F]" />;
}
