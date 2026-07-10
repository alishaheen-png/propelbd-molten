import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import { VelocityGapContent } from "@/components/velocity-gap/VelocityGapContent";
import { TrajectoryField } from "@/components/velocity-gap/TrajectoryField";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PropelBD — Velocity Gap",
  description: "You don't need a Head of BD. You need deals. Fractional business development for founders in Dubai and Abu Dhabi.",
  alternates: { canonical: "/velocity-gap" },
};

export default function VelocityGapPage() {
  return (
    <>
      <Nav ctaHref="#contact" ctaText="Book a 20-minute call" />
      <main className="bg-base-deep text-ink-soft pt-16">
        <section className="relative min-h-[calc(100dvh-4rem)] px-4 md:px-6 py-16 md:py-24 overflow-hidden">
          <TrajectoryField />
          <div className="relative z-10 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[70vh]">
            <div className="lg:col-span-5">
              <p className="font-mono text-xs text-accent uppercase tracking-widest mb-6">Velocity Gap</p>
              <h1 className="font-display text-hero font-semibold text-ink leading-[0.95] tracking-tighter max-w-[14ch]">
                You don&apos;t need a Head of BD. You need deals.
              </h1>
              <p className="mt-6 md:mt-8 text-lg md:text-xl text-muted-soft max-w-[45ch] leading-relaxed">
                Fractional business development for founders in Dubai and Abu Dhabi who are done waiting for revenue to happen.
              </p>
              <div className="mt-8 md:mt-10">
                <a
                  href="#contact"
                  className="inline-block font-mono text-sm px-6 py-3 bg-accent text-ink rounded-editorial hover:bg-accent-hover active:scale-[0.98] transition-all"
                >
                  Book a 20-minute call
                </a>
              </div>
            </div>
          </div>
        </section>

        <VelocityGapContent />
      </main>
      <Footer />
    </>
  );
}
