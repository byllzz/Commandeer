import { StickyNote, Plus, Copy } from 'lucide-react'
import type { Command, PaletteView } from '../lib/types'
import { loadJSON, saveJSON } from '../lib/persist'

export interface Note {
  id: string
  text: string
  createdAt: number
}

export const NOTES_KEY = 'cmdk:notes'

export function getNotes(): Note[] {
  return loadJSON<Note[]>(NOTES_KEY, [])
}

export function saveNotes(notes: Note[]) {
  saveJSON(NOTES_KEY, notes)
}

export const notesView: PaletteView = {
  id: 'notes',
  title: 'Notes',
  placeholder: 'Type a note and press Enter to save…',
  emptyLabel: 'No notes yet — type something and hit Enter to save one.',
  getCommands: (input, { toast }) => {
    const notes = getNotes()
    const commands: Command[] = notes
      .slice()
      .reverse()
      .map((note) => ({
        id: `note-${note.id}`,
        title: note.text,
        subtitle: new Date(note.createdAt).toLocaleString(),
        category: 'Saved notes',
        icon: Copy,
        action: (ctx) => {
          navigator.clipboard?.writeText(note.text)
          toast('Note copied to clipboard')
          ctx.pop()
          return false
        },
      }))

    if (input.trim()) {
      commands.unshift({
        id: 'notes-add',
        title: `Save note: "${input.trim()}"`,
        subtitle: 'Press Enter to save',
        category: 'Add',
        icon: Plus,
        action: (ctx) => {
          const updated = [...getNotes(), { id: crypto.randomUUID(), text: input.trim(), createdAt: Date.now() }]
          saveNotes(updated)
          toast('Note saved')
          ctx.pop()
          ctx.push({ ...notesView })
          return true
        },
      })
    }

    return commands
  },
}

export const notesCommand: Command = {
  id: 'open-notes',
  title: 'Notes',
  subtitle: 'Quick-capture notes, saved locally',
  category: 'Apps',
  icon: StickyNote,
  keywords: ['note', 'memo', 'write', 'capture'],
  action: (ctx) => {
    ctx.push(notesView)
    return true
  },
}
