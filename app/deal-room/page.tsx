import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import { DealRoomContent } from "@/components/deal-room/DealRoomContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PropelBD — The Deal Room",
  description: "Revenue is a system. We run it. Fractional BD for founders in Dubai and Abu Dhabi.",
  alternates: { canonical: "/deal-room" },
};

export default function DealRoomPage() {
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
