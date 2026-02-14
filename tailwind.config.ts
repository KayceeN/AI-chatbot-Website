import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#ececed",
        ink: "#151517",
        muted: "#5c5f66",
        panel: "#f4f4f5"
      },
      borderRadius: {
        panel: "1.5rem"
      },
      boxShadow: {
        soft: "0 10px 26px rgba(17, 17, 18, 0.11)",
        plate: "0 3px 10px rgba(17, 17, 18, 0.12)",
        button: "0 10px 18px rgba(9, 9, 10, 0.28)"
      }
    }
  },
  plugins: []
};

export default config;
