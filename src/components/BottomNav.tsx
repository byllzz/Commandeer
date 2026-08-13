import { NavLink } from 'react-router-dom'
import { Home, Terminal, BookOpen, HelpCircle, Info } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home', end: true, icon: Home },
  { to: '/commands', label: 'Commands', icon: Terminal },
  { to: '/docs', label: 'Docs', icon: BookOpen },
  { to: '/help', label: 'Help', icon: HelpCircle },
  { to: '/about', label: 'About', icon: Info },
]

/** Floating pill nav, fixed to the bottom-center of the viewport - the
 * single home for page navigation so the header can stay focused on the
 * palette trigger, Stash, and theme controls. */
export function BottomNav() {
  return (
    <nav
      aria-label="Page navigation"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 px-1.5 py-1.5 rounded-full border border-border bg-panel/90 backdrop-blur shadow-xl"
    >
      {navLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            `flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition whitespace-nowrap ${
              isActive ? 'text-fg-100 bg-white/10' : 'text-fg-500 hover:text-fg-300'
            }`
          }
        >
          <link.icon size={13} className="shrink-0" />
          <span className="hidden sm:inline">{link.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
