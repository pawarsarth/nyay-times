import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F5F6F8',
        ink: '#13171E',
        mute: '#5B6472',
        rule: '#D9DDE3',
        signal: '#0F766E',
      },
      fontFamily: {
        display: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Archivo', 'system-ui', 'sans-serif'],
      },
      typography: () => ({
        news: {
          css: {
            '--tw-prose-body': '#13171E',
            '--tw-prose-headings': '#13171E',
            '--tw-prose-links': '#0F766E',
            '--tw-prose-quotes': '#13171E',
            '--tw-prose-quote-borders': '#0F766E',
            '--tw-prose-captions': '#5B6472',
            '--tw-prose-hr': '#D9DDE3',
            fontFamily: 'Newsreader, Georgia, serif',
            fontSize: '1.2rem',
            lineHeight: '1.75',
            maxWidth: '68ch',
            h2: { fontFamily: 'Archivo, system-ui, sans-serif', fontWeight: '700', letterSpacing: '-0.01em' },
            h3: { fontFamily: 'Archivo, system-ui, sans-serif', fontWeight: '600' },
            blockquote: { fontStyle: 'italic', fontWeight: '400' },
            img: { borderRadius: '2px' },
          },
        },
      }),
    },
  },
  plugins: [typography],
}
