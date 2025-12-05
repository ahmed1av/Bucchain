/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0B0F19', // Deep dark blue/black
        deep: '#05080F',     // Darker shade
        primary: {
          DEFAULT: '#FF5E00', // Chainalysis Orange
          hover: '#E55500',
        },
        teal: {
          DEFAULT: 'var(--accent-teal)',
          glow: 'rgba(0, 240, 255, 0.5)',
        },
        violet: {
          DEFAULT: 'var(--accent-violet)',
          glow: 'rgba(112, 0, 255, 0.5)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        }
      },
    },
  },
  plugins: [],
}
