import type { Metadata } from "next";
import Landing from "@/components/Landing";

export const metadata: Metadata = {
  title: "PropelBD — The revenue engine your business is missing.",
  description:
    "PropelBD installs the AI-powered business-development engine for UAE companies behind on AI. Built, proven, then scaled. We sell results, not deliverables.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "PropelBD — The revenue engine your business is missing.",
    description:
      "AI-powered business development for UAE companies behind on AI. Built, proven, scaled.",
    type: "website",
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
    title: "PropelBD — The revenue engine your business is missing.",
    description: "AI-powered business development for UAE companies behind on AI.",
  },
};

export default function Home() {
  return <Landing />;
}
