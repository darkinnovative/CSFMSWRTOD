/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    // Or more simply:
    './src/**/*.{js,ts,jsx,tsx,mdx}', 
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        },
        tech: {
          cyan: '#00d4ff',
          green: '#00ff88',
          purple: '#7d5aff',
          dark: '#0f1535',
          darker: '#070b1f',
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease-out forwards',
        fadeInDown: 'fadeInDown 0.6s ease-out forwards',
        fadeIn: 'fadeIn 0.5s ease-out',
        slideInLeft: 'slideInLeft 0.5s ease-out forwards',
        slideInRight: 'slideInRight 0.5s ease-out forwards',
        slideInUp: 'slideInUp 0.5s ease-out forwards',
        slideInDown: 'slideInDown 0.5s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
        glow: 'glow 2s ease-in-out infinite',
        bounce: 'bounce 1s infinite',
        'spin-slow': 'spin 3s linear infinite',
        scaleUp: 'scaleUp 0.3s ease-out',
        flip: 'flip 0.6s ease-in-out',
        shake: 'shake 0.5s ease-in-out',
        heartbeat: 'heartbeat 1.3s ease-in-out infinite',
        swingIn: 'swingIn 0.6s ease-out forwards',
        'circuit-glow': 'circuit-glow 3s ease-in-out infinite',
        'sensor-pulse': 'sensor-pulse 4s ease-in-out infinite',
        'tech-glow': 'tech-glow 2s ease-in-out infinite',
        'cyan-pulse': 'cyan-pulse 2s ease-in-out infinite',
        'green-pulse': 'green-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInDown: {
          from: { opacity: '0', transform: 'translateY(-30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)' },
          '50%': { boxShadow: '0 0 10px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.5)' },
        },
        scaleUp: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        flip: {
          '0%': { transform: 'rotateY(0deg)', opacity: '1' },
          '50%': { transform: 'rotateY(90deg)', opacity: '0.5' },
          '100%': { transform: 'rotateY(0deg)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '25%': { transform: 'scale(1.1)', opacity: '1' },
          '50%': { transform: 'scale(1)', opacity: '0.8' },
        },
        swingIn: {
          from: { opacity: '0', transform: 'rotateY(-90deg)' },
          to: { opacity: '1', transform: 'rotateY(0deg)' },
        },
        'circuit-glow': {
          '0%, 100%': { opacity: '0.3', boxShadow: '0 0 5px rgba(0, 212, 255, 0.3)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 15px rgba(0, 212, 255, 0.6)' },
        },
        'sensor-pulse': {
          '0%': { opacity: '0.05' },
          '50%': { opacity: '0.15' },
          '100%': { opacity: '0.05' },
        },
        'tech-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 212, 255, 0.3), inset 0 0 10px rgba(0, 212, 255, 0.1)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.5), inset 0 0 15px rgba(0, 212, 255, 0.2)' },
        },
        'cyan-pulse': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 212, 255, 0.4)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.8)' },
        },
        'green-pulse': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 255, 136, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
