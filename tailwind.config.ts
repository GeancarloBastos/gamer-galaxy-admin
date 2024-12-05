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
        background: "var(--background)",
        foreground: "var(--foreground)",
        'colorRoxoEscuro': '#6A0DAD',
        'colorRoxoClaro': '##B57EDC',
        'colorAmareloDourado': '#FFC300',
        'colorBeringela': '#4B0082',
        'colorUvaEscura': '#2E0854',
      },
    },
  },
  plugins: [],
};
export default config;
