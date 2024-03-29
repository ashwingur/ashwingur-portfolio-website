/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        clash: ["Clash-Regular", "sans-serif"],
        coc: ["Coc", "sans-serif"],
        sans: ["var(--font-inter)"],
      },
      animation: {
        fade: "fadeIn 1s ease-in-out",
      },
      keyframes: (theme) => ({
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 100 },
        },
      }),
    },
  },
  plugins: [],
};
