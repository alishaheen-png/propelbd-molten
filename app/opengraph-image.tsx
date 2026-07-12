import { ImageResponse } from "next/og";

export const alt = "PropelBD — The revenue engine your business is missing.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0B0C",
          backgroundImage: "radial-gradient(120% 70% at 82% -8%, rgba(255,90,31,0.16), transparent 55%)",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#ECEAE3", letterSpacing: -0.5 }}>
          Propel<span style={{ color: "#FF5A1F" }}>BD</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 82, fontWeight: 800, color: "#ECEAE3", lineHeight: 1.02, letterSpacing: -2, maxWidth: 900 }}>
            The revenue engine your business is <span style={{ color: "#FF5A1F" }}>missing.</span>
          </div>
          <div style={{ marginTop: 28, fontSize: 26, color: "#B8B6AE", maxWidth: 820 }}>
            AI-powered business development for UAE companies behind on AI. Built, proven, then scaled.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 20, color: "#8B8A83", letterSpacing: 2, textTransform: "uppercase" }}>
          Fractional AI-BD · Dubai · Abu Dhabi
        </div>
      </div>
    ),
    { ...size }
  );
}
