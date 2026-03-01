/**
 * Tenant Editor Page
 * Edit tenant configuration including theme selection
 */

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'

// Import themes - using a simpler approach to avoid module resolution issues
const themes = [
  { id: 'editorial-brutalist', name: 'Editorial Brutalist', description: 'Magazine-inspired, raw typography', colors: { primary: '#D4A574', secondary: '#8B7355' } },
  { id: 'retro-terminal', name: 'Retro Terminal', description: '80s/90s computing, CRT effects', colors: { primary: '#00D9FF', secondary: '#FFB800' } },
  { id: 'soft-luxury', name: 'Soft Luxury', description: 'Refined elegance, generous whitespace', colors: { primary: '#C9A962', secondary: '#8B7355' } },
  { id: 'vaporwave', name: 'Vaporwave', description: 'Neon aesthetics with retro-3D vibes', colors: { primary: '#FF6EC7', secondary: '#00FFFF' } },
  { id: 'swiss-minimalist', name: 'Swiss Minimalist', description: 'Strict grids with mathematical spacing', colors: { primary: '#FF0000', secondary: '#666666' } },
  { id: 'dark-cyberpunk', name: 'Dark Cyberpunk', description: 'High contrast neon with angular shapes', colors: { primary: '#FF006E', secondary: '#00F5FF' } },
] as const

interface TenantData {
  tenant: {
    id: string
    slug: string
    name: string
    tagline: string | null
    themeId: string
  }
  theme: {
    backgroundColor: string
    foregroundColor: string
    primaryColor: string
  }
}

export function TenantEditorPage() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const [tenantData, setTenantData] = useState<TenantData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (tenantId) {
      loadTenantData(tenantId)
    }
  }, [tenantId])

  const loadTenantData = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/tenants/${id}`)
      if (!response.ok) throw new Error('Failed to load tenant')

      const data = await response.json()
      setTenantData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tenant')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!tenantData) return

    setIsSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/tenants/${tenantData.tenant.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tenantData.tenant.name,
          tagline: tenantData.tenant.tagline,
          themeId: tenantData.tenant.themeId,
        }),
      })

      if (!response.ok) throw new Error('Failed to save tenant')

      // Show success feedback
      alert('Tenant saved successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save tenant')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-[var(--color-muted)]">Loading...</div>
      </div>
    )
  }

  if (error || !tenantData) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-red-500">{error || 'Tenant not found'}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded hover:bg-[var(--color-bg)] transition"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--color-fg)]" />
          </button>
          <h1 className="text-xl font-bold text-[var(--color-fg)]">Edit Tenant: {tenantData.tenant.slug}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Basic Settings */}
          <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--color-fg)] mb-4">Basic Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-fg)] mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={tenantData.tenant.name}
                  onChange={e => setTenantData({
                    ...tenantData,
                    tenant: { ...tenantData.tenant, name: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-[var(--color-fg)] focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-fg)] mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={tenantData.tenant.tagline || ''}
                  onChange={e => setTenantData({
                    ...tenantData,
                    tenant: { ...tenantData.tenant, tagline: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-[var(--color-fg)] focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>
          </section>

          {/* Theme Selection */}
          <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--color-fg)] mb-4">Theme</h2>
            <p className="text-sm text-[var(--color-muted)] mb-4">
              Select the theme for this tenant's landing page. The theme controls fonts, colors, and visual style.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setTenantData({
                    ...tenantData,
                    tenant: { ...tenantData.tenant, themeId: theme.id }
                  })}
                  className={`p-4 rounded-lg border-2 transition ${
                    tenantData.tenant.themeId === theme.id
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                      : 'border-[var(--color-border)] hover:border-[var(--color-muted)]'
                  }`}
                >
                  {/* Theme preview */}
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div className="text-left">
                      <div className="font-medium text-[var(--color-fg)]">{theme.name}</div>
                      <div className="text-xs text-[var(--color-muted)]">{theme.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-[var(--color-primary)] text-[var(--color-bg)] rounded font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
