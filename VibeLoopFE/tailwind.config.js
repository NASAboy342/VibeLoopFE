/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mood-great': '#DCFCE7',
        'mood-good': '#D1FAE5',
        'mood-neutral': '#F1F5F9',
        'mood-low': '#FEF3C7',
        'mood-stressed': '#FEE2E2',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
      },
      transitionDuration: {
        'fast': '150ms',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#0891B2",          // Cyan-600
          "primary-content": "#FFFFFF",
          "secondary": "#6366F1",        // Indigo-500
          "secondary-content": "#FFFFFF",
          "accent": "#22D3EE",           // Cyan-400
          "accent-content": "#164E63",
          "neutral": "#334155",          // Slate-700
          "neutral-content": "#F8FAFC",
          "base-100": "#FFFFFF",         // Card backgrounds
          "base-200": "#F8FAFC",         // App background
          "base-300": "#E2E8F0",         // Borders
          "base-content": "#1E293B",     // Text
          "info": "#3B82F6",             // Blue-500
          "info-content": "#FFFFFF",
          "success": "#10B981",          // Emerald-500
          "success-content": "#FFFFFF",
          "warning": "#F59E0B",          // Amber-500
          "warning-content": "#FFFFFF",
          "error": "#EF4444",            // Red-500
          "error-content": "#FFFFFF",
        },
      },
    ],
    darkTheme: "light", // Force light theme, disable dark mode
    base: true,
    styled: true,
    utils: true,
  },
}
