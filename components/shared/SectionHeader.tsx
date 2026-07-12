export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "right" | "center";
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : align === "right" ? "md:ml-auto md:text-right" : "";
  return (
    <div className={`mb-12 md:mb-20 max-w-[55ch] ${alignClass}`}>
      <p className="text-xs uppercase tracking-[0.12em] text-accent mb-4">{eyebrow}</p>
      <h2 className="font-display text-display font-semibold text-ink">{title}</h2>
      {subtitle && <p className="mt-4 text-muted leading-relaxed">{subtitle}</p>}
    </div>
  );
}
