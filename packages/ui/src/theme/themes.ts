import type { Theme } from './types.js'

/**
 * Editorial Brutalist Theme
 * Magazine-inspired, raw typography, asymmetric layouts
 */
export const editorialBrutalistTheme: Theme = {
  id: 'editorial-brutalist',
  name: 'Editorial Brutalist',
  description: 'Raw typography, dramatic scale contrast, asymmetric grids',
  fonts: {
    display: {
      family: "'Instrument Serif', serif",
      weights: [400, 500, 600, 700],
      url: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap',
    },
    body: {
      family: "'Space Grotesk', sans-serif",
      weights: [300, 400, 500, 600, 700],
      url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
    },
    mono: {
      family: "'IBM Plex Mono', monospace",
      weights: [400, 500, 600],
      url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap',
    },
  },
  colors: {
    bg: '#0C1A0C',
    fg: '#E8E4DC',
    primary: '#D4A574',
    secondary: '#8B7355',
    accent: '#C45D3B',
    muted: '#6B7C68',
    border: '#3A4A3A',
    surface: '#1A2A1A',
  },
  spacing: { scale: 0.25 },
  radius: { sm: '0', md: '0', lg: '0px' },
  shadows: false,
  motifs: ['grid', 'noise', 'hairlines'],
  motion: { duration: 'smooth', easing: 'mechanical' },
  styles: `
    [data-theme="editorial-brutalist"] {
      --font-display: 'Instrument Serif', serif;
      --font-body: 'Space Grotesk', sans-serif;
      --font-mono: 'IBM Plex Mono', monospace;
      --color-bg: #0C1A0C;
      --color-fg: #E8E4DC;
      --color-primary: #D4A574;
      --color-secondary: #8B7355;
      --color-accent: #C45D3B;
      --color-muted: #6B7C68;
      --color-border: #3A4A3A;
      --color-surface: #1A2A1A;
      --radius-sm: 0;
      --radius-md: 0;
      --radius-lg: 0;
    }
  `,
}

/**
 * Retro Terminal Theme
 * 80s/90s computing, monospace focus, CRT effects
 */
export const retroTerminalTheme: Theme = {
  id: 'retro-terminal',
  name: 'Retro Terminal',
  description: '80s/90s computing aesthetics with CRT effects',
  fonts: {
    display: {
      family: "'IBM Plex Mono', monospace",
      weights: [400, 500, 600, 700],
      url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap',
    },
    body: {
      family: "'IBM Plex Mono', monospace",
      weights: [400, 500, 600],
      url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap',
    },
    mono: {
      family: "'IBM Plex Mono', monospace",
      weights: [400, 500, 600],
      url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap',
    },
  },
  colors: {
    bg: '#0A0A0F',
    fg: '#E8E8F0',
    primary: '#00D9FF',
    secondary: '#FFB800',
    accent: '#00D9FF',
    muted: '#4A4A5A',
    border: '#2A2A3A',
    surface: '#12121A',
  },
  spacing: { scale: 0.25 },
  radius: { sm: '0', md: '0', lg: '0' },
  shadows: false,
  motifs: ['scanlines', 'crt-flicker', 'phosphor-glow'],
  motion: { duration: 'snappy', easing: 'mechanical' },
  styles: `
    [data-theme="retro-terminal"] {
      --font-display: 'IBM Plex Mono', monospace;
      --font-body: 'IBM Plex Mono', monospace;
      --font-mono: 'IBM Plex Mono', monospace;
      --color-bg: #0A0A0F;
      --color-fg: #E8E8F0;
      --color-primary: #00D9FF;
      --color-secondary: #FFB800;
      --color-accent: #00D9FF;
      --color-muted: #4A4A5A;
      --color-border: #2A2A3A;
      --color-surface: #12121A;
      --radius-sm: 0;
      --radius-md: 0;
      --radius-lg: 0;
    }
  `,
}

/**
 * Soft Luxury Theme
 * Refined elegance, generous whitespace
 */
