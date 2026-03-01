import { useState, useEffect } from 'react'
import { AdminLayout } from './AdminLayout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, ExternalLink, Edit, Trash2 } from 'lucide-react'

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

export function Dashboard() {
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tenant?')) return

    try {
      const response = await fetch(`/api/admin/tenants/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Refresh page to update data
        window.location.reload()
      }
    } catch (err) {
      console.error('Delete error:', err)
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
          <p className="text-muted-foreground">Failed to load admin data</p>
        </div>
      </AdminLayout>
    )
  }

  const { user, tenants } = adminData

  return (
    <AdminLayout user={user} title="All Tenants">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Manage Tenants</h2>
            <p className="text-muted-foreground mt-1">
              Create and manage tenant landing pages
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Tenant
          </Button>
        </div>

        {/* Tenants Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 font-semibold text-sm text-muted-foreground">
                    Name
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-muted-foreground">
                    Slug
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-muted-foreground">
                    Created
                  </th>
                  <th className="text-right py-4 px-6 font-semibold text-sm text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tenants.map(tenant => (
                  <tr key={tenant.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-foreground">{tenant.name}</div>
                        {tenant.tagline && (
                          <div className="text-sm text-muted-foreground">{tenant.tagline}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <code className="text-sm font-mono text-muted-foreground">
                        {tenant.slug}
                      </code>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={tenant.isActive ? 'default' : 'secondary'}>
                        {tenant.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">
                      {new Date(tenant.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/${tenant.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                          title="View page"
                        >
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </a>
                        <a
                          href={`/admin/${tenant.slug}`}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                          title="Edit tenant"
                        >
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </a>
                        <button
                          onClick={() => handleDelete(tenant.id)}
                          className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                          title="Delete tenant"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {tenants.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground">
                      No tenants yet. Create your first tenant to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
