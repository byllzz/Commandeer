export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">About this project</h1>
        <p className="text-sm text-fg-500">
          A portfolio piece exploring keyboard-first UX - the kind of interaction pattern used by
          Raycast, Linear, and Spotlight - built as a standalone web app rather than a feature
          bolted onto something bigger.
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium">Stack</h2>
        <p className="text-sm text-fg-500 leading-relaxed">
          React + TypeScript, Vite, Tailwind CSS, Zustand for state, Fuse.js for fuzzy search,
          Framer Motion for animation, React Router for the pages you're looking at now, and
          lucide-react for icons.
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium">What it's meant to demonstrate</h2>
        <ul className="text-sm text-fg-500 leading-relaxed list-disc list-inside space-y-1">
          <li>Real keyboard-first UX: focus management, arrow-key navigation, nested views</li>
          <li>A plugin-style command registry that features register into independently</li>
          <li>Local persistence done carefully (notes, todos, recents, theme)</li>
          <li>A live external API integration (GitHub search) alongside purely local commands</li>
          <li>Accessible markup - combobox/listbox/option roles, keyboard-only operability</li>
        </ul>
      </div>
    </div>
  )
}
