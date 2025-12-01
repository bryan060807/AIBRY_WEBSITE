import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{css,scss}",
    "./content/**/*.{md,mdx}", // for your devlogs / markdown content
  ],
  theme: {
    extend: {
      colors: {
        "cassette-red": "var(--cassette-red, #e63946)",
        "cassette-black": "var(--cassette-black, #0a0a0a)",
      },
      typography: {
        invert: {
          css: {
            "--tw-prose-body": "#e5e5e5",
            "--tw-prose-headings": "#ffffff",
            "--tw-prose-links": "#ffffff",
            "--tw-prose-bold": "#ffffff",
            "--tw-prose-quotes": "#f5f5f5",
            "--tw-prose-code": "#f5f5f5",
            "--tw-prose-pre-bg": "#050505",
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;

