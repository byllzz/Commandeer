import { getAllCommands } from '../commands/registry'
import { usePaletteStore } from '../lib/store'
import type { Command } from '../lib/types'
export function CommandGrid() {
  const { setOpen, pushView, popView, showToast, addRecent } = usePaletteStore()

  const commands = getAllCommands()

  const grouped = commands.reduce<Map<string, Command[]>>((groups, cmd) => {
    if (!groups.has(cmd.category)) groups.set(cmd.category, [])
    groups.get(cmd.category)!.push(cmd)
    return groups
  }, new Map())

  function runCommand(cmd: Command) {
    addRecent(cmd.id)
    setOpen(true)
    const keepOpen = cmd.action({
      input: '',
      close: () => setOpen(false),
      push: pushView,
      pop: popView,
      toast: showToast,
    })
    if (!keepOpen) setOpen(false)
  }

  return (
    <div className="w-full max-w-3xl px-4 space-y-6">
      {Array.from(grouped.entries()).map(([category, cmds]) => (
        <div key={category}>
          <h2 className="text-[10px] uppercase tracking-wide text-fg-600 mb-2 text-left px-1">
            {category}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {cmds.map((cmd) => {
              const Icon = cmd.icon
              return (
                <button
                  key={cmd.id}
                  onClick={() => runCommand(cmd)}
                  className="flex items-center gap-2.5 text-left px-3 py-2.5 rounded-lg bg-panel border border-border hover:border-accent/50 hover:bg-white/5 transition"
                >
                  {Icon && (
                    <span className="shrink-0 w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center text-accent">
                      <Icon size={14} />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block text-sm text-fg-200 truncate">{cmd.title}</span>
                    {cmd.subtitle && (
                      <span className="block text-[11px] text-fg-600 truncate">{cmd.subtitle}</span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
