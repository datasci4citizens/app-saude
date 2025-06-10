import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        'work-sans': ['Work Sans', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'titulo': ['28px', { lineHeight: '33.6px', letterSpacing: '0px', fontWeight: '700' }],
        'desc-titulo': ['14px', { lineHeight: '16.8px', letterSpacing: '0px', fontWeight: '400' }],
        'topicos': ['14px', { lineHeight: '16.8px', letterSpacing: '0px', fontWeight: '700' }],
        'campos-preenchimento': ['16px', { lineHeight: '19.2px', letterSpacing: '0px', fontWeight: '300' }],
        'desc-campos': ['10px', { lineHeight: '12px', letterSpacing: '0px', fontWeight: '300' }],
        'campos-preenchimento2': ['13px', { lineHeight: '15.6px', letterSpacing: '0px', fontWeight: '300' }],
        'topicos2': ['16px', { lineHeight: '17.6px', letterSpacing: '0px', fontWeight: '600' }],
        'titulowindow': ['18px', { lineHeight: '19.458px', letterSpacing: '0px', fontWeight: '700' }],
      },
      colors: {
        selection: {
          DEFAULT: 'var(--selection)',
          background: 'var(--selection-background)',
        },
        homebg: {
          DEFAULT: 'var(--homebg)',
          background: 'var(--homebg-background)',
        },
        selected: {
          DEFAULT: 'var(--selected)',
          background: 'var(--selected-background)',
        },
        typography: {
          DEFAULT: 'var(--typography)',
          foreground: 'var(--typography-foreground)',
        },
        offwhite: {
          DEFAULT: 'var(--offwhite)',
          foreground: 'var(--offwhite-foreground)',
        },
        gray1: {
          DEFAULT: 'var(--gray1)',
          foreground: 'var(--gray1-foreground)',
        },
        gray2: {
          DEFAULT: 'var(--gray2)',
          foreground: 'var(--gray2-foreground)',
          border: 'var(--gray2-border)',
          input: 'var(--gray2-input)',
        },
        accent1: {
          DEFAULT: 'var(--accent1)',
          background: 'var(--accent1-background)',
        },
        accent2: {
          DEFAULT: 'var(--accent2)',
          foreground: 'var(--accent2-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        success: {
          DEFAULT: 'var(--success)',
          foreground: 'var(--success-foreground)',
        },
        homeblob1:{
          DEFAULT: 'var(--homeblob1)',
          foreground: 'var(--homeblob1-foreground)',
        },
        homeblob2:{
          DEFAULT: 'var(--homeblob2)',
          foreground: 'var(--homeblob2-foreground)',
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
