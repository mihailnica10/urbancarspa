/**
 * ThemeProvider - Manages theme switching with auto-cycle support
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Theme } from './types.js'
import { themes, getDefaultTheme } from './themes.js'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  cycleTheme: () => void
  isAutoCycling: boolean
  setIsAutoCycling: (enabled: boolean) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export interface ThemeProviderProps {
  children: ReactNode
  initialTheme?: string
  isTenantPage?: boolean // If true, disable auto-cycling
  autoCycleInterval?: number // Default 15000ms (15 seconds)
}

export function ThemeProvider({
  children,
  initialTheme,
  isTenantPage = false,
  autoCycleInterval = 15000,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (initialTheme) {
      const found = themes.find(t => t.id === initialTheme)
      if (found) return found
    }
    return getDefaultTheme()
  })

  const [isAutoCycling, setIsAutoCyclingState] = useState(!isTenantPage)

  // Apply theme styles to document
  useEffect(() => {
    // Inject theme styles
    const styleElement = document.getElementById('theme-styles')
    if (styleElement) {
      styleElement.textContent = theme.styles
    } else {
      const newStyleElement = document.createElement('style')
      newStyleElement.id = 'theme-styles'
      newStyleElement.textContent = theme.styles
      document.head.appendChild(newStyleElement)
    }

    // Set data-theme attribute
    document.documentElement.setAttribute('data-theme', theme.id)

    // Inject font links
    injectFontLinks(theme.fonts)
  }, [theme])

  // Auto-cycle themes for SaaS landing page
  useEffect(() => {
    if (!isTenantPage && isAutoCycling) {
      const interval = setInterval(() => {
        setThemeState(prev => {
          const currentIndex = themes.indexOf(prev)
          const nextIndex = (currentIndex + 1) % themes.length
          return themes[nextIndex]
        })
      }, autoCycleInterval)

      return () => clearInterval(interval)
    }
  }, [isTenantPage, isAutoCycling, autoCycleInterval])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    // Pause auto-cycling when user manually selects a theme
    if (isAutoCycling) {
      setIsAutoCyclingState(false)
    }
  }

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const setIsAutoCycling = (enabled: boolean) => {
    // Only allow enabling auto-cycle on non-tenant pages
    if (!isTenantPage || !enabled) {
      setIsAutoCyclingState(enabled)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, isAutoCycling, setIsAutoCycling }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// Helper to inject font links
function injectFontLinks(fonts: Theme['fonts']) {
  const fontUrls = [
    fonts.display.url,
    fonts.body.url,
    fonts.mono.url,
  ].filter(Boolean)

  fontUrls.forEach(url => {
    // Check if link already exists
    const existingLink = document.querySelector(`link[href="${url}"]`)
    if (!existingLink) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = url!
      document.head.appendChild(link)
    }
  })
}
