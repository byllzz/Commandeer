import { useEffect, useRef } from 'react'
import { ChevronRight } from 'lucide-react'
import type { Command } from '../lib/types'

interface Props {
  command: Command
  active: boolean
  preview: string | null
  onSelect: () => void
  onHover: () => void
}

export function CommandItem({ command, active, preview, onSelect, onHover }: Props) {
  const Icon = command.icon ?? ChevronRight
  const ref = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: 'nearest' })
  }, [active])

  return (
    <li
      ref={ref}
      role="option"
      aria-selected={active}
      onMouseEnter={onHover}
      onClick={onSelect}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm transition-colors ${
        active ? 'bg-accent/20 text-fg-100' : 'text-fg-300 hover:bg-fg-100/5'
      }`}
    >
      <Icon size={16} strokeWidth={2} className="shrink-0 text-fg-500" aria-hidden="true" />

      <div className="flex flex-col min-w-0 flex-1">
        <span className="font-medium truncate">{command.title}</span>
        {command.subtitle && <span className="text-xs text-fg-500 truncate">{command.subtitle}</span>}
      </div>

      {preview ? (
        <span className="text-xs font-mono px-2 py-1 rounded bg-black/40 text-emerald-400 shrink-0">
          {preview}
        </span>
      ) : (
        <span className="text-[10px] uppercase tracking-wide text-fg-600 shrink-0">{command.category}</span>
      )}
    </li>
  )
}
