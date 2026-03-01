import { useTenant } from './TenantProvider'
import { safeSvg } from '@/lib/sanitize'

export function TenantLogo() {
  const { tenant, theme } = useTenant()

  // If tenant has custom logo SVG, render it (sanitized)
  const safeLogoSvg = safeSvg(tenant.logoSvg)
  if (safeLogoSvg) {
    return (
      <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-6 flex items-center justify-center">
        <div className="relative">
          <div
            className="absolute inset-0 rounded-2xl blur-xl animate-pulse"
            style={{ backgroundColor: `hsl(${theme.primaryColor} / 0.2)` }}
          />
          <span
            className="relative w-full h-full"
            style={{ color: `hsl(${theme.primaryColor})` }}
            dangerouslySetInnerHTML={{ __html: safeLogoSvg }}
          />
        </div>
      </div>
    )
  }

  // If tenant has logo URL, render it as image
  if (tenant.logoUrl) {
    return (
      <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-6 flex items-center justify-center">
        <div className="relative">
          <div
            className="absolute inset-0 rounded-2xl blur-xl animate-pulse"
            style={{ backgroundColor: `hsl(${theme.primaryColor} / 0.2)` }}
          />
          <img
            src={tenant.logoUrl}
            alt={`${tenant.name} logo`}
            className="relative w-full h-full object-contain"
            loading="lazy"
          />
        </div>
      </div>
    )
  }

  // Default logo (car spa themed)
  return (
    <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-6 flex items-center justify-center">
      <div className="relative">
        <div
          className="absolute inset-0 rounded-2xl blur-xl animate-pulse"
          style={{ backgroundColor: `hsl(${theme.primaryColor} / 0.2)` }}
        />
        <svg
          className="relative w-full h-full"
          style={{ color: `hsl(${theme.primaryColor})` }}
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M20 65 L20 35 L35 35 L35 30 Q35 20 45 20 L55 20 Q65 20 65 30 L65 65 L50 65 L50 40 L45 40 L45 65 L30 65 L30 40 L20 40 Z"
            strokeLinejoin="round"
          />
          <circle cx="75" cy="45" r="8" />
        </svg>
      </div>
    </div>
  )
}
