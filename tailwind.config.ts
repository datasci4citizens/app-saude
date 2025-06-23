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
          text: 'var(--success-text)',
        },
        yellow: {
          DEFAULT: 'var(--yellow)',
        },
        homeblob1:{
          DEFAULT: 'var(--homeblob1)',
          foreground: 'var(--homeblob1-foreground)',
        },
        homeblob2:{
          DEFAULT: 'var(--homeblob2)',
          foreground: 'var(--homeblob2-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)', 
          border: 'var(--card-border)',
          muted: 'var(--card-muted)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'bottom-nav': {
          DEFAULT: 'var(--bottom-nav)',
          foreground: 'var(--bottom-nav-foreground)',
          active: 'var(--bottom-nav-active)',
          border: 'var(--bottom-nav-border)',
        },
        backgroundImage: {
          'gradient-interest-indicator': 'var(--gradient-interest-indicator)',
          'gradient-button-background': 'var(--gradient-button-background)',
          'gradient-button-save': 'var(--gradient-button-save)',
          'gradient-button-save-hover': 'var(--gradient-button-save-hover)',
          'gradient-button-new': 'var(--gradient-button-new)',
          'gradient-button-new-hover': 'var(--gradient-button-new-hover)',
          'gradient-button-edit': 'var(--gradient-button-edit)',
          'gradient-button-edit-hover': 'var(--gradient-button-edit-hover)',
        },
        'hover': {
          'primary': 'rgb(var(--hover-primary) / <alpha-value>)',
          'primary-light': 'rgb(var(--hover-primary-light) / <alpha-value>)',
          'secondary': 'rgb(var(--hover-secondary) / <alpha-value>)',
          'secondary-light': 'rgb(var(--hover-secondary-light) / <alpha-value>)',
          'surface': 'rgb(var(--hover-surface) / <alpha-value>)',
          'surface-dark': 'rgb(var(--hover-surface-dark) / <alpha-value>)',
          'border': 'rgb(var(--hover-border) / <alpha-value>)',
          'border-active': 'rgb(var(--hover-border-active) / <alpha-value>)',
          'text': 'rgb(var(--hover-text) / <alpha-value>)',
          'text-muted': 'rgb(var(--hover-text-muted) / <alpha-value>)',
        },
      },
      boxShadow: {
        'hover': 'var(--hover-shadow)',
        'hover-lg': 'var(--hover-shadow-lg)',
        'glow': '0 0 20px rgb(var(--hover-primary) / 0.3)',
        'glow-purple': '0 0 20px rgb(var(--hover-secondary) / 0.3)',
      },   
      animation: {
        'hover-float': 'hover-float 3s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },   
      keyframes: {
        'hover-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        }
      },   
      backdropBlur: {
        'hover': '8px',
      },  
      transitionTimingFunction: {
        'hover': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      }
    },
  },
  plugins: [
    tailwindcssAnimate,
    function({ addUtilities }) {
      const newUtilities = {
        '.hover-lift': {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 'var(--hover-shadow-lg)',
          }
        },
        '.hover-glow': {
          '&:hover': {
            boxShadow: '0 0 20px rgb(var(--hover-primary) / 0.3)',
          }
        },
        '.hover-scale': {
          '&:hover': {
            transform: 'scale(1.02)',
          }
        },
        '.hover-rotate': {
          '&:hover': {
            transform: 'rotate(2deg)',
          }
        }
      }
      
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
} satisfies Config;
