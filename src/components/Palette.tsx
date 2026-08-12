import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, HelpCircle, CornerDownLeft } from 'lucide-react'
import { usePaletteStore } from '../lib/store'
import { getAllCommands } from '../commands/registry'
import { fuzzySearch } from '../lib/search'
import { useGlobalHotkey, useListNavigation } from '../hooks/useHotkey'
import { CommandItem } from './CommandItem'
import { Toaster } from './Toaster'
import { debouncedGithubSearch } from '../commands/github'
import { helpView } from '../commands/help'
import type { Command, PaletteView } from '../lib/types'

const ROOT_VIEW: PaletteView = {
  id: 'root',
  title: 'Commandeer',
  placeholder: 'Type a command or search…',
  getCommands: () => getAllCommands(),
}

export function Palette() {
  const { open, setOpen, toggle, input, setInput, recents, addRecent, viewStack, pushView, popView, showToast } =
    usePaletteStore()
  const [activeIndex, setActiveIndex] = useState(0)
  const [githubResults, setGithubResults] = useState<Command[]>([])
  const [githubLoading, setGithubLoading] = useState(false)

  useGlobalHotkey(toggle)

  const currentView = viewStack[viewStack.length - 1] ?? ROOT_VIEW
  const isRoot = currentView.id === 'root'
  const isSearching = input.trim().length > 0

  useEffect(() => {
    setActiveIndex(0)
  }, [open, currentView.id, input])

  // GitHub results arrive async, so they live in local state fed by a debounced fetch.
  useEffect(() => {
    if (currentView.id !== 'github') return
    setGithubLoading(isSearching)
    debouncedGithubSearch(input, (results) => {
      setGithubResults(results)
      setGithubLoading(false)
    })
  }, [input, currentView.id])

  const toastCtx = useMemo(() => ({ toast: showToast }), [showToast])

  // Full command list is always computable; recents are layered on top as a
  // "Recent" section rather than replacing the list, so every command stays
  // reachable straight from the empty-input state.
  const results: Command[] = useMemo(() => {
    if (currentView.id === 'github') return githubResults

    const viewCommands = currentView.getCommands(input, toastCtx)

    if (!isRoot) return viewCommands
    if (isSearching) return fuzzySearch(viewCommands, input)

    if (recents.length === 0) return viewCommands

    const recentCommands = recents
      .map((id) => viewCommands.find((c) => c.id === id))
      .filter((c): c is Command => Boolean(c))
    const recentIds = new Set(recentCommands.map((c) => c.id))
    const rest = viewCommands.filter((c) => !recentIds.has(c.id))
    return [...recentCommands, ...rest]
  }, [input, isSearching, isRoot, currentView, githubResults, recents, toastCtx])

  const showingRecents = isRoot && !isSearching && recents.length > 0
  const recentIdSet = useMemo(() => new Set(recents), [recents])

  const grouped = useMemo(() => {
    const groups = new Map<string, Command[]>()
    for (const cmd of results) {
      const key = showingRecents && recentIdSet.has(cmd.id) ? 'Recent' : cmd.category
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(cmd)
    }
    return Array.from(groups.entries())
  }, [results, showingRecents, recentIdSet])

  const flatList = useMemo(() => grouped.flatMap(([, cmds]) => cmds), [grouped])

  function close() {
    setOpen(false)
  }

  function goBack() {
    if (viewStack.length > 0) popView()
    else if (input) setInput('')
    else close()
  }

  function runCommand(cmd: Command) {
    if (isRoot) addRecent(cmd.id)
    const keepOpen = cmd.action({ input, close, push: pushView, pop: popView, toast: showToast })
    if (!keepOpen) close()
  }

  useListNavigation({
    length: flatList.length,
    activeIndex,
    setActiveIndex,
    onSelect: (i) => flatList[i] && runCommand(flatList[i]),
    onBack: goBack,
    inputEmpty: !input,
  })

  const emptyLabel =
    currentView.id === 'github'
      ? githubLoading
        ? 'Searching GitHub…'
        : isSearching
          ? `No repositories found for "${input}"`
          : (currentView.emptyLabel ?? 'Start typing to search.')
      : (currentView.emptyLabel ?? `No results for "${input}"`)

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              role="combobox"
              aria-expanded={open}
              aria-controls="palette-listbox"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-panel border border-border rounded-xl shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <div className="flex items-center px-4 border-b border-border gap-2">
                {!isRoot && (
                  <button
                    onClick={goBack}
                    aria-label="Back"
                    className="text-fg-500 hover:text-fg-300 transition shrink-0"
                  >
                    <ArrowLeft size={15} />
                  </button>
                )}
                {!isRoot && (
                  <span className="text-xs text-fg-500 shrink-0 border-r border-border pr-2 mr-1">
                    {currentView.title}
                  </span>
                )}
                <input
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={currentView.placeholder ?? 'Type a command or search…'}
                  className="w-full bg-transparent py-3.5 outline-none text-sm placeholder:text-fg-600"
                />
                {isRoot && (
                  <button
                    onClick={() => pushView(helpView)}
                    aria-label="Help"
                    className="text-fg-500 hover:text-fg-300 transition shrink-0"
                  >
                    <HelpCircle size={15} />
                  </button>
                )}
                <kbd className="text-[10px] text-fg-600 border border-border rounded px-1.5 py-0.5 shrink-0">
                  esc
                </kbd>
              </div>

              {showingRecents && (
                <div className="px-4 pt-2 text-[10px] uppercase tracking-wide text-fg-600">
                  Recent commands first — everything else is listed below
                </div>
              )}

              <ul id="palette-listbox" role="listbox" className="max-h-80 overflow-y-auto p-2">
                {flatList.length === 0 && (
                  <li className="px-3 py-8 text-center text-sm text-fg-600">{emptyLabel}</li>
                )}

                {grouped.map(([groupName, cmds]) => (
                  <div key={groupName} className="mb-1">
                    <div className="px-3 py-1 text-[10px] uppercase tracking-wide text-fg-600">
                      {groupName}
                    </div>
                    {cmds.map((cmd) => {
                      const idx = flatList.indexOf(cmd)
                      return (
                        <CommandItem
                          key={cmd.id}
                          command={cmd}
                          active={idx === activeIndex}
                          preview={cmd.preview ? cmd.preview(input) : null}
                          onSelect={() => runCommand(cmd)}
                          onHover={() => setActiveIndex(idx)}
                        />
                      )
                    })}
                  </div>
                ))}
              </ul>

              <div className="flex items-center gap-4 px-4 py-2 border-t border-border text-[10px] text-fg-600">
                <span className="flex items-center gap-1">↑↓ navigate</span>
                <span className="flex items-center gap-1">
                  <CornerDownLeft size={11} /> select
                </span>
                <span>{isRoot ? 'esc close' : 'esc back'}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster />
    </>
  )
}
