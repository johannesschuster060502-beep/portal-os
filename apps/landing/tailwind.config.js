/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        void: '#050505',
        base: '#080808',
        surface: '#0d0d0d',
        elevated: '#111111',
        accent: {
          DEFAULT: '#7c6af7',
          dim: 'rgba(124,106,247,0.15)',
          hover: '#9585f9'
        }
      },
      fontFamily: {
        mono: ['SF Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
        display: ['SF Pro Display', '-apple-system', 'sans-serif']
      }
    }
  },
  plugins: []
}
