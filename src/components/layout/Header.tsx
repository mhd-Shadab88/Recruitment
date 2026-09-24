import { NavLink } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/profile', label: 'Profile' },
  { to: '/presence', label: 'Online Presence' },
  { to: '/projects', label: 'Projects' },
  { to: '/skills', label: 'Skills' },
  { to: '/assistant', label: 'Ask' },
  { to: '/admin', label: 'Admin' },
]

export function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-canvas)]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="text-sm font-semibold tracking-tight text-[var(--color-ink)]">
          Shadab <span className="text-[var(--color-muted)] font-normal">/ Profile Intelligence</span>
        </NavLink>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-[var(--color-accent-soft)] text-[var(--color-ink)] font-medium'
                    : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
        >
          {theme === 'light' ? 'Dark' : 'Light'} mode
        </button>
      </div>
      <nav
        className="flex items-center gap-1 overflow-x-auto border-t border-[var(--color-border)] px-4 py-2 md:hidden"
        aria-label="Main navigation mobile"
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `shrink-0 rounded-md px-3 py-1.5 text-sm ${
                isActive ? 'bg-[var(--color-accent-soft)] text-[var(--color-ink)]' : 'text-[var(--color-ink-soft)]'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
