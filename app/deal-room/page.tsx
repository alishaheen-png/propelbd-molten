import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import { BentoBoard } from "@/components/deal-room/BentoBoard";
import { DealRoomContent } from "@/components/deal-room/DealRoomContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PropelBD — The Deal Room",
  description: "Revenue is a system. We run it. No full-time hires. No deck theater. Just meetings with buyers who can sign.",
  alternates: { canonical: "/deal-room" },
};

export default function DealRoomPage() {
  return (
    <>
      <Nav ctaHref="#contact" ctaText="Show me the pipeline" />
      <main className="bg-base text-ink pt-16">
        <section className="min-h-[calc(100dvh-4rem)] px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-5">
              <p className="font-mono text-xs text-accent uppercase tracking-widest mb-6">The Deal Room</p>
              <h1 className="font-display text-hero font-semibold text-ink leading-[0.95] tracking-tighter max-w-[14ch]">
                Revenue is a system. We run it.
              </h1>
              <p className="mt-6 md:mt-8 text-lg md:text-xl text-muted max-w-[45ch] leading-relaxed">
                No full-time hires. No deck theater. Just meetings with buyers who can sign.
              </p>
              <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#contact"
                  className="inline-block font-mono text-sm px-6 py-3 bg-accent text-ink rounded-editorial hover:bg-accent-hover active:scale-[0.98] transition-all"
                >
                  Show me the pipeline
                </a>
                <a href="#how" className="font-mono text-sm text-muted hover:text-ink transition-colors">
                  See how it works
                </a>
              </div>
            </div>
            <div className="lg:col-span-7 flex justify-center lg:justify-end">
              <BentoBoard />
            </div>
          </div>
        </section>

        <DealRoomContent />
      </main>
      <Footer />
    </>
  );
}
