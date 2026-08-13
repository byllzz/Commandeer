import { create } from 'zustand'
import type { PaletteView } from './types'

interface Toast {
  id: number
  message: string
}

interface PaletteState {
  open: boolean
  input: string
  viewStack: PaletteView[]
  recents: string[]
  toasts: Toast[]
  highlightId: string | null
  setOpen: (open: boolean) => void
  toggle: () => void
  setInput: (input: string) => void
  pushView: (view: PaletteView) => void
  popView: () => void
  addRecent: (commandId: string) => void
  showToast: (message: string) => void
  dismissToast: (id: number) => void
  openAndHighlight: (commandId: string) => void
  clearHighlight: () => void
}

const MAX_RECENTS = 6
let toastId = 0

/** Always the single source of truth for what "closed" and "freshly opened" look like. */
const RESET_STATE = { input: '', viewStack: [] as PaletteView[] }

export const usePaletteStore = create<PaletteState>((set, get) => ({
  open: false,
  input: '',
  viewStack: [],
  recents: JSON.parse(localStorage.getItem('cmdk:recents') || '[]'),
  toasts: [],
  highlightId: null,

  // Opening or closing always resets input + view stack - no path leaves stale
  // search text behind.
  setOpen: (open) => set({ open, ...RESET_STATE }),
  toggle: () => set((s) => ({ open: !s.open, ...RESET_STATE })),

  setInput: (input) => set({ input }),

  pushView: (view) => set((s) => ({ viewStack: [...s.viewStack, view], input: '' })),
  popView: () => set((s) => ({ viewStack: s.viewStack.slice(0, -1), input: '' })),

  addRecent: (commandId) => {
    const next = [commandId, ...get().recents.filter((id) => id !== commandId)].slice(0, MAX_RECENTS)
    localStorage.setItem('cmdk:recents', JSON.stringify(next))
    set({ recents: next })
  },

  showToast: (message) => {
    const id = ++toastId
    set((s) => ({ toasts: [...s.toasts, { id, message }] }))
    setTimeout(() => get().dismissToast(id), 2200)
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  openAndHighlight: (commandId) => set({ open: true, ...RESET_STATE, highlightId: commandId }),
  clearHighlight: () => set({ highlightId: null }),
}))
