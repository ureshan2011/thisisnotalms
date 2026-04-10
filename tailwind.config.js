/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        violet: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        surface: {
          50:  '#fdfcff',
          100: '#f8f7ff',
          200: '#f0eeff',
          300: '#e6e2ff',
          400: '#d4cfff',
        },
        // Softer semantic colors
        soft: {
          purple: '#7c6af7',
          lavender: '#a78bfa',
          pink: '#e879a0',
          teal: '#2dd4bf',
          blue: '#60a5fa',
          green: '#34d399',
          amber: '#fbbf24',
          rose: '#fb7185',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(124, 106, 247, 0.08), 0 2px 8px rgba(124, 106, 247, 0.04)',
        'glass-lg': '0 16px 48px rgba(124, 106, 247, 0.12), 0 4px 16px rgba(124, 106, 247, 0.06)',
        'glass-xl': '0 24px 64px rgba(124, 106, 247, 0.16), 0 8px 24px rgba(124, 106, 247, 0.08)',
        'soft': '0 4px 16px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'card': '0 2px 12px rgba(124, 106, 247, 0.06), 0 1px 4px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 24px rgba(124, 106, 247, 0.14), 0 2px 8px rgba(0,0,0,0.06)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-soft': 'linear-gradient(135deg, #f5f3ff 0%, #fdf4ff 50%, #f0f9ff 100%)',
        'gradient-brand': 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
        'gradient-purple': 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
        'gradient-teal': 'linear-gradient(135deg, #2dd4bf 0%, #60a5fa 100%)',
        'gradient-amber': 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
        'gradient-rose': 'linear-gradient(135deg, #fb7185 0%, #e879a0 100%)',
        'gradient-emerald': 'linear-gradient(135deg, #34d399 0%, #2dd4bf 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'fade-in': 'fadeIn 0.25s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
