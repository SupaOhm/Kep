import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        elevated: "rgb(var(--color-elevated) / <alpha-value>)",
        track: "rgb(var(--color-track) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        "ink-soft": "rgb(var(--color-ink-soft) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-ink": "rgb(var(--color-accent-ink) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        // desaturated category dots — never compete with emerald
        "cat-slate": "#7C8AA5",
        "cat-clay": "#B08968",
        "cat-violet": "#9B8AC4"
      },
      borderRadius: {
        chip: "12px",
        stat: "22px",
        card: "26px"
      },
      boxShadow: {
        soft: "0 18px 60px rgb(16 24 40 / 0.10)",
        card: "0 1px 2px rgb(20 23 28 / 0.05), 0 10px 26px rgb(20 23 28 / 0.05)",
        float: "0 8px 20px rgb(16 185 129 / 0.30), 0 4px 10px rgb(16 185 129 / 0.25)"
      },
    }
  },
  plugins: []
};

export default config;
