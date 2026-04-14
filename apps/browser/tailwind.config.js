/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    // Custom breakpoints tuned for Electron window (min 900px, max ultrawide)
    screens: {
      sm: '960px',   // compact (small laptop)
      md: '1200px',  // default desktop
      lg: '1600px',  // widescreen
      xl: '2000px',  // ultrawide
      '2xl': '2560px' // 4K+
    },
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
        },
        success: '#27C93F',
        warning: '#FFBD2E',
        danger: '#FF5F56'
      },
      fontFamily: {
        ui: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
        display: ['SF Pro Display', '-apple-system', 'sans-serif']
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px'
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        out: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }
    }
  },
  plugins: []
}
