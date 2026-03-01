import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { BUTTON_VARIANTS, BUTTON_SIZES } from '@/db/schema'

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

interface CustomButtonsEditorProps {
  tenantId: string
  customButtons: CustomButton[]
}

const LUCIDE_ICONS = [
  'arrow-right',
  'calendar',
  'phone',
  'mail',
  'clock',
  'map-pin',
  'user',
  'star',
  'heart',
  'check',
  'x',
  'plus',
  'minus',
  'external-link',
]

export function CustomButtonsEditor({ tenantId, customButtons }: CustomButtonsEditorProps) {
  const [buttons, setButtons] = useState<CustomButton[]>(customButtons)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newButton, setNewButton] = useState({
    label: '',
    url: '',
    iconName: '',
    iconSvg: '',
    buttonVariant: 'default' as const,
    buttonSize: 'default' as const,
  })

  const handleAdd = async () => {
    if (!newButton.label || !newButton.url) return

    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}/custom-buttons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newButton),
      })

      if (response.ok) {
        const data = await response.json()
        setButtons([...buttons, data.customButton])
        setNewButton({
          label: '',
          url: '',
          iconName: '',
          iconSvg: '',
          buttonVariant: 'default',
          buttonSize: 'default',
        })
        setShowAddForm(false)
      }
    } catch (err) {
      console.error('Add error:', err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}/custom-buttons/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setButtons(buttons.filter(b => b.id !== id))
      }
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const handleToggle = async (id: string, isEnabled: boolean) => {
    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}/custom-buttons/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEnabled }),
      })

      if (response.ok) {
        setButtons(buttons.map(b => (b.id === id ? { ...b, isEnabled } : b)))
      }
    } catch (err) {
      console.error('Toggle error:', err)
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Custom Buttons</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add custom action buttons like &quot;Appointments&quot; or &quot;Contact&quot;
            </p>
          </div>
          <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Button
          </Button>
        </div>

        {/* Add New Button Form */}
        {showAddForm && (
          <div className="p-4 rounded-lg bg-muted/50 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Label</Label>
                <Input
                  placeholder="Book Appointment"
                  value={newButton.label}
                  onChange={e => setNewButton({ ...newButton, label: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  type="url"
                  placeholder="https://calendly.com/..."
                  value={newButton.url}
                  onChange={e => setNewButton({ ...newButton, url: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Icon (Lucide)</Label>
                <Select
                  value={newButton.iconName}
                  onValueChange={(v) => setNewButton({ ...newButton, iconName: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {LUCIDE_ICONS.map(icon => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label>Or Custom SVG</Label>
                <Textarea
                  placeholder="<svg>...</svg>"
                  value={newButton.iconSvg}
                  onChange={e => setNewButton({ ...newButton, iconSvg: e.target.value })}
                  rows={2}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label>Variant</Label>
                <Select
                  value={newButton.buttonVariant}
                  onValueChange={(v) => setNewButton({ ...newButton, buttonVariant: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BUTTON_VARIANTS.map(variant => (
                      <SelectItem key={variant} value={variant}>
                        {variant}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Size</Label>
                <Select
                  value={newButton.buttonSize}
                  onValueChange={(v) => setNewButton({ ...newButton, buttonSize: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BUTTON_SIZES.map(size => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAdd} size="sm">
                Add Button
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Existing Buttons */}
        <div className="space-y-2">
          {buttons.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No custom buttons added yet
            </p>
          ) : (
            buttons.map(button => (
              <div
                key={button.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card"
              >
                <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />

                <div className="flex-1 grid gap-2 sm:grid-cols-4">
                  <div>
                    <span className="text-xs text-muted-foreground">Label</span>
                    <p className="font-medium">{button.label}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">URL</span>
                    <p className="text-sm truncate">{button.url}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Icon</span>
                    <p className="text-sm">{button.iconName || 'Custom SVG'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Style</span>
                    <p className="text-sm">{button.buttonVariant} / {button.buttonSize}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(button.id, !button.isEnabled)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      button.isEnabled
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {button.isEnabled ? 'Active' : 'Hidden'}
                  </button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(button.id)}
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
