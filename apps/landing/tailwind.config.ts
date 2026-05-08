import type { Config } from "tailwindcss";

/*
 * Saltrun — Wave 2 design refresh 2026-05-08
 * Reference: revenue-grade-automation (Engineered Control Panel)
 * Token NAMES preserved (graphite, steel, bone, signal …) so the existing
 * 1300+ line page.tsx component classes keep working unchanged. Only the
 * VALUES are remapped from dark-canvas to light-canvas + electric-violet
 * accent. Keep this in sync with apps/landing/app/globals.css :root vars.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // Surfaces
        graphite: "#FAFAF8",          // page canvas (milky, no beige)
        steel: "#FFFFFF",             // raised plate
        rivet: "#EEEEEE",             // recessed inner
        plate: "#F5F5F5",             // deepest recessed
        // Borders
        hairline: "#E5E5E5",
        "hairline-bright": "#CCCCCC",
        // Ink
        bone: "#202020",
        chalk: "#333333",
        slate: "#666666",
        // Accents
        signal: "#5757F8",
        amber: "#C77B00",
        verdigris: "#1F7A7A",
        phosphor: "#2EB04A",
        hot: "#C8302A"
      },
      fontFamily: {
        display: ["'Space Grotesk'", "ui-sans-serif", "system-ui"],
        body: ["'Inter'", "ui-sans-serif", "system-ui"],
        mono: ["'JetBrains Mono'", "'IBM Plex Mono'", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      maxWidth: {
        prose: "1280px"
      },
      borderRadius: {
        pill: "1425.6px"
      },
      boxShadow: {
        plate: "rgba(32, 32, 32, 0.04) 0px 4px 8px 0px",
        plateHover: "rgba(32, 32, 32, 0.10) 0px 4px 16px 0px"
      }
    }
  },
  plugins: []
};

export default config;
