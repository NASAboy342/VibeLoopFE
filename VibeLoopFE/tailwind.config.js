/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
    darkTheme: "light", // Force light theme, disable dark mode
    base: true,
    styled: true,
    utils: true,
  },
}
