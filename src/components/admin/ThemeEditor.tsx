import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface Tenant {
  id: string
  name: string
  theme?: {
    backgroundColor?: string
    foregroundColor?: string
    primaryColor?: string
    secondaryColor?: string
    accentColor?: string
    mutedColor?: string
    borderColor?: string
    cardColor?: string
    radius?: string
  }
}

interface ThemeEditorProps {
  tenant: Tenant
  onSave: (updates: Record<string, unknown>) => Promise<void>
  isSaving: boolean
}

interface ColorFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
}

function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
      <div className="flex gap-2">
        <div
          className="w-10 h-10 rounded-lg border border-border shrink-0"
          style={{ backgroundColor: `hsl(${value})` }}
        />
        <Input
          id={label}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="0 0 0"
          className="font-mono"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        HSL values (e.g., &quot;0 0 0&quot; for black, &quot;220 38 38&quot; for red)
      </p>
    </div>
  )
}

export function ThemeEditor({ tenant, onSave, isSaving }: ThemeEditorProps) {
  const theme = tenant.theme || {}

  const [backgroundColor, setBackgroundColor] = useState(theme.backgroundColor || '0 0 0')
  const [foregroundColor, setForegroundColor] = useState(theme.foregroundColor || '255 255 255')
  const [primaryColor, setPrimaryColor] = useState(theme.primaryColor || '220 38 38')
  const [secondaryColor, setSecondaryColor] = useState(theme.secondaryColor || '39 39 42')
  const [accentColor, setAccentColor] = useState(theme.accentColor || '220 38 38')
  const [mutedColor, setMutedColor] = useState(theme.mutedColor || '39 39 42')
  const [borderColor, setBorderColor] = useState(theme.borderColor || '39 39 42')
  const [cardColor, setCardColor] = useState(theme.cardColor || '24 24 24')
  const [radius, setRadius] = useState(theme.radius || '0.625rem')

  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    const currentTheme = {
      backgroundColor,
      foregroundColor,
      primaryColor,
      secondaryColor,
      accentColor,
      mutedColor,
      borderColor,
      cardColor,
      radius,
    }
    setHasChanges(JSON.stringify(currentTheme) !== JSON.stringify(theme))
  }, [backgroundColor, foregroundColor, primaryColor, secondaryColor, accentColor, mutedColor, borderColor, cardColor, radius, theme])

  const handleSave = () => {
    onSave({
      theme: {
        backgroundColor,
        foregroundColor,
        primaryColor,
        secondaryColor,
        accentColor,
        mutedColor,
        borderColor,
        cardColor,
        radius,
      },
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Color Settings */}
      <Card className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Color Theme</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Customize the color palette for this tenant
          </p>
        </div>

        <div className="space-y-4">
          <ColorField label="Background" value={backgroundColor} onChange={setBackgroundColor} />
          <ColorField label="Foreground" value={foregroundColor} onChange={setForegroundColor} />
          <ColorField label="Primary" value={primaryColor} onChange={setPrimaryColor} />
          <ColorField label="Secondary" value={secondaryColor} onChange={setSecondaryColor} />
          <ColorField label="Accent" value={accentColor} onChange={setAccentColor} />
          <ColorField label="Muted" value={mutedColor} onChange={setMutedColor} />
          <ColorField label="Border" value={borderColor} onChange={setBorderColor} />
          <ColorField label="Card" value={cardColor} onChange={setCardColor} />

          <div className="space-y-2">
            <Label htmlFor="radius">Border Radius</Label>
            <Input
              id="radius"
              value={radius}
              onChange={e => setRadius(e.target.value)}
              placeholder="0.625rem"
            />
          </div>
        </div>

        {hasChanges && (
          <div className="flex justify-end pt-4 border-t border-border">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </Card>

      {/* Live Preview */}
      <Card className="p-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Live Preview</h3>
          <p className="text-sm text-muted-foreground mt-1">
            See how your theme looks in real-time
          </p>
        </div>

        <div
          className="mt-6 p-6 rounded-xl border"
          style={{
            backgroundColor: `hsl(${backgroundColor})`,
            color: `hsl(${foregroundColor})`,
            borderColor: `hsl(${borderColor})`,
          }}
        >
          <h4
            className="text-2xl font-bold mb-2"
            style={{ color: `hsl(${foregroundColor})` }}
          >
            {tenant.name}
          </h4>
          <p
            className="text-sm uppercase tracking-wider mb-4"
            style={{ color: `hsl(${mutedColor})` }}
          >
            PREVIEW TAGLINE
          </p>

          <div className="space-y-2">
            <Button
              size="sm"
              style={{
                backgroundColor: `hsl(${primaryColor})`,
                color: `hsl(${foregroundColor})`,
              }}
            >
              Primary Button
            </Button>
            <Button
              size="sm"
              variant="outline"
              style={{
                borderColor: `hsl(${borderColor})`,
                color: `hsl(${foregroundColor})`,
              }}
            >
              Secondary Button
            </Button>
          </div>

          <div
            className="mt-4 p-3 rounded-lg"
            style={{ backgroundColor: `hsl(${cardColor})` }}
          >
            <p className="text-sm" style={{ color: `hsl(${foregroundColor})` }}>
              Card example with custom colors
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
