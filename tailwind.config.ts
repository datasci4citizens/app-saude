import type { Config } from 'tailwindcss';
import {
    blue,
    green,
    orange,
    red,
    stone,
    white,
    yellow,
} from 'tailwindcss/colors';

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
                sans: ['Inter', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
                'work-sans': ['"Work Sans"', 'sans-serif'],
            },
            fontWeight: {
                light: '300',
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
            opacity:{
                '68': '0.68',
                '100': '1',
            },
            colors: {
                // Paleta padrão (light theme)
                border: '#e6e6e6',
                input: '#e6e6e6',
                background: '#ffffff',
                foreground: '#000000',
                selection: {
                    DEFAULT: '#fa6e5a',
                    background: '#fa6e5a',
                    border: '#fa6e5a',
                    input: '#fa6e5a',
                },
                homeblue: {
                    DEFAULT: '#5a96fa',
                    background: '#5a96fa',
                },
                selected: {
                    DEFAULT: '#cefa5a',
                    background: '#cefa5a',
                    opacity: "var(--tw-opacity, 0.68)",
                },
                typography: {
                    DEFAULT: '#141b36',
                    foreground: '#141b36',
                },
                offwhite: {
                    DEFAULT: '#f9f9ff',
                    foreground: '#f9f9ff',
                },
                gray1: {
                    DEFAULT: '#e6e6e6',
                    foreground: '#e6e6e6',
                },
                gray2: {
                    DEFAULT: '#a0a3b1',
                    foreground: '#a0a3b1',
                    border: '#a0a3b1',
                    input: '#a0a3b1',
                },
                accent1: {
                    DEFAULT: '#ffc97e',
                    background: '#ffc97e',
                },
                accent2: {
                    DEFAULT: '#464646',
                    foreground: '#464646',
                },
                card: {
                    DEFAULT: '#ffffff',
                    foreground: '#000000',
                },
                popover: {
                    DEFAULT: '#ffffff',
                    foreground: '#000000',
                },
                primary: {
                    DEFAULT: '#fa6e5a',
                    foreground: '#ffffff',
                },
                secondary: {
                    DEFAULT: '#e6e6e6',
                    foreground: '#000000',
                },
                muted: {
                    DEFAULT: '#e6e6e6',
                    foreground: '#a0a3b1',
                },
                accent: {
                    DEFAULT: '#ffc97e',
                    foreground: '#464646',
                },
                destructive: {
                    DEFAULT: '#fa6e5a',
                    foreground: '#ffffff',
                },
                success: {
                    DEFAULT: '#5a96fa',
                    foreground: '#ffffff',
                },
                warning: {
                    DEFAULT: '#ffc97e',
                    foreground: '#ffffff',
                },
                info: {
                    DEFAULT: '#5a96fa',
                    foreground: '#ffffff',
                },
                // Paleta alternativa (dark theme) da collection 1
                dark: {
                    border: '#e6e6e6',
                    input: '#e6e6e6',
                    background: '#212637',
                    foreground: '#f9f9ff',
                    selection: {
                        DEFAULT: '#fa6e5a',
                        background: '#fa6e5a',
                        border: '#fa6e5a',
                        input: '#fa6e5a',
                    },
                    homeblue: {
                        DEFAULT: '#25406d',
                        background: '#25406d',
                    },
                    selected: {
                        DEFAULT: '#97ce00',
                        background: '#97ce00',
                        opacity: "var(--tw-opacity, 0.68)",
                    },
                    typography: {
                        DEFAULT: '#f9f9ff',
                        foreground: '#f9f9ff',
                    },
                    offwhite: {
                        DEFAULT: '#737373',
                        foreground: '#737373',
                    },
                    gray1: {
                        DEFAULT: '#a0a3b1',
                        foreground: '#a0a3b1',
                    },
                    gray2: {
                        DEFAULT: '#e6e6e6',
                        foreground: '#e6e6e6',
                        border: '#e6e6e6',
                        input: '#e6e6e6',
                    },
                    accent1: {
                        DEFAULT: '#082e91',
                        background: '#082e91',
                    },
                    accent2: {
                        DEFAULT: '#e6e6e6',
                        foreground: '#e6e6e6',
                    },
                    accent3: {
                        DEFAULT: '#e8e8e8',
                        foreground: '#e8e8e8',
                    },
                    card: {
                        DEFAULT: '#1a1f2d',
                        foreground: '#f9f9ff',
                    },
                    popover: {
                        DEFAULT: '#1a1f2d',
                        foreground: '#f9f9ff',
                    },
                    homeblob1: {
                        DEFAULT: '#1b4182',
                        background: '#1b4182',
                    },
                    homeblob2: {
                        DEFAULT: '#1f478c',
                        background: '#1f478c',
                    },
                },
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
} satisfies Config;
