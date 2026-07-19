import Link from "next/link";
export const metadata = { title: "PropelBD — three directions" };
export default function Chooser() {
  const items = [
    ["/royal", "A — ROYAL CIRCUIT", "black x violet · private-bank luxe · silk aurora", "#C4B5FD", "#060508"],
    ["/molten-ultra", "B — MOLTEN ULTRA", "ember rebuilt · molten orb cools as you scroll · white-hot clients chapter", "#FF5A1F", "#0A0908"],
    ["/gallery", "C — THE GALLERY", "ivory x cobalt · light editorial · horizontal client wing", "#1D4ED8", "#F7F4ED"],
  ] as const;
  return (
    <main style={{ minHeight: "100vh", background: "#101010", display: "flex", flexDirection: "column" }}>
      {items.map(([href, t, d, accent, bg]) => (
        <Link key={href} href={href} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "2rem 6vw", background: bg, color: accent, textDecoration: "none", borderBottom: "1px solid #222" }}>
          <span style={{ fontSize: "clamp(1.8rem,4.5vw,3.6rem)", fontWeight: 700 }}>{t}</span>
          <span style={{ marginTop: 8, opacity: 0.75, color: bg === "#F7F4ED" ? "#524C42" : "#bbb", fontSize: 15 }}>{d}</span>
        </Link>
      ))}
    </main>
  );
}
