import { Github, StickyNote, ListTodo, Palette as PaletteIcon, Calculator } from 'lucide-react'

const sections = [
  {
    title: 'Notes',
    icon: StickyNote,
    body:
      'Open "Notes" from the palette, type a note, and press Enter to save it. Notes persist in localStorage. Selecting a saved note copies its text to your clipboard and returns you to the list.',
  },
  {
    title: 'Todos',
    icon: ListTodo,
    body:
      'Open "Todos", type a task, press Enter to add it. Selecting an open task marks it complete; selecting a completed task removes it. Clearing the last open task fires a small confetti celebration.',
  },
  {
    title: 'Theme',
    icon: PaletteIcon,
    body:
      'Switch between Dark, Light, and System from "Change Theme" in the palette, or the toggle in the header. The choice is saved and applied on every page load, including before first paint.',
  },
  {
    title: 'GitHub Search',
    icon: Github,
    body:
      'Open "Search GitHub" and type to search public repositories by name, sorted by stars. Selecting a result opens it in a new tab. Requests are debounced and cached per query.',
  },
  {
    title: 'Inline Utilities',
    icon: Calculator,
    body:
      'Some commands work by typing directly into the search box rather than selecting an item first: "calc 12*4+1" evaluates math, "base64 hello" encodes text, and "color #6366f1" previews a hex color. Each copies its result to the clipboard when you press Enter.',
  },
]

export default function Docs() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Documentation</h1>
        <p className="text-sm text-fg-500">
          How each part of the palette works, in more detail than fits in the Help view.
        </p>
      </div>

      <div className="space-y-8">
        {sections.map((s) => (
          <div key={s.title} className="flex gap-4">
            <div className="shrink-0 w-9 h-9 rounded-lg bg-panel border border-border flex items-center justify-center text-fg-500">
              <s.icon size={16} />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-medium">{s.title}</h2>
              <p className="text-sm text-fg-500 leading-relaxed">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-border space-y-2">
        <h2 className="text-sm font-medium">Extending it</h2>
        <p className="text-sm text-fg-500 leading-relaxed">
          New commands register in <code className="text-fg-400">src/commands/registry.ts</code> via{' '}
          <code className="text-fg-400">registerCommand()</code>. A command needs an id, title, category, an
          optional lucide icon, and an action. Multi-step features (like Notes or Todos) export a{' '}
          <code className="text-fg-400">PaletteView</code> and push into it with{' '}
          <code className="text-fg-400">ctx.push(view)</code>.
        </p>
      </div>
    </div>
  )
}
