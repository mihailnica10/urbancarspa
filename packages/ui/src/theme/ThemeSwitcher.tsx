/**
 * ThemeSwitcher - Manual theme selection component
 */

import { useTheme } from './ThemeProvider.js'
import { themes } from './themes.js'
import { cn } from '@clinro/utils/cn.js'

export interface ThemeSwitcherProps {
  className?: string
  showLabels?: boolean
  orientation?: 'horizontal' | 'vertical'
}

export function ThemeSwitcher({
  className,
  showLabels = true,
  orientation = 'horizontal',
}: ThemeSwitcherProps) {
  const { theme, setTheme, isAutoCycling, setIsAutoCycling } = useTheme()

  return (
    <div
      className={cn(
        'flex gap-2',
        orientation === 'vertical' ? 'flex-col' : 'flex-wrap',
        className
      )}
    >
      {/* Theme buttons */}
      {themes.map(t => (
        <button
          key={t.id}
          onClick={() => setTheme(t)}
          className={cn(
            'group relative flex items-center gap-2 px-3 py-2 rounded-md transition-all',
            'hover:bg-[var(--color-surface)]',
            theme.id === t.id && 'bg-[var(--color-surface)] ring-1 ring-[var(--color-primary)]'
          )}
          title={t.name}
        >
          {/* Theme color preview */}
          <span
            className="w-4 h-4 rounded-full border border-[var(--color-border)]"
            style={{ backgroundColor: t.colors.primary }}
          />

          {/* Theme name */}
          {showLabels && (
            <span className="text-sm text-[var(--color-fg)] group-hover:text-[var(--color-primary)]">
              {t.name}
            </span>
          )}

          {/* Active indicator */}
          {theme.id === t.id && (
            <span className="absolute inset-0 ring-1 ring-[var(--color-primary)] rounded-md pointer-events-none" />
          )}
        </button>
      ))}

      {/* Auto-cycle toggle (only show if not tenant page) */}
      {!isAutoCycling && (
        <button
          onClick={() => setIsAutoCycling(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
          title="Enable auto-cycle"
        >
          <span className="w-4 h-4 flex items-center justify-center">
            ▶
          </span>
          Auto-cycle
        </button>
      )}
    </div>
  )
}
