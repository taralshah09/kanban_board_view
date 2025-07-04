import daisyui from "daisyui";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      darkMode: 'class',
    },
  },
  plugins: [
    daisyui
  ],
};
