import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    // './src/common/**/*.{js,ts,jsx,tsx,mdx}',
    // './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    // './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {},
      colors: {
        primary: '#3264FF',
        secondary: '#1A1A1A',
        yellow: '#FDB022',
        red: '#D41142',
        green: '#28A744',
        pink: '#F94C86',
        'soft-pink': 'rgba(255, 241, 246, 1)',
        'soft-secondary': 'rgba(26, 26, 26, 0.137)',
        'soft-primary': 'rgba(50, 101, 255, 0.137)',
      },
    },
  },
  plugins: [],
};
export default config;
