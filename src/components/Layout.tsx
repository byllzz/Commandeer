import { NavLink, Outlet } from 'react-router-dom'
import { Command, Github } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { StashPanel } from './StashPanel'
import { BottomNav } from './BottomNav'
import { Palette } from './Palette'
import { usePaletteStore } from '../lib/store'
import { NEW_ISSUE_URL } from '../lib/repo'

export function Layout() {
  const toggle = usePaletteStore((s) => s.toggle)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-base/80 backdrop-blur">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
          <NavLink to="/" className="flex items-center gap-1 text-sm font-medium">
            <Command size={16} />
            Commandeer
          </NavLink>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-border text-fg-500 hover:text-fg-300 hover:border-accent/50 transition"
            >
              ⌘K
            </button>
            <StashPanel />
            <a
              href={NEW_ISSUE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Report an issue on GitHub"
              title="Report an issue on GitHub"
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-border text-fg-500 hover:text-fg-300 hover:border-accent/50 transition"
            >
              <Github size={14} />
              <span className="hidden sm:inline">Report Issue</span>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24">
        <Outlet />
      </main>

      <BottomNav />
      <Palette />
    </div>
  )
}
