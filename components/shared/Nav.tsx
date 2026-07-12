"use client";

import Link from "next/link";

export function Nav({ ctaHref = "#contact", ctaText = "Book a call" }: { ctaHref?: string; ctaText?: string }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        <Link href="/" className="font-display text-lg md:text-xl font-semibold text-ink tracking-tight">
          PropelBD
        </Link>
        <a
          href={ctaHref}
          className="font-display text-sm md:text-base px-4 py-2 md:px-5 md:py-2.5 bg-ink text-base rounded-editorial hover:bg-ink/90 active:scale-[0.98] transition-all"
        >
          {ctaText}
        </a>
      </div>
    </header>
  );
}
