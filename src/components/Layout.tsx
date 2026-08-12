import { NavLink, Outlet } from 'react-router-dom'
import { Command } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { Palette } from './Palette'
import { usePaletteStore } from '../lib/store'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/docs', label: 'Docs' },
  { to: '/help', label: 'Help' },
  { to: '/about', label: 'About' },
]

export function Layout() {
  const toggle = usePaletteStore((s) => s.toggle)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-base/80 backdrop-blur">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2 text-sm font-medium">
            <Command size={16} />
            Commandeer
          </NavLink>

          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `text-xs px-3 py-1.5 rounded-lg transition ${
                    isActive ? 'text-fg-100 bg-panel border border-border' : 'text-fg-500 hover:text-fg-300'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-border text-fg-500 hover:text-fg-300 hover:border-accent/50 transition"
            >
              ⌘K
            </button>
            <ThemeToggle />
          </div>
        </div>

        <nav className="sm:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `text-xs px-3 py-1.5 rounded-lg transition shrink-0 ${
                  isActive ? 'text-fg-100 bg-panel border border-border' : 'text-fg-500 hover:text-fg-300'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Palette />
    </div>
  )
}
