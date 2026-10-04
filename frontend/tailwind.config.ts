import type { Config } from 'tailwindcss'

// JobBear tokens. A bear's world: birch-bark paper, dark bark ink, honey as the one accent,
// and nature tones for statuses so the colour of a badge means something.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        birch: {
          DEFAULT: '#F3F4EF', // page background
          50: '#FAFAF7', // raised surfaces
          200: '#E4E5DD', // hairlines
          300: '#D3D4C9', // borders, dashed outlines
        },
        bark: {
          DEFAULT: '#2A1F19', // ink, dark surfaces
          700: '#4A3A30',
          500: '#76695F', // secondary text
          400: '#9A8F86', // tertiary text, placeholders
        },
        honey: {
          DEFAULT: '#E9A825', // the accent: primary actions, goal line, focus
          50: '#FDF5E2',
          600: '#C98A0E',
          800: '#7A5208',
        },
        pine: { DEFAULT: '#2E5E4E', 50: '#E7F0EC', 700: '#214539' },
        lake: { DEFAULT: '#3F6E8C', 50: '#E8F0F5' },
        heather: { DEFAULT: '#6D5A9E', 50: '#EFECF6' },
        berry: { DEFAULT: '#B23A55', 50: '#F8E8EC' },
        ash: { DEFAULT: '#8A8A84', 50: '#EEEEEA' },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Onest', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        panel: '1.125rem',
        control: '0.625rem',
      },
    },
  },
  plugins: [],
} satisfies Config
