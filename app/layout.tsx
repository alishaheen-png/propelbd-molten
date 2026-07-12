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
  metadataBase: new URL("https://propelbd.com"),
  title: "PropelBD — Fractional Business Development",
  description: "Revenue is a system. We run it. Fractional BD for founders in Dubai and Abu Dhabi.",
  openGraph: {
    title: "PropelBD — Fractional Business Development",
    description: "Revenue is a system. We run it.",
    type: "website",
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
    title: "PropelBD — Fractional Business Development",
    description: "Revenue is a system. We run it.",
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
  return (
    <html lang="en" className={`${cabinet.variable} ${generalSans.variable} ${jetbrains.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
