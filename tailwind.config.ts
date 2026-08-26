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
        ocean: {
          50: "#eefbfb",
          100: "#d5f4f4",
          200: "#aee9ea",
          300: "#76d6db",
          400: "#2bb8c4",
          500: "#0ea5a8",
          600: "#0b7c86",
          700: "#0f636c",
          800: "#145158",
          900: "#15434a",
          950: "#062a30",
        },
        coral: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
        },
        sand: {
          50: "#fdfaf5",
          100: "#f8f1e4",
          200: "#eedcc0",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      boxShadow: {
        glow: "0 18px 50px -20px rgba(14, 165, 168, 0.45)",
        card: "0 10px 40px -16px rgba(6, 42, 48, 0.18)",
      },
      backgroundImage: {
        "ocean-hero":
          "radial-gradient(1200px 500px at 80% -10%, rgba(43, 184, 196, 0.35), transparent), radial-gradient(900px 400px at 0% 20%, rgba(249, 115, 22, 0.18), transparent), linear-gradient(180deg, #062a30 0%, #0b7c86 48%, #2bb8c4 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
