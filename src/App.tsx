import { useState, useEffect } from 'react'
import { TenantProvider } from './components/tenant/TenantProvider'
import { TenantLandingPage } from './components/tenant/TenantLandingPage'
import { SaaSHomePage } from './components/landing/SaaSHomePage'
import { Login } from './components/admin/Login'
import { Dashboard } from './components/admin/Dashboard'
import { TenantEditor } from './components/admin/TenantEditor'
import type { Tenant, TenantTheme, TenantSocialLink, TenantCustomButton } from './db/schema'

// Types for injected tenant data
interface InjectedTenantData {
  tenant: Tenant
  theme: TenantTheme
  socialLinks: TenantSocialLink[]
  customButtons: TenantCustomButton[]
}

interface AdminData {
  user: {
    id: string
    email: string
    name: string | null
    role: string
  }
  tenants?: Tenant[]
  tenant?: Tenant & {
    theme?: TenantTheme
    socialLinks?: TenantSocialLink[]
    customButtons?: TenantCustomButton[]
  }
}

function App() {
  const [tenantData, setTenantData] = useState<InjectedTenantData | null>(null)
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Read tenant data from injected script tag
    const tenantScript = document.getElementById('__TENANT_DATA__')
    // Read admin data from injected script tag
    const adminScript = document.getElementById('__ADMIN_DATA__')

    if (tenantScript && tenantScript.textContent) {
      try {
        const data = JSON.parse(tenantScript.textContent)
        setTenantData(data)
      } catch (e) {
        console.error('Failed to parse tenant data:', e)
      }
    }

    if (adminScript && adminScript.textContent) {
      try {
        const data = JSON.parse(adminScript.textContent)
        setAdminData(data)
      } catch (e) {
        console.error('Failed to parse admin data:', e)
      }
    }

    setIsLoading(false)
  }, [])

  // Check current route
  const currentPath = window.location.pathname

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground">Loading...</div>
      </div>
    )
  }

  // Check route and render appropriate component

  // Admin login page
  if (currentPath === '/admin/login' || currentPath === '/admin/auth/login') {
    return <Login />
  }

  // Admin dashboard (global)
  if (currentPath === '/admin' && adminData?.tenants) {
    return <Dashboard />
  }

  // Admin dashboard (per-tenant)
  if (currentPath.startsWith('/admin/') && adminData?.tenant) {
    return <TenantEditor />
  }

  // Tenant landing page
  if (tenantData) {
    return (
      <TenantProvider
        tenant={tenantData.tenant}
        theme={tenantData.theme}
        socialLinks={tenantData.socialLinks}
        customButtons={tenantData.customButtons}
      >
        <TenantLandingPage />
      </TenantProvider>
    )
  }

  // Default: SaaS landing page
  return <SaaSHomePage />
}

export default App
