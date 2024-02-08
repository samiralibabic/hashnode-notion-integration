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
        'blue-ribbon': '#1051E9',
        'jordy-blue': '#81A4F5',
        'pattens-blue': '#DBEAFE',
        'black-pearl': '#010209',
        'pale-sky': '#6E7581',
        'ghost': '#C8CBD0',
      }
    },
  },
  plugins: [],
};
export default config;
