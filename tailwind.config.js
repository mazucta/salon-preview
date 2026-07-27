/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Warm espresso editorial palette — matched to @colorist__anna:
        // black wardrobe, warm greige salon walls, caramel balayage accent
        base: '#171310', // main background — warm near-black
        section: '#1E1915', // second background (blocks / alternating sections)
        cream: '#28211A', // card surface
        charcoal: '#BEB2A5', // primary text — warm greige
        muted: '#9C8E7A', // secondary text — AA on base and cream
        subtle: '#5C5347', // decorative only (dividers, watermarks) — NOT for text
        accent: '#A87C52', // caramel — her signature balayage tone
        'accent-dark': '#C0916A', // lighter caramel — hover states
        brick: '#C2694A', // warm auburn — errors / rare details
        line: '#2E2721', // borders, dividers
      },
      fontFamily: {
        display: ['Unbounded', 'system-ui', 'sans-serif'],
        sans: ['"Golos Text"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        caps: '0.28em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
}
