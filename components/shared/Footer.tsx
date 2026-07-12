export function Footer({ markets = "Dubai · Abu Dhabi" }: { markets?: string }) {
  return (
    <footer className="bg-base-deep border-t border-border py-12 md:py-16 px-4 md:px-6">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="font-display text-2xl md:text-3xl font-semibold text-ink">PropelBD</p>
          <p className="text-muted mt-2 max-w-[40ch]">Fractional business development for founders in Dubai and Abu Dhabi.</p>
        </div>
        <div className="text-left md:text-right">
          <p className="font-mono text-xs text-muted">{markets}</p>
          <a href="mailto:ali@propelbd.co" className="font-mono text-xs text-accent hover:text-accent-bright transition-colors mt-1 inline-block">
            ali@propelbd.co
          </a>
        </div>
      </div>
    </footer>
  );
}
