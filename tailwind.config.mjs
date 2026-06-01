// tailwind.config.mjs
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  plugins: [typography],
  theme: {
    extend: {
      /* ---- your fonts kept intact ---- */
      fontFamily: {
        sans: ['Orbitron', 'var(--font-geist-sans)', 'sans-serif'],
        mono: ['Orbitron', 'var(--font-geist-mono)', 'monospace'],
      },

      /* ---- craft palette (used by classes like bg-kraft-linen) ---- */
      colors: {
        kraft: {
          forest: '#2F3A2E', // deep green
          bark:   '#4B4236', // dark brown
          ochre:  '#A57A2C', // warm ochre
          sage:   '#7DA576', // sage green
          blush:  '#FBE9EC', // very light pink
          linen:  '#FFF8F4', // off‑white
        },
      },

      /* ---- small visual goodies ---- */
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 6px 24px rgba(0,0,0,0.06)',
        lift: '0 10px 32px rgba(0,0,0,0.10)',
      },
      backgroundImage: {
        'craft-dots': 'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)',
        'soft-fade': 'linear-gradient(180deg, rgba(255,248,244,1) 0%, rgba(255,255,255,0) 60%)',
      },
      backgroundSize: {
        'dot-sm': '12px 12px',
      },

      /* ---- your custom prose preset preserved ---- */
      typography: ({ theme }) => ({
        sacred: {
          css: {
            'p:first-of-type::first-letter': {
              float: 'left',
              fontSize: theme('fontSize.5xl')[0],
              lineHeight: theme('lineHeight.5'),
              marginRight: theme('spacing.3'),
              fontWeight: theme('fontWeight.bold'),
              color: theme('colors.primary.600'),
            },
            p: {
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
              fontSize: theme('fontSize.base')[0],
              lineHeight: theme('lineHeight.relaxed'),
              textIndent: theme('spacing.6'),
              color: theme('colors.foreground.DEFAULT'),
            },
            h2: { color: theme('colors.primary.700') },
            h3: { color: theme('colors.primary.600') },
            blockquote: {
              backgroundColor: theme('colors.primary.50'),
              borderLeftColor: theme('colors.primary.300'),
              paddingLeft: theme('spacing.4'),
              paddingRight: theme('spacing.4'),
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
              fontStyle: 'italic',
            },
            code: {
              backgroundColor: theme('colors.muted.DEFAULT'),
              padding: `${theme('spacing[0.5]')} ${theme('spacing[1]')}`,
              borderRadius: theme('borderRadius.md'),
            },
            pre: {
              backgroundColor: theme('colors.muted.DEFAULT'),
              padding: theme('spacing.4'),
              borderRadius: theme('borderRadius.lg'),
            },
          },
        },
      }),
    },
  },
}
