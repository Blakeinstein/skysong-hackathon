import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    theme: ["garden"],
    darkTheme: "garden"
  }
}
export default config
