import { createContext, useContext, type ReactNode, useEffect } from 'react'
import type { Tenant, TenantTheme, TenantSocialLink, TenantCustomButton } from '@/db/schema'

interface TenantContextValue {
  tenant: Tenant
  theme: TenantTheme
  socialLinks: TenantSocialLink[]
  customButtons: TenantCustomButton[]
}

const TenantContext = createContext<TenantContextValue | null>(null)

interface TenantProviderProps {
  children: ReactNode
  tenant: Tenant
  theme: TenantTheme
  socialLinks: TenantSocialLink[]
  customButtons: TenantCustomButton[]
}

export function TenantProvider({ children, tenant, theme, socialLinks, customButtons }: TenantProviderProps) {
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--background', theme.backgroundColor)
    root.style.setProperty('--foreground', theme.foregroundColor)
    root.style.setProperty('--primary', theme.primaryColor)
    root.style.setProperty('--secondary', theme.secondaryColor)
    root.style.setProperty('--accent', theme.accentColor)
    root.style.setProperty('--muted', theme.mutedColor)
    root.style.setProperty('--border', theme.borderColor)
    root.style.setProperty('--card', theme.cardColor)
    root.style.setProperty('--radius', theme.radius)
  }, [theme])

  return (
    <TenantContext.Provider value={{ tenant, theme, socialLinks, customButtons }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) throw new Error('useTenant must be used within TenantProvider')
  return context
}
