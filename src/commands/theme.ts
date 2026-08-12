import { Moon, Sun, Monitor, Palette as PaletteIcon } from 'lucide-react'
import type { Command, PaletteView } from '../lib/types'
import { applyTheme, getStoredTheme, type Theme } from '../lib/theme'

const options: { id: Theme; label: string; icon: typeof Moon }[] = [
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'system', label: 'System', icon: Monitor },
]

export const themeView: PaletteView = {
  id: 'theme',
  title: 'Theme',
  placeholder: 'Choose a theme…',
  getCommands: (_input, { toast }) => {
    const current = getStoredTheme()
    return options.map((opt) => ({
      id: `theme-${opt.id}`,
      title: opt.label,
      subtitle: current === opt.id ? 'Currently active' : undefined,
      category: 'Appearance',
      icon: opt.icon,
      action: (ctx) => {
        applyTheme(opt.id)
        toast(`Theme set to ${opt.label}`)
        ctx.close()
      },
    }))
  },
}

export const themeCommand: Command = {
  id: 'open-theme',
  title: 'Change Theme',
  subtitle: 'Dark, light, or match your system',
  category: 'Preferences',
  icon: PaletteIcon,
  keywords: ['theme', 'dark', 'light', 'appearance', 'mode'],
  action: (ctx) => {
    ctx.push(themeView)
    return true
  },
}
