/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ubuntu: ["Ubuntu", "sans-serif"],
        unbounded: ["Unbounded", "sans-serif"],
      },
      colors: {
        blue: {
          DEFAULT: "#3590E3",
          400: "#5aaaf0",
          500: "#3590E3",
          600: "#2a7fd4",
        },
        green: {
          DEFAULT: "#BAF09D",
          300: "#BAF09D",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease both",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};