export const softLuxuryTheme: Theme = {
  id: 'soft-luxury',
  name: 'Soft Luxury',
  description: 'Refined elegance with generous whitespace',
  fonts: {
    display: {
      family: "'Cormorant', serif",
      weights: [300, 400, 500, 600, 700],
      url: 'https://fonts.googleapis.com/css2?family=Cormorant:wght@300;400;500;600;700&display=swap',
    },
    body: {
      family: "'Inter', sans-serif",
      weights: [300, 400, 500, 600],
      url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap',
    },
    mono: {
      family: "'JetBrains Mono', monospace",
      weights: [400, 500],
      url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap',
    },
  },
  colors: {
    bg: '#FAF8F5',
    fg: '#1A1A1A',
    primary: '#C9A962',
    secondary: '#8B7355',
    accent: '#D4A5A5',
    muted: '#9A9A9A',
    border: '#E5E0D8',
    surface: '#FFFFFF',
  },
  spacing: { scale: 0.5 },
  radius: { sm: '4px', md: '8px', lg: '16px' },
  shadows: true,
  motifs: ['elegant-lines', 'subtle-gradient'],
  motion: { duration: 'slow', easing: 'bouncy' },
  styles: `
    [data-theme="soft-luxury"] {
      --font-display: 'Cormorant', serif;
      --font-body: 'Inter', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      --color-bg: #FAF8F5;
      --color-fg: #1A1A1A;
      --color-primary: #C9A962;
      --color-secondary: #8B7355;
      --color-accent: #D4A5A5;
      --color-muted: #9A9A9A;
      --color-border: #E5E0D8;
      --color-surface: #FFFFFF;
      --radius-sm: 4px;
      --radius-md: 8px;
      --radius-lg: 16px;
    }
  `,
}

/**
 * Vaporwave Theme
 * Neon, gradients, Japanese text, retro-3D
 */
export const vaporwaveTheme: Theme = {
  id: 'vaporwave',
  name: 'Vaporwave',
  description: 'Neon aesthetics with retro-3D vibes',
  fonts: {
    display: {
      family: "'Righteous', cursive",
      weights: [400],
      url: 'https://fonts.googleapis.com/css2?family=Righteous&display=swap',
    },
    body: {
      family: "'Quicksand', sans-serif",
      weights: [300, 400, 500, 600, 700],
      url: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap',
    },
    mono: {
      family: "'Fira Code', monospace",
      weights: [400, 500],
      url: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap',
    },
  },
  colors: {
    bg: '#1A0B2E',
    fg: '#FFB5E8',
    primary: '#FF6EC7',
    secondary: '#00FFFF',
    accent: '#FFE600',
    muted: '#B5A6E8',
    border: '#4A3A6A',
    surface: '#2A1B4E',
  },
  spacing: { scale: 0.25 },
  radius: { sm: '4px', md: '8px', lg: '16px' },
  shadows: true,
  motifs: ['grid', 'gradient', 'floating-shapes'],
  motion: { duration: 'smooth', easing: 'bouncy' },
  styles: `
    [data-theme="vaporwave"] {
      --font-display: 'Righteous', cursive;
      --font-body: 'Quicksand', sans-serif;
      --font-mono: 'Fira Code', monospace;
      --color-bg: #1A0B2E;
      --color-fg: #FFB5E8;
      --color-primary: #FF6EC7;
      --color-secondary: #00FFFF;
      --color-accent: #FFE600;
      --color-muted: #B5A6E8;
      --color-border: #4A3A6A;
      --color-surface: #2A1B4E;
      --radius-sm: 4px;
      --radius-md: 8px;
      --radius-lg: 16px;
    }
  `,
}

/**
 * Swiss Minimalist Theme
 * Grid-based, Helvetica-like, functional
 */
