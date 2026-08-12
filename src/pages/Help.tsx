import { Keyboard, Info } from 'lucide-react'

const shortcuts = [
  { title: '⌘K / Ctrl+K', subtitle: 'Open or close the palette' },
  { title: '↑ / ↓', subtitle: 'Move between results' },
  { title: 'Enter', subtitle: 'Run the highlighted command' },
  { title: 'Esc', subtitle: 'Go back one level, or close if at the root' },
  { title: 'Backspace (empty input)', subtitle: 'Go back one level' },
]

const inlineSyntax = [
  { title: 'calc 12*4+1', subtitle: 'Evaluates math and copies the result' },
  { title: 'base64 hello', subtitle: 'Encodes text and copies it' },
  { title: 'color #6366f1', subtitle: 'Previews a hex color and copies it' },
]

const faqs = [
  {
    q: 'Why do I only see a few commands when I open the palette?',
    a: 'With an empty search box, your most recently used commands are pinned to the top under "Recent" — but the full command list is always right below it. Nothing is hidden; start typing to fuzzy-search everything, or just scroll.',
  },
  {
    q: 'Where is my data stored?',
    a: 'Notes, todos, recents, and your theme choice are all saved to your browser\'s localStorage. Nothing is sent to a server except GitHub search queries, which go straight to the public GitHub API.',
  },
  {
    q: 'Does the theme apply everywhere?',
    a: 'Yes — the theme is applied at the document root, so it covers every page, not just the palette popup.',
  },
]

function Row({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-fg-300">{subtitle}</span>
      <kbd className="text-xs font-mono px-2 py-1 rounded bg-panel border border-border text-fg-400 shrink-0 ml-4">
        {title}
      </kbd>
    </div>
  )
}

export default function Help() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Help & Shortcuts</h1>
        <p className="text-sm text-fg-500">Everything you need to drive the palette from the keyboard.</p>
      </div>

      <section className="space-y-2">
        <h2 className="flex items-center gap-2 text-sm font-medium text-fg-400">
          <Keyboard size={14} /> Keyboard shortcuts
        </h2>
        <div>
          {shortcuts.map((s) => (
            <Row key={s.title} {...s} />
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="flex items-center gap-2 text-sm font-medium text-fg-400">
          <Info size={14} /> Inline command syntax
        </h2>
        <div>
          {inlineSyntax.map((s) => (
            <Row key={s.title} {...s} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-fg-400">FAQ</h2>
        {faqs.map((f) => (
          <div key={f.q} className="space-y-1">
            <h3 className="text-sm text-fg-200">{f.q}</h3>
            <p className="text-sm text-fg-500 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
