import type { LucideIcon } from 'lucide-react'

export interface CommandContext {
  input: string
  close: () => void
  /** Push a nested sub-palette (e.g. "Theme" -> [Dark, Light, System]) */
  push: (view: PaletteView) => void
  /** Pop back to the previous view */
  pop: () => void
  /** Show a transient toast, e.g. "Copied to clipboard" */
  toast: (message: string) => void
}

export interface Command {
  id: string
  title: string
  subtitle?: string
  category: string
  icon?: LucideIcon
  keywords?: string[]
  /** Return true to keep the palette open after running */
  action: (ctx: CommandContext) => void | boolean
  /** Live inline result while typing, e.g. calculator */
  preview?: (input: string) => string | null
}

export interface PaletteView {
  id: string
  title: string
  placeholder?: string
  emptyLabel?: string
  getCommands: (input: string, ctx: { toast: (m: string) => void }) => Command[]
}
