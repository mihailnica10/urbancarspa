import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../apps/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        fg: 'var(--color-fg)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
        surface: 'var(--color-surface)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        sans: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      spacing: {
        theme: 'calc(var(--spacing-scale, 0.25) * 1rem)',
      },
      animation: {
        'scanline': 'scanline 8s linear infinite',
        'phosphor-pulse': 'phosphor-pulse 2s ease-in-out infinite',
        'glitch': 'glitch 0.3s ease-in-out infinite',
        'crt-flicker': 'crt-flicker 0.15s infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config
