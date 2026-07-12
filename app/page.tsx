import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import { DealRoomContent } from "@/components/deal-room/DealRoomContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PropelBD — Revenue is a system. We run it.",
  description:
    "Fractional business development for founders in Dubai and Abu Dhabi. No full-time hires. No deck theater. Just meetings with buyers who can sign.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "PropelBD — Revenue is a system. We run it.",
    description:
      "Fractional BD for founders in Dubai and Abu Dhabi. Meetings with buyers who can sign.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PropelBD — Revenue is a system. We run it.",
    description:
      "Fractional BD for founders in Dubai and Abu Dhabi. Meetings with buyers who can sign.",
  },
};

export default function Home() {
  return (
    <>
      <Nav ctaHref="#contact" ctaText="Show me the pipeline" />
      <main className="bg-base-deep text-ink pt-16 md:pt-20">
        <DealRoomContent />
      </main>
      <Footer />
    </>
  );
}
