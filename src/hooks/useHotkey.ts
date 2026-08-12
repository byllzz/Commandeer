import { useEffect } from 'react'

/** Registers Cmd/Ctrl+K to toggle the palette. */
export function useGlobalHotkey(onToggle: () => void) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onToggle()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onToggle])
}

/** Arrow-key + Enter navigation, plus Escape/Backspace to go back or close. */
export function useListNavigation(opts: {
  length: number
  activeIndex: number
  setActiveIndex: (i: number) => void
  onSelect: (i: number) => void
  onBack: () => void
  inputEmpty: boolean
}) {
  const { length, activeIndex, setActiveIndex, onSelect, onBack, inputEmpty } = opts

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (length > 0) setActiveIndex((activeIndex + 1) % length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (length > 0) setActiveIndex((activeIndex - 1 + length) % length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (length > 0) onSelect(activeIndex)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onBack()
      } else if (e.key === 'Backspace' && inputEmpty) {
        onBack()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [length, activeIndex, setActiveIndex, onSelect, onBack, inputEmpty])
}
