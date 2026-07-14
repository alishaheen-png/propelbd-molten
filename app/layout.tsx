import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Self-hosted per V3_AUTOPSY #4 (kill the single generic web-font look).
const cabinet = localFont({
  src: "../public/fonts/CabinetGrotesk-Variable.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "100 900",
});

const generalSans = localFont({
  src: "../public/fonts/GeneralSans-Variable.woff2",
  variable: "--font-body",
  display: "swap",
  weight: "200 700",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://propelbd.ai"),
  title: "PropelBD — The revenue engine your business is missing.",
  description: "PropelBD installs the AI-powered business-development engine for UAE companies behind on AI. We build it, prove it works, then it runs.",
  openGraph: {
    title: "PropelBD — The revenue engine your business is missing.",
    description: "We build it, prove it works, then it runs.",
    type: "website",
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
    title: "PropelBD — The revenue engine your business is missing.",
    description: "We build it, prove it works, then it runs.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD LocalBusiness (ProfessionalService deprecated per schema.org) — static literal, no dynamic content (SEO ship item)
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "PropelBD",
    description:
      "Fractional AI-powered business development for UAE companies: lead generation, outreach, sales, and the backend strategy. Built, proven, then run.",
    url: "https://propelbd.ai",
    areaServed: [
      { "@type": "City", name: "Dubai" },
      { "@type": "City", name: "Abu Dhabi" },
    ],
    knowsAbout: ["business development", "lead generation", "B2B outbound", "AI sales systems"],
  });

  return (
    <html lang="en" className={`${cabinet.variable} ${generalSans.variable} ${jetbrains.variable}`}>
      <body className="antialiased">
        {/* static compile-time literal — no user input, hydration-safe via innerHTML */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        {children}
      </body>
    </html>
  );
}
