import { resolveProjectPath } from "wasp/dev";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [resolveProjectPath("./src/**/*.{js,jsx,ts,tsx}")],
  theme: {
    extend: {
      fontSize: {
        "tiny": ["0.625rem", "1rem"],
      },
      colors: {
        // Saltrun brand — Engineered Control Panel palette
        graphite: "#FAFAF8",
        steel: "#FFFFFF",
        plate: "#F5F5F5",
        hairline: "#E5E5E5",
        "hairline-bright": "#CCCCCC",
        rivet: "#EEEEEE",
        bone: "#202020",
        chalk: "#333333",
        slate: "#666666",
        signal: "#5757F8",
        amber: "#C77B00",
        verdigris: "#1F7A7A",
        phosphor: "#2EB04A",
      },
    },
  },
  plugins: [],
};
