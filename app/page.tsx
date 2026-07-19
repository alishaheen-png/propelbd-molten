import type { Metadata } from "next";
import Landing from "@/components/MachineSite";

export const metadata: Metadata = {
  title: "PropelBD — The Meeting Machine. Watch it run.",
  description:
    "PropelBD installs the AI-powered business-development engine for UAE companies behind on AI. Built, proven, then scaled. We sell results, not deliverables.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "PropelBD — The Meeting Machine. Watch it run.",
    description:
      "AI-powered business development for UAE companies behind on AI. Built, proven, scaled.",
    type: "website",
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
    title: "PropelBD — The Meeting Machine. Watch it run.",
    description: "AI-powered business development for UAE companies behind on AI.",
  },
};

export default function Home() {
  return <Landing />;
}
