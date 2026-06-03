import { heroui } from '@heroui/theme';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)'],
        body: ['var(--font-body)'],
        display: ['var(--font-display)']
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.1875rem' }],
        sm: ['0.875rem', { lineHeight: '1.375rem' }],
        base: ['1rem', { lineHeight: '1.6rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.375rem', { lineHeight: '1.875rem' }],
        '2xl': ['1.75rem', { lineHeight: '2.125rem' }],
        '3xl': ['2.2rem', { lineHeight: '2.45rem' }],
        '4xl': ['3rem', { lineHeight: '3.15rem' }]
      },
      spacing: {
        card: '1rem',
        grid: '1rem',
        'grid-lg': '1.5rem',
        section: '2rem',
        'section-lg': '3.5rem'
      },
      maxWidth: {
        reading: '68ch'
      },
      boxShadow: {
        soft: '0 20px 48px -32px rgb(0 0 0 / 0.78)',
        lift: '0 36px 84px -42px rgb(0 0 0 / 0.92)',
        frame:
          '0 0 0 1px rgb(255 255 255 / 0.06), 0 24px 68px -42px rgb(0 0 0 / 0.94)'
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }
    }
  },
  darkMode: 'class',
  plugins: [
    heroui({
      defaultTheme: 'dark',
      themes: {
        dark: {
          extend: 'dark',
          layout: {
            fontSize: {
              tiny: '0.75rem',
              small: '0.875rem',
              medium: '1rem',
              large: '1.125rem'
            },
            lineHeight: {
              tiny: '1.1875rem',
              small: '1.375rem',
              medium: '1.6rem',
              large: '1.75rem'
            },
            radius: {
              small: '0.875rem',
              medium: '1rem',
              large: '1rem'
            },
            borderWidth: {
              small: '1px',
              medium: '1px',
              large: '1px'
            },
            boxShadow: {
              small: '0 18px 42px -28px rgb(0 0 0 / 0.72)',
              medium: '0 24px 64px -30px rgb(0 0 0 / 0.82)',
              large: '0 24px 64px -30px rgb(0 0 0 / 0.82)'
            },
            hoverOpacity: 0.92,
            disabledOpacity: 0.45,
            dividerWeight: '1px'
          },
          colors: {
            background: '#080808',
            foreground: '#f5f5f1',
            divider: '#252525',
            overlay: '#080808d9',
            focus: '#d7d7d2',
            content1: '#111111',
            content2: '#181818',
            content3: '#202020',
            content4: '#2a2a2a',
            default: {
              50: '#f5f5f1',
              100: '#ddddda',
              200: '#c5c5c1',
              300: '#ababaa',
              400: '#8d8d8d',
              500: '#747474',
              600: '#595959',
              700: '#404040',
              800: '#262626',
              900: '#111111',
              DEFAULT: '#181818',
              foreground: '#f5f5f1'
            },
            primary: {
              50: '#ffe6e8',
              100: '#ffbec4',
              200: '#ff919c',
              300: '#ff5f70',
              400: '#f93246',
              500: '#e50914',
              600: '#bd0811',
              700: '#95060d',
              800: '#690409',
              900: '#420205',
              DEFAULT: '#e50914',
              foreground: '#ffffff'
            },
            secondary: {
              DEFAULT: '#202020',
              foreground: '#f5f5f1'
            },
            success: {
              DEFAULT: '#7e9b86',
              foreground: '#080808'
            },
            warning: {
              DEFAULT: '#f4b04c',
              foreground: '#080808'
            },
            danger: {
              DEFAULT: '#d65f65',
              foreground: '#080808'
            }
          }
        }
      }
    })
  ]
};

module.exports = config;
