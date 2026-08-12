import { ListTodo, Plus, Check, Square, Trash2 } from 'lucide-react'
import type { Command, PaletteView } from '../lib/types'
import { loadJSON, saveJSON } from '../lib/persist'
import { fireConfetti } from '../lib/confetti'

export interface Todo {
  id: string
  text: string
  done: boolean
  createdAt: number
}

export const TODOS_KEY = 'cmdk:todos'

export const getTodos = () => loadJSON<Todo[]>(TODOS_KEY, [])
export const saveTodos = (todos: Todo[]) => saveJSON(TODOS_KEY, todos)

export const todosView: PaletteView = {
  id: 'todos',
  title: 'Todos',
  placeholder: 'Type a task and press Enter to add…',
  emptyLabel: 'Nothing on your list — add a task to get started.',
  getCommands: (input, { toast }) => {
    const todos = getTodos()
    const commands: Command[] = todos.map((todo) => ({
      id: `todo-${todo.id}`,
      title: todo.text,
      subtitle: todo.done ? 'Done — press Enter to remove' : 'Press Enter to complete',
      category: todo.done ? 'Completed' : 'Open',
      icon: todo.done ? Trash2 : Square,
      action: (ctx) => {
        const current = getTodos()
        if (!todo.done) {
          const updated = current.map((t) => (t.id === todo.id ? { ...t, done: true } : t))
          saveTodos(updated)
          const remaining = updated.filter((t) => !t.done).length
          toast(remaining === 0 ? 'All done!' : 'Marked complete')
          if (remaining === 0) fireConfetti()
        } else {
          saveTodos(current.filter((t) => t.id !== todo.id))
          toast('Removed')
        }
        ctx.pop()
        ctx.push({ ...todosView })
        return true
      },
    }))

    if (input.trim()) {
      commands.unshift({
        id: 'todo-add',
        title: `Add task: "${input.trim()}"`,
        subtitle: 'Press Enter to add',
        category: 'Add',
        icon: Plus,
        action: (ctx) => {
          const updated = [
            ...getTodos(),
            { id: crypto.randomUUID(), text: input.trim(), done: false, createdAt: Date.now() },
          ]
          saveTodos(updated)
          toast('Task added')
          ctx.pop()
          ctx.push({ ...todosView })
          return true
        },
      })
    }

    return commands
  },
}

export const todosCommand: Command = {
  id: 'open-todos',
  title: 'Todos',
  subtitle: 'A tiny task list, saved locally',
  category: 'Apps',
  icon: ListTodo,
  keywords: ['task', 'todo', 'list', 'checklist'],
  action: (ctx) => {
    ctx.push(todosView)
    return true
  },
}

// exported for potential reuse (e.g. a "completed" badge elsewhere)
export const CheckIcon = Check
