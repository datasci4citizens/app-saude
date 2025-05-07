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
				border: stone[200],
				input: stone[200],
				background: white,
				foreground: stone[950],
				//00 color
				orange: {
					DEFAULT: '#FA6E5A',
					background: '#FA6E5A',
					border: '#FA6E5A',
					input: '#FA6E5A',
				},
				//01 color
				blue_page:{
					DEFAULT: '#5A96FA',
					background: '#5A96FA',
				},
				//02 color
				// opacity 68
				yellow_select:{
					DEFAULT: '#CEFA5A',
					background: '#CEFA5A',
					opacity: "var(--tw-opacity, 0.68)",
				},
				//03 color
				blue_tittle:{
					DEFAULT: '#141B36',
					foreground: '#141B36',
				},
				//04 color
				off_white:{
					DEFAULT: '#F9F9FF',
					foreground: '#F9F9FF',
				},
				//typografy
				typography: {
					DEFAULT: '#000000',
					foreground: '#000000',
				},
				//color 5
				gray_text:{
					DEFAULT: "#E6E6E6",
					foreground: "#E6E6E6",
				},
				//color 6
				gray_buttons:{
					DEFAULT: "#A0A3B1",
					foreground: "#A0A3B1",
					border: "#A0A3B1",
					input: "#A0A3B1",
				},
				//color 7
				allert_color:{
					DEFAULT: '#FFC97E',
					background: '#FFC97E',
				},
				card: {
					// biome-ignore lint/style/useNamingConvention: external naming
					DEFAULT: white,
					foreground: stone[950],
				},
				popover: {
					// biome-ignore lint/style/useNamingConvention: external naming
					DEFAULT: white,
					foreground: stone[950],
				},
				primary: {
					// biome-ignore lint/style/useNamingConvention: external naming
					DEFAULT: orange[500],
					foreground: orange[50],
				},
				secondary: {
					// biome-ignore lint/style/useNamingConvention: external naming
					DEFAULT: stone[100],
					foreground: stone[900],
				},
				muted: {
					// biome-ignore lint/style/useNamingConvention: external naming
					DEFAULT: stone[100],
					foreground: stone[500],
				},
				accent: {
					// biome-ignore lint/style/useNamingConvention: external naming
					DEFAULT: orange[100],
					foreground: orange[900],
				},
				destructive: {
					// biome-ignore lint/style/useNamingConvention: external naming
					DEFAULT: red[500],
					foreground: red[50],
				},
				success: {
					// biome-ignore lint/style/useNamingConvention: external naming
					DEFAULT: green[500],
					foreground: green[50],
				},
				warning: {
					// biome-ignore lint/style/useNamingConvention: external naming
					DEFAULT: yellow[500],
					foreground: yellow[50],
				},
				info: {
					// biome-ignore lint/style/useNamingConvention: external naming
					DEFAULT: blue[500],
					foreground: blue[50],
				},
			},
		},
		plugins: [require('tailwindcss-animate')],
	},
} satisfies Config;
