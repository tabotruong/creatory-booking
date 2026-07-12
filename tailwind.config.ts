import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        cinema: {
          900: '#1a1425',
          800: '#231d33',
          700: '#2d2640',
          600: '#3d3455',
        },
        film: {
          amber: '#fbbf24',
          coral: '#f87171',
          green: '#34d399',
          blue: '#60a5fa',
          pink: '#f472b6',
          purple: '#a78bfa',
        },
        brand: {
          dark: '#0B0F19',
          surface: '#151B28',
          elevated: '#1E2738',
          border: '#2D3748',
          pink: '#EC4899',
          purple: '#8B5CF6',
          coral: '#EF4444',
          green: '#10B981',
          blue: '#3B82F6',
          orange: '#F59E0B',
        },
      },
      animation: {
        'pulse-recording': 'pulse-recording 1.5s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      },
      keyframes: {
        'pulse-recording': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 0 10px rgba(239, 68, 68, 0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'brand-gradient': 'linear-gradient(to bottom right, #0B0F19, #1a1025, #151B28, #0f1a2b)',
      },
    },
  },
  plugins: [],
}

export default config
