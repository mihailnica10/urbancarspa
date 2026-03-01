import { useState, useEffect } from 'react'
import { AdminLayout } from './AdminLayout'
import { GeneralSettings } from './GeneralSettings'
import { ThemeEditor } from './ThemeEditor'
import { SocialLinksEditor } from './SocialLinksEditor'
import { CustomButtonsEditor } from './CustomButtonsEditor'

interface Tenant {
  id: string
  slug: string
  name: string
  tagline: string | null
  logoSvg: string | null
  logoUrl: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface TenantTheme {
  id: string
  tenantId: string
  backgroundColor: string
  foregroundColor: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  mutedColor: string
  borderColor: string
  cardColor: string
  radius: string
}

interface SocialLink {
  id: string
  tenantId: string
  platform: string
  url: string
  displayName: string | null
  iconSvg: string | null
  isEnabled: boolean
  displayOrder: number | null
}

interface CustomButton {
  id: string
  tenantId: string
  label: string
  url: string
  iconName: string | null
  iconSvg: string | null
  buttonVariant: string
  buttonSize: string
  isEnabled: boolean
  displayOrder: number | null
}

interface AdminData {
  user: {
    id: string
    email: string
    name: string | null
    role: string
  }
  tenant: Tenant & {
    theme?: TenantTheme
    socialLinks?: SocialLink[]
    customButtons?: CustomButton[]
  }
}

type Tab = 'general' | 'theme' | 'social' | 'buttons'

export function TenantEditor() {
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('general')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Read admin data from injected script tag
    const scriptTag = document.getElementById('__ADMIN_DATA__')
    if (scriptTag) {
      try {
        const data = JSON.parse(scriptTag.textContent || '{}')
        setAdminData(data)
      } catch (e) {
        console.error('Failed to parse admin data:', e)
      }
    }
    setIsLoading(false)
  }, [])

  const handleSave = async (updates: Record<string, unknown>) => {
    if (!adminData) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/tenants/${adminData.tenant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const data = await response.json()
        setAdminData(prev => ({
          ...prev!,
          tenant: { ...prev!.tenant, ...data.tenant },
        }))
      }
    } catch (err) {
      console.error('Save error:', err)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </AdminLayout>
    )
  }

  if (!adminData) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load tenant data</p>
        </div>
      </AdminLayout>
    )
  }

  const { user, tenant } = adminData

  return (
    <AdminLayout user={user} title={tenant.name}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{tenant.name}</h2>
            <p className="text-muted-foreground mt-1">
              <a href={`/${tenant.slug}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                clin.ro/{tenant.slug}
              </a>
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex gap-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === 'general'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === 'theme'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Theme
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === 'social'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Social Links
            </button>
            <button
              onClick={() => setActiveTab('buttons')}
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === 'buttons'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Custom Buttons
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'general' && (
          <GeneralSettings tenant={tenant} onSave={handleSave} isSaving={isSaving} />
        )}
        {activeTab === 'theme' && (
          <ThemeEditor tenant={tenant} onSave={handleSave} isSaving={isSaving} />
        )}
        {activeTab === 'social' && (
          <SocialLinksEditor tenantId={tenant.id} socialLinks={tenant.socialLinks || []} />
        )}
        {activeTab === 'buttons' && (
          <CustomButtonsEditor tenantId={tenant.id} customButtons={tenant.customButtons || []} />
        )}
      </div>
    </AdminLayout>
  )
}
