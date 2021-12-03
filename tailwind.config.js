module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "spotify-gray": "#121212",
        "spotify-player": "#181818",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
