export function Footer({ markets = "Dubai · Abu Dhabi" }: { markets?: string }) {
  return (
    <footer className="bg-base border-t border-border py-12 px-4 md:px-6">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="font-display text-lg font-semibold text-ink">PropelBD</p>
          <p className="font-mono text-xs text-muted mt-1">Fractional business development</p>
        </div>
        <p className="font-mono text-xs text-muted">{markets}</p>
      </div>
    </footer>
  );
}
