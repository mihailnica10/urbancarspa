import { ArrowRight, Calendar, Phone, Mail, Clock } from 'lucide-react'
import type { TenantCustomButton } from '@/db/schema'
import { useTenant } from './TenantProvider'
import { safeSvg } from '@/lib/sanitize'

// Lucide icon mapping
const LUCIDE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'arrow-right': ArrowRight,
  'calendar': Calendar,
  'phone': Phone,
  'mail': Mail,
  'clock': Clock,
}

interface CustomButtonsProps {
  button: TenantCustomButton
}

export function CustomButtons({ button }: CustomButtonsProps) {
  const { theme } = useTenant()

  if (!button.isEnabled) return null

  const IconComponent = button.iconName ? LUCIDE_ICONS[button.iconName] : null
  const safeIconSvg = button.iconSvg ? safeSvg(button.iconSvg) : null

  return (
    <a
      href={button.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center justify-between gap-4 py-4 px-5 sm:px-6 rounded-2xl bg-card/50 transition-all duration-300 border hover:shadow-lg"
      style={{
        borderColor: `hsl(${theme.borderColor})`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `hsl(${theme.primaryColor})`
        e.currentTarget.style.boxShadow = `0 10px 15px -3px hsl(${theme.primaryColor} / 0.25)`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = ''
        e.currentTarget.style.borderColor = `hsl(${theme.borderColor})`
        e.currentTarget.style.boxShadow = ''
      }}
      aria-label={button.label}
    >
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center transition-colors">
          {safeIconSvg ? (
            <span
              className="w-5 h-5 text-foreground"
              dangerouslySetInnerHTML={{ __html: safeIconSvg }}
            />
          ) : IconComponent ? (
            <IconComponent className="w-5 h-5 text-foreground" />
          ) : null}
        </div>
        <span className="font-semibold" style={{ color: `hsl(${theme.foregroundColor})` }}>
          {button.label}
        </span>
      </div>
      <ArrowRight className="w-5 h-5 transition-colors text-muted-foreground" />
    </a>
  )
}
