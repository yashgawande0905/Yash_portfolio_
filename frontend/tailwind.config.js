/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: '#07070d',
          100: '#0b0b16',
          200: '#0f0f1c',
          300: '#14141f'
        },
        ember: {
          DEFAULT: '#ff6a3d',
          soft: '#ff9159',
          deep: '#c8420f'
        },
        arcane: {
          DEFAULT: '#22e0ff',
          soft: '#7cf0ff',
          deep: '#0c8fb0'
        },
        mystic: {
          DEFAULT: '#a86bff',
          soft: '#c8a4ff',
          deep: '#5a2fb0'
        },
        gilt: '#e8c27a'
      },
      fontFamily: {
        display: ['"Cinzel"', 'serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      backdropBlur: {
        xs: '2px'
      },
      boxShadow: {
        glow: '0 0 24px rgba(255, 106, 61, 0.35), 0 0 64px rgba(34, 224, 255, 0.12)',
        'glow-arcane': '0 0 30px rgba(34, 224, 255, 0.45)',
        'glow-mystic': '0 0 30px rgba(168, 107, 255, 0.4)'
      },
      keyframes: {
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        },
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' }
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        'spin-slow': 'spin-slow 18s linear infinite',
        'spin-slower': 'spin-slow 36s linear infinite',
        'spin-reverse': 'spin-reverse 24s linear infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite'
      }
    }
  },
  plugins: []
}
