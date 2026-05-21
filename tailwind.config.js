/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs officielles DSFR
        'bleu-france':        '#000091',
        'bleu-france-hover':  '#1212FF',
        'rouge-marianne':     '#E1000F',
        'rouge-marianne-hover': '#C9000D',

        // Complémentaires DSFR
        'bleu-ciel':          '#6A6AF4',
        'bleu-ciel-hover':    '#5555D9',
        'vert-success':       '#00A95F',
        'orange-warning':     '#FF8D00',

        // Textes & neutres DSFR
        'gris-fonce':         '#161616',
        'gris-neutre':        '#4A4A4A',
        'gris-sombre':        '#666666',
        'gris-clair':         '#E5E5E5',
        'gris-bg':            '#F5F5F5',
      },
      fontFamily: {
        'sans':     ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'system-ui', 'sans-serif'],
        'marianne': ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'h1': ['2rem',    { lineHeight: '1.25', fontWeight: '800' }],
        'h2': ['1.5rem',  { lineHeight: '1.3',  fontWeight: '700' }],
        'h3': ['1.25rem', { lineHeight: '1.4',  fontWeight: '600' }],
      },
      borderRadius: {
        'dsfr': '4px',
      },
    },
  },
  plugins: [],
}
