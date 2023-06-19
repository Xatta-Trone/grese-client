/**
 * @format
 * @type {import('tailwindcss').Config}
 */

const config = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],

  theme: {
    extend: {
      colors: {
        // flowbite-svelte
        // primary: {
        //   50: "#ebf5ff",
        //   100: "#fff1ee",
        //   200: "#ffe4de",
        //   300: "#ffd5cc",
        //   400: "#ffbcad",
        //   500: "#fe795d",
        //   600: "#ef562f",
        //   700: "#eb4f27",
        //   800: "#d3330a",
        //   900: "#d3330a",
        // },
        // blue
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },

        // // teal
        // primary: {
        //   50: "#f0fdfa",
        //   100: "#ccfbf1",
        //   200: "#99f6e4",
        //   300: "#5eead4",
        //   400: "#2dd4bf",
        //   500: "#14b8a6",
        //   600: "#0d9488",
        //   700: "#0f766e",
        //   800: "#115e59",
        //   900: "#134e4a",
        // },
      },
    },
  },

  plugins: [require("flowbite/plugin")],
};

module.exports = config;
