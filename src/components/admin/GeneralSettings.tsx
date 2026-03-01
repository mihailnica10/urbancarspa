import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'

interface Tenant {
  id: string
  slug: string
  name: string
  tagline: string | null
  logoSvg: string | null
  logoUrl: string | null
  isActive: boolean
}

interface GeneralSettingsProps {
  tenant: Tenant
  onSave: (updates: Record<string, unknown>) => Promise<void>
  isSaving: boolean
}

export function GeneralSettings({ tenant, onSave, isSaving }: GeneralSettingsProps) {
  const [name, setName] = useState(tenant.name)
  const [tagline, setTagline] = useState(tenant.tagline || '')
  const [logoSvg, setLogoSvg] = useState(tenant.logoSvg || '')
  const [logoUrl, setLogoUrl] = useState(tenant.logoUrl || '')
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setHasChanges(
      name !== tenant.name ||
      tagline !== (tenant.tagline || '') ||
      logoSvg !== (tenant.logoSvg || '') ||
      logoUrl !== (tenant.logoUrl || '')
    )
  }, [name, tagline, logoSvg, logoUrl, tenant])

  const handleSave = () => {
    onSave({ name, tagline, logoSvg, logoUrl })
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">General Settings</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Basic information about this tenant
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              value={tenant.slug}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Your page will be available at: clin.ro/{tenant.slug}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="UrbanCarSpa"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              placeholder="Premium Auto Detailing"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoSvg">Logo SVG</Label>
            <Textarea
              id="logoSvg"
              value={logoSvg}
              onChange={e => setLogoSvg(e.target.value)}
              placeholder="<svg>...</svg>"
              rows={4}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Paste custom SVG code for the logo. Will be displayed above the name.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              value={logoUrl}
              onChange={e => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
            />
            <p className="text-xs text-muted-foreground">
              Alternatively, provide a URL to an hosted image.
            </p>
          </div>
        </div>

        {hasChanges && (
          <div className="flex justify-end pt-4 border-t border-border">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
