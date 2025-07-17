import type { Config } from 'tailwindcss'

const config: Config = {
  // Baris-baris ini memberitahu Tailwind untuk memindai SEMUA file
  // di dalam folder /app dan /components. Ini adalah bagian yang paling penting.
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
