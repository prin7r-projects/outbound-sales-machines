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
        steel: "#19222B",
        rivet: "#2A3540",
        hairline: "#3A4651",
        plate: "#0B0D11",
        bone: "#E7E2D7",
        chalk: "#C2BCAD",
        slate: "#7E8590",
        signal: "#F26B1F",
        amber: "#F4B53F",
        verdigris: "#3B8E8E",
        hot: "#FF3B30"
      },
      fontFamily: {
        display: ["'Space Grotesk'", "ui-sans-serif", "system-ui"],
        body: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      maxWidth: {
        prose: "1240px"
      }
    }
  },
  plugins: []
};

export default config;
