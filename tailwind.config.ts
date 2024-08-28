import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        'Garamond': ['adobe-garamond-pro', 'normal'],
        'Helvetica': ['Helvetica', 'normal']
      },
      keyframes: {
        yellow: {
          '0%, 100%': { top: '200px', left: '100px', transform: 'scale(1)' },
          '30%': { top: '300px', left: '150px', transform: 'scale(1.2)' },
          '60%': { top: '100px', left: '200px', transform: 'scale(1.3)' },
        },
        green: {
          '0%, 100%': { top: '80px', right: '-20px', transform: 'scale(1.2)' },
          '30%': { top: '300px', right: '-20px', transform: 'scale(1)' },
          '60%': { top: '200px', right: '100px', transform: 'scale(1)' },
        },
        red: {
          '0%, 100%': { top: '250px', right: '0px', transform: 'scale(1)' },
          '30%': { top: '150px', right: '150px', transform: 'scale(1.4)' },
          '60%': { top: '250px', right: '100px', transform: 'scale(1)' },
        },
      },
      animation: {
        yellow: 'yellow 8s infinite ease',
        green: 'green 8s infinite ease',
        red: 'red 8s infinite linear',
      },
    },
  },
  plugins: [],
};
export default config;
