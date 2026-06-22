import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#ff9500",
          soft: "rgba(255,149,0,0.12)",
        },
        brand: {
          blue: "#0ea5e9",
        },
      },
      fontFamily: {
        sans: [
          "'Apple SD Gothic Neo'",
          "'Malgun Gothic'",
          "'Noto Sans KR'",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "'JetBrains Mono'",
          "'D2Coding'",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
