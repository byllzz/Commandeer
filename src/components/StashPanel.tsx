import { useEffect, useRef, useState } from 'react'
import { Archive, StickyNote, ListTodo, Copy, Trash2, Check, Square } from 'lucide-react'
import { getNotes, saveNotes, type Note } from '../commands/notes'
import { getTodos, saveTodos, type Todo } from '../commands/todos'
import { usePaletteStore } from '../lib/store'

type Tab = 'notes' | 'todos'

export function StashPanel() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('notes')
  const [notes, setNotes] = useState<Note[]>([])
  const [todos, setTodos] = useState<Todo[]>([])
  const rootRef = useRef<HTMLDivElement>(null)
  const showToast = usePaletteStore((s) => s.showToast)

  function refresh() {
    setNotes(getNotes().slice().reverse())
    setTodos(getTodos())
  }

  useEffect(() => {
    if (open) refresh()
  }, [open])

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === 'cmdk:notes' || e.key === 'cmdk:todos') refresh()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function deleteNote(id: string) {
    const updated = getNotes().filter((n) => n.id !== id)
    saveNotes(updated)
    refresh()
    showToast('Note deleted')
  }

  function copyNote(text: string) {
    navigator.clipboard?.writeText(text)
    showToast('Note copied to clipboard')
  }

  function toggleTodo(id: string) {
    const updated = getTodos().map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    saveTodos(updated)
    refresh()
  }

  function deleteTodo(id: string) {
    const updated = getTodos().filter((t) => t.id !== id)
    saveTodos(updated)
    refresh()
    showToast('Task removed')
  }

  const openCount = todos.filter((t) => !t.done).length
  const totalCount = notes.length + todos.length

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Open your saved notes and todos"
        title="Your notes & todos"
        className="relative flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-border text-fg-500 hover:text-fg-300 hover:border-accent/50 transition"
      >
        <Archive size={14} />
        <span className="hidden sm:inline">Stash</span>
        {totalCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-accent text-white text-[10px] leading-4 text-center font-medium">
            {totalCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notes and todos"
          className="absolute right-0 top-full mt-1.5 w-80 max-w-[90vw] rounded-xl border border-border bg-panel shadow-2xl overflow-hidden z-50 flex flex-col"
        >
          <div className="flex items-center border-b border-border">
            <button
              onClick={() => setTab('notes')}
              className={`flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2.5 transition ${
                tab === 'notes' ? 'text-fg-100 bg-white/5' : 'text-fg-500 hover:text-fg-300'
              }`}
            >
              <StickyNote size={13} />
              Notes
              {notes.length > 0 && <span className="text-fg-600">({notes.length})</span>}
            </button>
            <button
              onClick={() => setTab('todos')}
              className={`flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2.5 transition border-l border-border ${
                tab === 'todos' ? 'text-fg-100 bg-white/5' : 'text-fg-500 hover:text-fg-300'
              }`}
            >
              <ListTodo size={13} />
              Todos
              {openCount > 0 && <span className="text-fg-600">({openCount})</span>}
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {tab === 'notes' &&
              (notes.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-fg-600">
                  No notes yet - save one from ⌘K.
                </p>
              ) : (
                <ul>
                  {notes.map((note) => (
                    <li
                      key={note.id}
                      className="flex items-start gap-2 px-3 py-2.5 border-b border-border last:border-0 hover:bg-white/5 transition group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-fg-200 break-words">{note.text}</p>
                        <p className="text-[10px] text-fg-600 mt-0.5">
                          {new Date(note.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => copyNote(note.text)}
                          aria-label="Copy note"
                          className="p-1.5 rounded text-fg-500 hover:text-fg-200 hover:bg-white/10 transition"
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          aria-label="Delete note"
                          className="p-1.5 rounded text-fg-500 hover:text-red-400 hover:bg-white/10 transition"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ))}

            {tab === 'todos' &&
              (todos.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-fg-600">
                  Nothing here yet - add a task from ⌘K.
                </p>
              ) : (
                <ul>
                  {todos.map((todo) => (
                    <li
                      key={todo.id}
                      className="flex items-center gap-2 px-3 py-2.5 border-b border-border last:border-0 hover:bg-white/5 transition group"
                    >
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        aria-label={todo.done ? 'Mark incomplete' : 'Mark complete'}
                        className="shrink-0 text-fg-500 hover:text-accent transition"
                      >
                        {todo.done ? <Check size={16} className="text-accent" /> : <Square size={16} />}
                      </button>
                      <span
                        className={`flex-1 text-sm break-words ${
                          todo.done ? 'text-fg-600 line-through' : 'text-fg-200'
                        }`}
                      >
                        {todo.text}
                      </span>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        aria-label="Delete task"
                        className="shrink-0 p-1.5 rounded text-fg-500 hover:text-red-400 hover:bg-white/10 transition opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
