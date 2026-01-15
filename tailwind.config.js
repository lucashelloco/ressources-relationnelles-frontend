/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs principales DSFR
        'bleu-france': '#000091',
        'bleu-france-hover': '#1212FF',
        'rouge-marianne': '#E1000F',
        'rouge-marianne-hover': '#C9000D',
        
        // Couleurs secondaires
        'bleu-ciel': '#6A6AF4',
        'bleu-ciel-hover': '#5555D9',
        'vert-success': '#00A95F',
        'orange-warning': '#FF8D00',
        
        // Textes et neutres
        'gris-fonce': '#161616',
        'gris-neutre': '#4A4A4A',
        'gris-sombre': '#666666',
        'gris-clair': '#E5E5E5',
        'gris-bg': '#F5F5F5',
      },
      fontFamily: {
        'marianne': ['Marianne', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'h1': ['32px', { lineHeight: '1.3', fontWeight: '800' }],
        'h2': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '500' }],
        'body': ['12pt', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['10pt', { lineHeight: '1.6', fontWeight: '400' }],
      },
      spacing: {
        'xs': '4px',
        's': '8px',
        'm': '16px',
        'l': '24px',
        'xl': '32px',
        'xxl': '48px',
      },
      borderRadius: {
        'dsfr': '4px',
      },
    },
  },
  plugins: [],
}
