module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: ["./src/**/*.html", "./src/**/*.vue"],
  theme: {
    extend: {
      colors: {
        primary: "#24ddd8",
        dark: "#3d3d3d",
        dark100: "#0F2A3F",
        primary100: "#F6D6BD",
      },
    },
  },
  variants: {},
  plugins: [],
};
