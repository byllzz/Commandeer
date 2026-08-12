import { HelpCircle, Keyboard, Info } from 'lucide-react'
import type { Command, PaletteView } from '../lib/types'

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

export const helpView: PaletteView = {
  id: 'help',
  title: 'Help',
  placeholder: 'Search shortcuts and syntax…',
  getCommands: () => [
    ...shortcuts.map((s, i) => ({
      id: `help-shortcut-${i}`,
      title: s.title,
      subtitle: s.subtitle,
      category: 'Keyboard shortcuts',
      icon: Keyboard,
      action: () => false,
    })),
    ...inlineSyntax.map((s, i) => ({
      id: `help-syntax-${i}`,
      title: s.title,
      subtitle: s.subtitle,
      category: 'Inline command syntax',
      icon: Info,
      action: () => false,
    })),
  ],
}

export const helpCommand: Command = {
  id: 'open-help',
  title: 'Help & Shortcuts',
  subtitle: 'How to use this palette',
  category: 'Help',
  icon: HelpCircle,
  keywords: ['help', 'docs', 'shortcuts', 'how to', '?'],
  action: (ctx) => {
    ctx.push(helpView)
    return true
  },
}
