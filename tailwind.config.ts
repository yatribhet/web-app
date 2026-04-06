import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ember: "#ea7022",
        dusk: "#c45a12",
        sand: "#fdf4ec",
        terracotta: "#fce8d5",
        ink: "#1a1410",
        stone: "#6b5e54",
        sage: "#4a7c59",
        sky: "#2d6ea8",
        "border-warm": "#e8d5c4",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "4px",
        md: "6px",
      },
    },
  },
  plugins: [],
};
export default config;
