/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f0f4f8",
          100: "#e1e9f1",
          200: "#c3d3e3",
          300: "#a5bdd5",
          400: "#87a7c7",
          500: "#6991b9",
          600: "#4b7bab",
          700: "#2d659d",
          800: "#2d4a6d",
          900: "#0f172a",
        },
        cyan: {
          50: "#f0fdfa",
          100: "#e0fdfb",
          300: "#84e9dc",
          500: "#06b6d4",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
