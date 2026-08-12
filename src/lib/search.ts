import Fuse from 'fuse.js'
import type { Command } from './types'

export function fuzzySearch(commands: Command[], query: string): Command[] {
  if (!query.trim()) return commands

  const fuse = new Fuse(commands, {
    keys: [
      { name: 'title', weight: 0.6 },
      { name: 'keywords', weight: 0.3 },
      { name: 'category', weight: 0.1 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
  })

  return fuse.search(query).map((r) => r.item)
}
