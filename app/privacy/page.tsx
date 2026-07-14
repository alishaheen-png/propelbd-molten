import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy — PropelBD",
  description: "PropelBD privacy policy.",
  robots: { index: false },
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <main className="mx-auto min-h-screen max-w-[720px] bg-[#0B0B0C] px-6 py-24 text-[#C9C7BF]">
      <Link href="/" className="font-mono text-[12px] uppercase tracking-[0.16em] text-[#A5A39B] hover:text-[#ECEAE3]">← PropelBD</Link>
      <h1 className="mt-8 font-display text-3xl font-bold text-[#ECEAE3]">Privacy</h1>
      <div className="mt-8 space-y-5 text-[16px] leading-[1.75]">
        <p>PropelBD keeps this simple, the same way we run everything else.</p>
        <p><strong className="text-[#ECEAE3]">This site sets no cookies and runs no tracking.</strong> No analytics scripts, no pixels, no fingerprinting. Your visit is your business.</p>
        <p>If you email us, we use your email address and what you write to reply to you and, if we end up working together, to do the work. We do not sell, rent, or share your details with anyone.</p>
        <p>Want anything we hold about you deleted? One email: <a className="underline underline-offset-4" href="mailto:a.shaheen7853@gmail.com">a.shaheen7853@gmail.com</a>.</p>
        <p className="pt-4 font-mono text-[12px] uppercase tracking-[0.16em] text-[#77756D]">PropelBD · Dubai · Abu Dhabi · Last updated July 2026</p>
      </div>
    </main>
  );
}
