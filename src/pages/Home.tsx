import { Calculator, StickyNote, ListTodo, Github, Palette as PaletteIcon, HelpCircle } from 'lucide-react'
import { usePaletteStore } from '../lib/store'

const suggestions = [
  { label: 'calc 12*4+1', hint: 'inline calculator', icon: Calculator },
  { label: 'Notes', hint: 'quick-capture, saved locally', icon: StickyNote },
  { label: 'Todos', hint: 'a tiny task list', icon: ListTodo },
  { label: 'Search GitHub', hint: 'live repo search', icon: Github },
  { label: 'Change Theme', hint: 'dark / light / system', icon: PaletteIcon },
  { label: 'Help & Shortcuts', hint: 'full command reference', icon: HelpCircle },
]

export default function Home() {
  const toggle = usePaletteStore((s) => s.toggle)
  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform)

  return (
    <div className="min-h-[calc(100vh-57px)] flex flex-col items-center justify-center gap-8 text-center px-4">
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">Commandeer</h1>
        <p className="text-fg-500 max-w-md mx-auto">
          A keyboard-first launcher for notes, tasks, quick utilities, and a bit of fun -
          all in your browser.
        </p>
      </div>

      <button
        onClick={toggle}
        className="group flex items-center gap-3 px-5 py-3 rounded-lg bg-panel border border-border hover:border-accent/50 shadow-lg transition"
      >
        <span className="text-fg-500 group-hover:text-fg-300 transition text-sm">
          Search or run a command…
        </span>
        <kbd className="text-[11px] text-fg-400 border border-border rounded px-1.5 py-0.5">
          {isMac ? '⌘' : 'Ctrl'} K
        </kbd>
      </button>

      <div className="flex flex-wrap justify-center gap-2 max-w-lg">
        {suggestions.map((s) => (
          <span
            key={s.label}
            title={s.hint}
            className="flex items-center gap-1.5 text-xs pl-2.5 pr-3 py-1.5 rounded-full bg-panel border border-border text-fg-500"
          >
            <s.icon size={12} className="shrink-0 text-fg-600" aria-hidden="true" />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  )
}
