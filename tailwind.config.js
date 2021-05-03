const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        rose: colors.rose,
        orange: colors.orange,
        emerald: colors.emerald,
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
    extend: {
      backgroundColor: ["active"],
    },
  },
  plugins: [],
};
