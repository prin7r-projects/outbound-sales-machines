import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        graphite: "#0E1014",
        steel: "#161E26",
        rivet: "#232C36",
        hairline: "#2E3A45",
        "hairline-bright": "#4A5664",
        plate: "#08090C",
        bone: "#E7E2D7",
        chalk: "#B6B0A1",
        slate: "#6E7682",
        signal: "#F26B1F",
        amber: "#F4B53F",
        verdigris: "#3B8E8E",
        phosphor: "#4AF626",
        hot: "#FF3B30"
      },
      fontFamily: {
        display: ["'Space Grotesk'", "ui-sans-serif", "system-ui"],
        body: ["'IBM Plex Sans'", "ui-sans-serif", "system-ui"],
        mono: ["'IBM Plex Mono'", "'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      maxWidth: {
        prose: "1280px"
      }
    }
  },
  plugins: []
};

export default config;
