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
        // PropelBD navy/blue kinetic — NOT gold
        base: {
          DEFAULT: "#0A1422",
          deep: "#08101F",
          door: "#061029",
        },
        surface: {
          DEFAULT: "#111D2C",
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
          DEFAULT: "#F4F6F9",
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
        display: ["var(--font-bricolage)", "system-ui", "sans-serif"],
        body: ["var(--font-bricolage)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      fontSize: {
        "hero": ["clamp(3rem, 8vw, 7rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "hero-sm": ["clamp(2.5rem, 7vw, 5rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display": ["clamp(2rem, 4vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      },
      spacing: {
        "section": "clamp(4rem, 10vw, 8rem)",
        "section-lg": "clamp(6rem, 14vw, 12rem)",
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
