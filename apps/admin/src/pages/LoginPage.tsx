/**
 * Login Page
 * Admin authentication
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Login failed')
      }

      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[var(--color-fg)]">CLIN-RO Admin</h1>
            <p className="text-[var(--color-muted)] mt-2">Sign in to manage your landing pages</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--color-fg)] mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-[var(--color-fg)] focus:outline-none focus:border-[var(--color-primary)]"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-fg)] mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-[var(--color-fg)] focus:outline-none focus:border-[var(--color-primary)]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-bg)] rounded font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
