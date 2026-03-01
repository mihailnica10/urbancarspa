/**
 * Dashboard Page
 * Tenant management interface
 */

import { useEffect, useState } from 'react'
import { Plus, ExternalLink, Edit, Trash2, LogOut } from 'lucide-react'

interface Tenant {
  id: string
  slug: string
  name: string
  tagline: string | null
  isActive: boolean
  createdAt: string
}

interface AdminData {
  user: {
    id: string
    email: string
    name: string | null
    role: string
  }
  tenants: Tenant[]
}

export function DashboardPage() {
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      if (!response.ok) throw new Error('Failed to load dashboard')

      const data = await response.json()
      setAdminData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm(`Are you sure you want to delete "${slug}"?`)) return

    try {
      const response = await fetch(`/api/admin/tenants/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete tenant')

      // Reload dashboard
      loadDashboardData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete tenant')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-[var(--color-muted)]">Loading...</div>
      </div>
    )
  }

  if (error || !adminData) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-red-500">{error || 'Failed to load dashboard'}</div>
      </div>
    )
  }

  const { user, tenants } = adminData

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[var(--color-fg)]">CLIN-RO Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--color-muted)]">{user.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--color-fg)] hover:text-[var(--color-primary)] transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-fg)]">Manage Tenants</h2>
            <p className="text-[var(--color-muted)] mt-1">
              Create and manage tenant landing pages
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-bg)] rounded font-medium hover:opacity-90 transition">
            <Plus className="w-4 h-4" />
            New Tenant
          </button>
        </div>

        {/* Tenants Table */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-4 px-6 font-semibold text-sm text-[var(--color-muted)]">
                  Name
                </th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-[var(--color-muted)]">
                  Slug
                </th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-[var(--color-muted)]">
                  Status
                </th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-[var(--color-muted)]">
                  Created
                </th>
                <th className="text-right py-4 px-6 font-semibold text-sm text-[var(--color-muted)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tenants.map(tenant => (
                <tr key={tenant.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-semibold text-[var(--color-fg)]">{tenant.name}</div>
                      {tenant.tagline && (
                        <div className="text-sm text-[var(--color-muted)]">{tenant.tagline}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <code className="text-sm font-mono text-[var(--color-muted)]">
                      {tenant.slug}
                    </code>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                      tenant.isActive
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-gray-500/10 text-gray-500'
                    }`}>
                      {tenant.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-[var(--color-muted)]">
                    {new Date(tenant.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/${tenant.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded hover:bg-[var(--color-bg)] transition"
                        title="View page"
                      >
                        <ExternalLink className="w-4 h-4 text-[var(--color-muted)]" />
                      </a>
                      <a
                        href={`/tenant/${tenant.slug}`}
                        className="p-2 rounded hover:bg-[var(--color-bg)] transition"
                        title="Edit tenant"
                      >
                        <Edit className="w-4 h-4 text-[var(--color-muted)]" />
                      </a>
                      <button
                        onClick={() => handleDelete(tenant.id, tenant.slug)}
                        className="p-2 rounded hover:bg-red-500/10 transition"
                        title="Delete tenant"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {tenants.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[var(--color-muted)]">
                    No tenants yet. Create your first tenant to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
