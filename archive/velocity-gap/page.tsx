import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import { VelocityGapContent } from "@/components/velocity-gap/VelocityGapContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PropelBD — Velocity Gap",
  description: "You don't need a Head of BD. You need deals. Fractional business development for founders in Dubai and Abu Dhabi.",
  alternates: { canonical: "/velocity-gap" },
};

export default function VelocityGapPage() {
  return (
    <>
      <Nav ctaHref="#contact" ctaText="Book a call" />
      <main className="bg-base-deep text-ink pt-16 md:pt-20">
        <VelocityGapContent />
      </main>
      <Footer />
    </>
  );
}
