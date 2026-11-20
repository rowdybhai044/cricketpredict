import type { Config } from "tailwindcss";

const c = (v: string) => `rgb(var(--c-${v}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: c("background"),
        surface: c("surface"),
        elevated: c("elevated"),
        border: c("border"),
        foreground: c("foreground"),
        muted: c("muted"),
        primary: { DEFAULT: c("primary"), foreground: c("primary-fg") },
        accent: c("accent"),
        info: c("info"),
        warning: c("warning"),
        danger: c("danger"),
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: { xl: "0.875rem", "2xl": "1.125rem" },
    },
  },
  plugins: [],
};
export default config;
