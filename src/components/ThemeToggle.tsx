import { useEffect, useRef, useState } from 'react'
import { Sun, Moon, Monitor, Check, ChevronDown } from 'lucide-react'
import { applyTheme, getStoredTheme, type Theme } from '../lib/theme'

const options: { id: Theme; label: string; icon: typeof Sun }[] = [
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'system', label: 'System', icon: Monitor },
]

const icons: Record<Theme, typeof Sun> = { dark: Moon, light: Sun, system: Monitor }
const labels: Record<Theme, string> = { dark: 'Dark', light: 'Light', system: 'System' }

/** Header dropdown for picking a theme, kept in sync with the palette's own
 * "Change Theme" command since both read/write the same store. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getStoredTheme())
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === 'cmdk:theme') setTheme(getStoredTheme())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function choose(next: Theme) {
    applyTheme(next)
    setTheme(next)
    setOpen(false)
  }

  const Icon = icons[theme]

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Theme: ${labels[theme]}. Click to change.`}
        title={`Theme: ${labels[theme]}`}
        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-border text-fg-500 hover:text-fg-300 hover:border-accent/50 transition"
      >
        <Icon size={14} />
        <span className="hidden sm:inline">{labels[theme]}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1.5 w-36 rounded-lg border border-border bg-panel shadow-xl overflow-hidden z-50"
        >
          {options.map((opt) => {
            const OptIcon = opt.icon
            const active = theme === opt.id
            return (
              <button
                key={opt.id}
                role="menuitemradio"
                aria-checked={active}
                onClick={() => choose(opt.id)}
                className={`w-full flex items-center gap-2 text-xs px-3 py-2 transition ${
                  active ? 'text-fg-100 bg-accent/10' : 'text-fg-400 hover:text-fg-200 hover:bg-white/5'
                }`}
              >
                <OptIcon size={14} className="shrink-0" />
                <span className="flex-1 text-left">{opt.label}</span>
                {active && <Check size={13} className="shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
