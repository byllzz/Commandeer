import type { Command } from '../lib/types'
import { utilityCommands } from './utilities'
import { notesCommand } from './notes'
import { todosCommand } from './todos'
import { themeCommand } from './theme'
import { githubCommand } from './github'
import { linkCommands, copyUrlCommand } from './links'
import { funCommands } from './fun'
import { helpCommand } from './help'

/**
 * Central command registry. Feature modules register commands here so new
 * capabilities can be added (or removed) without touching the Palette UI —
 * this is the seam you'd use to load commands from a plugin/config source.
 */
const registry = new Map<string, Command>()

export function registerCommand(command: Command) {
  registry.set(command.id, command)
  return () => registry.delete(command.id)
}

export function registerCommands(commands: Command[]) {
  const unregisters = commands.map(registerCommand)
  return () => unregisters.forEach((fn) => fn())
}

export function getAllCommands(): Command[] {
  return Array.from(registry.values())
}

registerCommands([
  notesCommand,
  todosCommand,
  themeCommand,
  githubCommand,
  ...utilityCommands,
  ...linkCommands,
  copyUrlCommand,
  ...funCommands,
  helpCommand,
])
