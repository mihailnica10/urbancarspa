import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { SOCIAL_PLATFORMS, type SocialPlatform } from '@/db/schema'

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

interface SocialLinksEditorProps {
  tenantId: string
  socialLinks: SocialLink[]
}

export function SocialLinksEditor({ tenantId, socialLinks }: SocialLinksEditorProps) {
  const [links, setLinks] = useState<SocialLink[]>(socialLinks)
  const [newLinkPlatform, setNewLinkPlatform] = useState<SocialPlatform>('instagram')
  const [newLinkUrl, setNewLinkUrl] = useState('')
  const [newLinkDisplayName, setNewLinkDisplayName] = useState('')

  const handleAdd = async () => {
    if (!newLinkUrl) return

    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}/social-links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: newLinkPlatform,
          url: newLinkUrl,
          displayName: newLinkDisplayName || newLinkPlatform,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setLinks([...links, data.socialLink])
        setNewLinkUrl('')
        setNewLinkDisplayName('')
      }
    } catch (err) {
      console.error('Add error:', err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}/social-links/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setLinks(links.filter(l => l.id !== id))
      }
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const handleToggle = async (id: string, isEnabled: boolean) => {
    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}/social-links/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEnabled }),
      })

      if (response.ok) {
        setLinks(links.map(l => (l.id === id ? { ...l, isEnabled } : l)))
      }
    } catch (err) {
      console.error('Toggle error:', err)
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Social Media Links</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Add and manage social media links for this tenant
          </p>
        </div>

        {/* Add New Link */}
        <div className="p-4 rounded-lg bg-muted/50 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={newLinkPlatform} onValueChange={(v) => setNewLinkPlatform(v as SocialPlatform)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SOCIAL_PLATFORMS).map(([key, value]) => (
                    <SelectItem key={value} value={value}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                type="url"
                placeholder="https://instagram.com/username"
                value={newLinkUrl}
                onChange={e => setNewLinkUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Display Name (optional)</Label>
              <Input
                placeholder="Instagram"
                value={newLinkDisplayName}
                onChange={e => setNewLinkDisplayName(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleAdd} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>

        {/* Existing Links */}
        <div className="space-y-2">
          {links.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No social links added yet
            </p>
          ) : (
            links.map(link => (
              <div
                key={link.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card"
              >
                <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />

                <div className="flex-1 grid gap-2 sm:grid-cols-3">
                  <div>
                    <span className="text-xs text-muted-foreground">Platform</span>
                    <p className="font-medium capitalize">{link.platform}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">URL</span>
                    <p className="text-sm truncate">{link.url}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Display Name</span>
                    <p className="text-sm">{link.displayName || link.platform}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(link.id, !link.isEnabled)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      link.isEnabled
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {link.isEnabled ? 'Active' : 'Hidden'}
                  </button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(link.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  )
}
