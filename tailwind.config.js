/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy:          "#1B4B8A",
        "navy-dark":   "#0F2D5C",
        "navy-mid":    "#2E6DB4",
        "navy-light":  "#4A90D9",
        crimson:       "#C0182A",
        "crimson-dark":"#8C1020",
        "crimson-light":"#E02030",
        ivory:         "#F5F7FA",
        "ivory-dark":  "#E8ECF2",
        silver:        "#9BA8BC",
        slate:         "#4A5568",
        cream:         "#FAFBFD",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        sans:    ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
