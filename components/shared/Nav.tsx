"use client";

import Link from "next/link";

export function Nav({ ctaHref = "#contact", ctaText = "Book a call" }: { ctaHref?: string; ctaText?: string }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-base/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-lg font-semibold text-ink tracking-tight">
          PropelBD
        </Link>
        <a
          href={ctaHref}
          className="font-mono text-xs md:text-sm px-4 py-2 bg-accent text-ink rounded-editorial hover:bg-accent-hover active:scale-[0.98] transition-all"
        >
          {ctaText}
        </a>
      </div>
    </header>
  );
}
