const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./src/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Mrs Saint Delafield", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        rose: colors.rose,
      },
      spacing: {
        "25vh": "25vh",
        "50vh": "50vh",
        "75vh": "75vh",
      },
      borderRadius: {
        xl: "1.5rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
