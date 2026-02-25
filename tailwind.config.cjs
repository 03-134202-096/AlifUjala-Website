module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        candy: {
          pink: '#FF6B9D',
          purple: '#C084FC',
          blue: '#60A5FA',
          cyan: '#22D3EE',
          green: '#4ADE80',
          yellow: '#FACC15',
          orange: '#FB923C',
          red: '#F87171',
        },
        sky: {
          light: '#E0F2FE',
          DEFAULT: '#7DD3FC',
        },
      },
      fontFamily: {
        fun: ['"Comic Neue"', '"Bubblegum Sans"', 'cursive', 'ui-rounded', 'system-ui'],
        urdu: ['"Noto Nastaliq Urdu"', '"Jameel Noori Nastaleeq"', 'serif'],
      },
      borderRadius: {
        'blob': '30% 70% 70% 30% / 30% 30% 70% 70%',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'candy': '0 8px 30px -4px rgba(251, 146, 60, 0.3), 0 4px 12px -2px rgba(96, 165, 250, 0.2)',
        'candy-lg': '0 20px 40px -8px rgba(251, 146, 60, 0.35), 0 8px 20px -4px rgba(192, 132, 252, 0.25)',
        'glow-pink': '0 0 20px rgba(255, 107, 157, 0.4)',
        'glow-blue': '0 0 20px rgba(96, 165, 250, 0.4)',
        'glow-green': '0 0 20px rgba(74, 222, 128, 0.4)',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out 3s infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'rainbow': 'rainbow 4s linear infinite',
        'pop': 'pop 0.3s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'shake-x': 'shakeX 0.5s ease-in-out',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.2)' },
        },
        rainbow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        shakeX: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-5px)' },
          '80%': { transform: 'translateX(5px)' },
        },
      },
    },
  },
  plugins: [],
}
