import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0A1422",
          deep: "#050C18",
          door: "#061029",
        },
        surface: {
          DEFAULT: "#0E1726",
          elevated: "#162238",
          soft: "#0E1829",
          muted: "#142338",
          door: "#0B1A3A",
        },
        accent: {
          DEFAULT: "#2357C4",
          hover: "#3A71E0",
          bright: "#4A7FD9",
          light: "#5E8BFF",
        },
        ink: {
          DEFAULT: "#F4F6FA",
          soft: "#F0F4FA",
          door: "#F4F7FC",
        },
        muted: {
          DEFAULT: "#6B7B8F",
          soft: "#8DA3C1",
          door: "#C7D4E8",
        },
        border: {
          DEFAULT: "#1E324E",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Cabinet Grotesk", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "General Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      fontSize: {
        "hero": ["clamp(3rem, 9vw, 8rem)", { lineHeight: "0.98", letterSpacing: "-0.02em" }],
        "hero-sm": ["clamp(2.5rem, 7vw, 5.5rem)", { lineHeight: "0.98", letterSpacing: "-0.02em" }],
        "display": ["clamp(2.25rem, 4.5vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "index": ["clamp(4rem, 12vw, 10rem)", { lineHeight: "0.85", letterSpacing: "-0.03em" }],
      },
      spacing: {
        "section": "clamp(5rem, 12vw, 10rem)",
        "section-lg": "clamp(7rem, 16vw, 14rem)",
      },
      borderRadius: {
        "editorial": "2px",
      },
      transitionTimingFunction: {
        "expo-out": "cubic-bezier(0.19, 1, 0.22, 1)",
        "smooth-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
