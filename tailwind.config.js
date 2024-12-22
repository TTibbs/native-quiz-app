/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js, jsx, ts, tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        redPrimary: "rgb(255, 49, 49)",
        redSecondary: "rgb(246, 32, 32)",
        modalBg: "rgba(0, 0, 0, .4)",
      },
    },
  },
  plugins: [],
};
