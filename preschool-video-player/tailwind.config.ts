import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        saessak: {
          green: "#1B5E4B",
          deep: "#15493A",
          mint: "#D8EFE4",
          soft: "#E8F3EE",
          bg: "#F6F8F7",
          peach: "#F7D2C4",
          coral: "#E06D53"
        }
      }
    },
  },
  plugins: [],
};
export default config;
