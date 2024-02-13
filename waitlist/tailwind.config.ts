import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "ebony": "#111827", // unused
        "orangina": "#F3A712", // button
        "dark-lila": "#452C82", // icons, cta section
        "ghost": "#9F9FED", // hover
        "black-pearl": "#06020F", // headings, logo
        "grey-sky": "#7d7c83", // normal text, header bottom border
        "athens-gray": "#FAFAFA", // features section
      },
    },
  },
  plugins: [],
};
export default config;
