import { useTenant } from './TenantProvider'
import { SocialLinks } from './SocialLinks'
import { CustomButtons } from './CustomButtons'
import { TenantLogo } from './TenantLogo'

export function TenantLandingPage() {
  const { tenant, theme, socialLinks, customButtons } = useTenant()

  const currentYear = new Date().getFullYear()

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float-slow"
          style={{ backgroundColor: `hsl(${theme.primaryColor} / 0.1)` }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float-medium"
          style={{ backgroundColor: `hsl(${theme.primaryColor} / 0.05)` }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse-slow"
          style={{ backgroundColor: `hsl(${theme.primaryColor} / 0.03)` }}
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md mx-auto py-12 sm:py-16 lg:py-20">
        {/* Logo Section */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="mb-6">
            <TenantLogo />
          </div>

          {/* Brand name */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
            style={{ color: `hsl(${theme.foregroundColor})` }}
          >
            {tenant.name.split(/(\s+)/).map((part, i) =>
              i % 2 === 1 ? (
                <span key={i} style={{ color: `hsl(${theme.primaryColor})` }}>
                  {part}
                </span>
              ) : (
                part
              )
            )}
          </h1>
        </div>

        {/* Tagline */}
        {tenant.tagline && (
          <>
            <p className="text-muted-foreground text-sm sm:text-base uppercase tracking-[0.3em] font-medium">
              {tenant.tagline}
            </p>

            {/* Divider */}
            <div
              className="w-full max-w-[200px] h-px my-10 sm:my-12"
              style={{
                background: `linear-gradient(to right, transparent, hsl(${theme.borderColor} / 0.5), transparent)`,
              }}
            />
          </>
        )}

        {/* Custom Buttons */}
        {customButtons.filter(b => b.isEnabled).length > 0 && (
          <nav className="w-full space-y-3 sm:space-y-4 mb-8" aria-label="Action buttons">
            {customButtons
              .filter(b => b.isEnabled)
              .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
              .map(button => (
                <CustomButtons key={button.id} button={button} />
              ))}
          </nav>
        )}

        {/* Social Media Links */}
        {socialLinks.filter(l => l.isEnabled).length > 0 && (
          <nav className="w-full space-y-3 sm:space-y-4" aria-label="Social media links">
            <SocialLinks links={socialLinks} />
          </nav>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-auto pt-8 pb-6 sm:pt-10 sm:pb-8">
        <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
          <span>©</span>
          <span>{currentYear}</span>
          <span style={{ color: `hsl(${theme.mutedColor})` }}>|</span>
          <span>{tenant.name}</span>
        </div>
      </footer>
    </main>
  )
}
