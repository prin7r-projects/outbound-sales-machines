import type { Config } from "tailwindcss";

/*
 * Saltrun — Wave 2 design fix (PRI-3523, 2026-06-02)
 *
 * Token NAMES are preserved (graphite, steel, bone, signal, chalk, slate,
 * hairline, plate, amber, verdigris, phosphor, hot, rivet, hairline-bright)
 * so the existing 1300+ line page.tsx keeps rendering with zero structural
 * rewrite. The previous Wave 2 lifted an electric-violet (`signal #5757F8`)
 * direction from `revenue-grade-automation`. PRI-3523 retokenizes the
 * shipped landing palette to **black/white/neutral-gray only**.
 *
 * Accent hex values are collapsed to a single ink neutral (`#111111`).
 * The structural distinction between signal / amber / verdigris / hot
 * tones in the page is preserved by *class* (so node--signal, node--amber,
 * etc. still apply) but the rendered color is the same graphite ink.
 * Mono layout, hairlines, and CRT scanlines are unchanged. Buttons stay
 * square-edged on the control-panel canvas — the Wave 2 pill radius is
 * reverted to 0px per the original blueprint specification.
 *
 * Keep this in sync with apps/landing/app/globals.css :root vars.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // Surfaces — black/white/neutral-gray only
        graphite: "#FAFAF8",          // page canvas (milky, no beige)
        steel: "#FFFFFF",             // raised plate
        rivet: "#EEEEEE",             // recessed inner
        plate: "#F5F5F5",             // deepest recessed
        // Borders
        hairline: "#E5E5E5",
        "hairline-bright": "#CCCCCC",
        // Ink
        bone: "#111111",              // primary text — neutral ink (was midnight-ink #202020)
        chalk: "#3A3A3A",             // secondary text — neutral ash
        slate: "#6B6B6B",             // tertiary text / labels — neutral
        // Accents — collapsed to single neutral ink (no violet/orange/amber)
        signal: "#111111",
        amber: "#111111",
        verdigris: "#111111",
        phosphor: "#111111",
        hot: "#111111"
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
        // Square-edged per the original industrial-blueprint spec. The
        // 1425.6px pill radius from the Wave 2 refresh is reverted —
        // the panel reads as a switchgear, not a SaaS pill button.
        pill: "0px"
      },
      boxShadow: {
        plate: "rgba(17, 17, 17, 0.04) 0px 4px 8px 0px",
        plateHover: "rgba(17, 17, 17, 0.10) 0px 4px 16px 0px"
      }
    }
  },
  plugins: []
};

export default config;
