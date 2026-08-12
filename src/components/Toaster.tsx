import { AnimatePresence, motion } from 'framer-motion'
import { usePaletteStore } from '../lib/store'

export function Toaster() {
  const toasts = usePaletteStore((s) => s.toasts)

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="bg-panel border border-border text-fg-100 text-sm px-4 py-2 rounded-lg shadow-xl max-w-sm truncate"
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
