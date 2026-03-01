import { type ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface AdminLayoutProps {
  children: ReactNode
  user?: {
    id: string
    email: string
    name: string | null
    role: string
  }
  title?: string
}

export function AdminLayout({ children, user, title }: AdminLayoutProps) {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-foreground">
                <a href="/admin" className="hover:opacity-80 transition-opacity">
                  clin.ro
                </a>
              </h1>
              {title && (
                <>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-muted-foreground">{title}</span>
                </>
              )}
            </div>

            {user && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {user.email}
                  {user.role === 'superadmin' && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                      Superadmin
                    </span>
                  )}
                </span>
                <Button size="sm" variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
