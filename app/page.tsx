import Link from "next/link";

const sites = [
  {
    path: "/deal-room",
    name: "The Deal Room",
    description: "A live revenue command center. Asymmetric bento board, kinetic type, real UI artifacts.",
    tag: "D2",
  },
  {
    path: "/velocity-gap",
    name: "Velocity Gap",
    description: "The distance between today's revenue and next quarter's potential. Trajectory-field motion.",
    tag: "A2",
  },
  {
    path: "/open-the-doors",
    name: "Open The Doors",
    description: "BD as architecture of access. Cinematic scroll-activated rooms and locked doors.",
    tag: "E2",
  },
];

export default function Home() {
  return (
    <main className="min-h-[100dvh] bg-base flex flex-col justify-center px-6 py-24">
      <div className="max-w-[1400px] mx-auto w-full">
        <header className="mb-20">
          <p className="font-mono text-sm text-muted mb-4">PropelBD Website Concepts — v3</p>
          <h1 className="font-display text-hero font-semibold text-ink max-w-[18ch] leading-[0.95] tracking-tighter">
            Three ways to run revenue.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted max-w-[55ch] leading-relaxed">
            Built to ship. No fabricated numbers. No pricing theater. Three distinct landing-page systems for PropelBD.
          </p>
        </header>

        <nav className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sites.map((site) => (
            <Link
              key={site.path}
              href={site.path}
              className="group block p-6 md:p-8 bg-surface border border-border rounded-editorial hover:border-accent transition-colors duration-300"
            >
              <span className="font-mono text-xs text-accent mb-6 block">{site.tag}</span>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-3 group-hover:text-accent transition-colors">
                {site.name}
              </h2>
              <p className="text-muted leading-relaxed text-sm md:text-base">{site.description}</p>
            </Link>
          ))}
        </nav>

        <footer className="mt-20 pt-8 border-t border-border">
          <p className="font-mono text-xs text-muted">
            © {new Date().getFullYear()} PropelBD. Dubai · Abu Dhabi.
          </p>
        </footer>
      </div>
    </main>
  );
}
