import type { ThemeId } from '@clinro/types/schema'

export interface ThemeFonts {
  display: { family: string; weights: number[]; url?: string }
  body: { family: string; weights: number[]; url?: string }
  mono: { family: string; weights: number[]; url?: string }
}

export interface ThemeColors {
  bg: string
  fg: string
  primary: string
  secondary: string
  accent: string
  muted: string
  border: string
  surface: string
}

export type ThemeMotionDuration = 'snappy' | 'smooth' | 'slow'
export type ThemeMotionEasing = 'mechanical' | 'bouncy' | 'linear'

export interface ThemeMotion {
  duration: ThemeMotionDuration
  easing: ThemeMotionEasing
}

export interface Theme {
  id: ThemeId
  name: string
  description: string
  fonts: ThemeFonts
  colors: ThemeColors
  spacing: { scale: number }
  radius: { sm: string; md: string; lg: string }
  shadows: boolean
  motifs: string[]
  motion: ThemeMotion
  styles: string // CSS to inject
}