export const swissMinimalistTheme: Theme = {
  id: 'swiss-minimalist',
  name: 'Swiss Minimalist',
  description: 'Strict grids with mathematical spacing',
  fonts: {
    display: {
      family: "'Inter', sans-serif",
      weights: [700, 800, 900],
      url: 'https://fonts.googleapis.com/css2?family=Inter:wght@700;800;900&display=swap',
    },
    body: {
      family: "'Inter', sans-serif",
      weights: [300, 400, 500, 600],
      url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap',
    },
    mono: {
      family: "'Space Mono', monospace",
      weights: [400, 700],
      url: 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap',
    },
  },
  colors: {
    bg: '#FFFFFF',
    fg: '#000000',
    primary: '#FF0000',
    secondary: '#666666',
    accent: '#FF0000',
    muted: '#999999',
    border: '#000000',
    surface: '#F5F5F5',
  },
  spacing: { scale: 0.5 },
  radius: { sm: '0', md: '0', lg: '0' },
  shadows: false,
  motifs: ['grid', 'strict-alignment'],
  motion: { duration: 'snappy', easing: 'linear' },
  styles: `
    [data-theme="swiss-minimalist"] {
      --font-display: 'Inter', sans-serif;
      --font-body: 'Inter', sans-serif;
      --font-mono: 'Space Mono', monospace;
      --color-bg: #FFFFFF;
      --color-fg: #000000;
      --color-primary: #FF0000;
      --color-secondary: #666666;
      --color-accent: #FF0000;
      --color-muted: #999999;
      --color-border: #000000;
      --color-surface: #F5F5F5;
      --radius-sm: 0;
      --radius-md: 0;
      --radius-lg: 0;
    }
  `,
}

/**
 * Dark Cyberpunk Theme
 * High contrast neon, glitch effects
 */
export const darkCyberpunkTheme: Theme = {
  id: 'dark-cyberpunk',
  name: 'Dark Cyberpunk',
  description: 'High contrast neon with angular shapes',
  fonts: {
    display: {
      family: "'Orbitron', sans-serif",
      weights: [500, 700, 900],
      url: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&display=swap',
    },
    body: {
      family: "'Rajdhani', sans-serif",
      weights: [300, 400, 500, 600, 700],
      url: 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap',
    },
    mono: {
      family: "'Share Tech Mono', monospace",
      weights: [400],
      url: 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap',
    },
  },
  colors: {
    bg: '#050505',
    fg: '#E0E0E0',
    primary: '#FF006E',
    secondary: '#00F5FF',
    accent: '#39FF14',
    muted: '#6B6B6B',
    border: '#FF006E',
    surface: '#0A0A0A',
  },
  spacing: { scale: 0.25 },
  radius: { sm: '0', md: '2px', lg: '4px' },
  shadows: true,
  motifs: ['glitch', 'scanlines', 'angular'],
  motion: { duration: 'snappy', easing: 'mechanical' },
  styles: `
    [data-theme="dark-cyberpunk"] {
      --font-display: 'Orbitron', sans-serif;
      --font-body: 'Rajdhani', sans-serif;
      --font-mono: 'Share Tech Mono', monospace;
      --color-bg: #050505;
      --color-fg: #E0E0E0;
      --color-primary: #FF006E;
      --color-secondary: #00F5FF;
      --color-accent: #39FF14;
      --color-muted: #6B6B6B;
      --color-border: #FF006E;
      --color-surface: #0A0A0A;
      --radius-sm: 0;
      --radius-md: 2px;
      --radius-lg: 4px;
    }
  `,
}

/**
 * All available themes
 */
export const themes: Theme[] = [
  editorialBrutalistTheme,
  retroTerminalTheme,
  softLuxuryTheme,
  vaporwaveTheme,
  swissMinimalistTheme,
  darkCyberpunkTheme,
]

/**
 * Get theme by ID
 */
export function getThemeById(id: string): Theme | undefined {
  return themes.find(theme => theme.id === id)
}

/**
 * Get default theme
 */
export function getDefaultTheme(): Theme {
  return editorialBrutalistTheme
}
