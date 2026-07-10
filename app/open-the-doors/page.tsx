import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import { OpenTheDoorsContent } from "@/components/open-the-doors/OpenTheDoorsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PropelBD — Open The Doors",
  description: "Revenue growth without the full-time hire. Fractional BD for founders in Dubai and Abu Dhabi.",
  alternates: { canonical: "/open-the-doors" },
};

export default function OpenTheDoorsPage() {
  return (
    <>
      <Nav ctaHref="#contact" ctaText="Show us the deal" />
      <main className="bg-base-door text-ink-door pt-16">
        <OpenTheDoorsContent />
      </main>
      <Footer />
    </>
  );
}
