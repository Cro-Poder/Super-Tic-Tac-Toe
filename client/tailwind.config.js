/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#090D16',
          surface: '#111827',
          card: '#182234',
          border: '#2A364F',
          muted: '#64748B',
        },
        playerX: {
          light: '#38BDF8',
          DEFAULT: '#06B6D4',
          dark: '#0284C7',
          glow: 'rgba(6, 182, 212, 0.45)',
        },
        playerO: {
          light: '#FB7185',
          DEFAULT: '#F43F5E',
          dark: '#E11D48',
          glow: 'rgba(244, 63, 94, 0.45)',
        },
        accent: {
          gold: '#F59E0B',
          green: '#10B981',
          purple: '#8B5CF6',
        }
      },
      boxShadow: {
        'glow-x': '0 0 25px rgba(6, 182, 212, 0.5)',
        'glow-o': '0 0 25px rgba(244, 63, 94, 0.5)',
        'glow-active': '0 0 30px rgba(245, 158, 11, 0.45)',
        'glow-purple': '0 0 25px rgba(139, 92, 246, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { opacity: '0.6', filter: 'brightness(1)' },
          '100%': { opacity: '1', filter: 'brightness(1.25)' },
        }
      }
    },
  },
  plugins: [],
}
