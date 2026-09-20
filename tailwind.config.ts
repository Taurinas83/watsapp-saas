import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Zapella Brand Palette
        zapella: {
          green:   '#00E676', // WhatsApp Bright
          accent:  '#1DE9B6', // Deep Accent Teal
          forest:  '#2E7D5A', // Interface Forest
          mint:    '#43A047', // Safe Mint
          purple:  '#7C4DFF', // Neural Intelligence
          lavender:'#E0C3FC', // Pastel Lavender
          amber:   '#FF8F1A', // Attention Alert
          error:   '#FF5252', // System Error
          onyx:    '#171901', // Midnight Onyx
          steel:   '#4D4D61', // Slate Steel
          border:  '#6B6B6B', // Slate Border
          divider: '#E0E3E1', // Soft Divider
          canvas:  '#F4F5F4', // Muted Canvas
          white:   '#FFFFFF', // Pure White
        },
        // Keep emerald for backward compat during migration
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      backgroundImage: {
        'zapella-gradient': 'linear-gradient(135deg, #00E676 0%, #7C4DFF 100%)',
        'zapella-green-gradient': 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)',
      },
    },
  },
  plugins: [],
};
export default config;

