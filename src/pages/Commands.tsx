import { useMemo, useState } from 'react'
import { Search, ChevronRight } from 'lucide-react'
import { getAllCommands } from '../commands/registry'
import { fuzzySearch } from '../lib/search'
import { usePaletteStore } from '../lib/store'
import type { Command } from '../lib/types'

export default function Commands() {
  const [query, setQuery] = useState('')
  const openAndHighlight = usePaletteStore((s) => s.openAndHighlight)

  const allCommands = useMemo(() => getAllCommands(), [])
  const results = useMemo(() => fuzzySearch(allCommands, query), [allCommands, query])

  const grouped = useMemo(() => {
    const groups = new Map<string, Command[]>()
    for (const cmd of results) {
      if (!groups.has(cmd.category)) groups.set(cmd.category, [])
      groups.get(cmd.category)!.push(cmd)
    }
    return Array.from(groups.entries())
  }, [results])

  function openInPalette(cmd: Command) {
    openAndHighlight(cmd.id)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Commands</h1>
        <p className="text-sm text-fg-500">
          Everything Commandeer can do, in one place. Search below or press ⌘K anywhere.
        </p>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search commands…"
          className="w-full bg-panel border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:border-accent/50 transition placeholder:text-fg-600"
        />
      </div>

      <div className="space-y-5">
        {grouped.length === 0 && (
          <p className="text-center text-sm text-fg-600 py-10">No commands match "{query}"</p>
        )}

        {grouped.map(([category, cmds]) => (
          <div key={category}>
            <div className="text-[10px] uppercase tracking-wide text-fg-600 mb-1.5 px-1">{category}</div>
            <div className="rounded-lg border border-border overflow-hidden">
              {cmds.map((cmd) => {
                const Icon = cmd.icon ?? ChevronRight
                return (
                  <button
                    key={cmd.id}
                    onClick={() => openInPalette(cmd)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm border-b border-border last:border-0 hover:bg-fg-100/5 transition"
                  >
                    <Icon size={16} strokeWidth={2} className="shrink-0 text-fg-500" aria-hidden="true" />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-medium text-fg-200 truncate">{cmd.title}</span>
                      {cmd.subtitle && <span className="text-xs text-fg-500 truncate">{cmd.subtitle}</span>}
                    </div>
                    <ChevronRight size={14} className="shrink-0 text-fg-600" />
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
