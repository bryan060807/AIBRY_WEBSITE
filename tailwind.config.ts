import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{css,scss}",
  ],
  theme: {
    extend: {
      colors: {
        "cassette-red": "var(--cassette-red, #e63946)",
        "cassette-black": "var(--cassette-black, #0a0a0a)",
      },
    },
  },
  plugins: [],
};
export default config;
