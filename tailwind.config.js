const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
  plugins: [require("@tailwindcss/ui")],
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
      }
    }
  },
  future: {
    removeDeprecatedGapUtilities: true,
  },
};
