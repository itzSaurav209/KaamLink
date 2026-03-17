// File: client/tailwind.config.js
// Purpose: Tailwind CSS configuration with KaamLink design system tokens

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#4F46E5',
        secondary: '#8B5CF6',
        accent: '#FBBF24',
        success: '#10B981',
        danger: '#EF4444',
        warning: '#FB923C',
      },
      boxShadow: {
        card: '0 10px 25px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};

