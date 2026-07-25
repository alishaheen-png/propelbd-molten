import type { Metadata } from "next";
import Landing from "@/components/Landing";

// Preview-only route for the REAL molten site (Landing.tsx + MoltenOrganism.tsx).
// Added solely so this build can be dev-served and screenshot-verified without
// touching the root chooser (app/page.tsx) or the other TRIO sites (royal,
// molten-ultra, gallery). Safe to remove or promote to root later — Ali's call.
export const metadata: Metadata = {
  title: "PropelBD — The revenue engine your business is missing.",
  description:
    "PropelBD installs the AI-powered business-development engine for UAE companies behind on AI. Built, proven, then scaled.",
};

export default function MoltenRealPreview() {
  return <Landing />;
}
