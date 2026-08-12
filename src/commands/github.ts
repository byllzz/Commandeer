import { Github, Package } from 'lucide-react'
import type { Command, PaletteView } from '../lib/types'

interface RepoResult {
  id: number
  full_name: string
  description: string | null
  stargazers_count: number
  html_url: string
}

let cache = new Map<string, RepoResult[]>()
let debounceTimer: ReturnType<typeof setTimeout> | null = null

async function searchRepos(query: string): Promise<RepoResult[]> {
  if (cache.has(query)) return cache.get(query)!
  const res = await fetch(
    `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=6&sort=stars`
  )
  if (!res.ok) return []
  const data = await res.json()
  const items: RepoResult[] = data.items ?? []
  cache.set(query, items)
  return items
}

export const githubView: PaletteView = {
  id: 'github',
  title: 'GitHub Search',
  placeholder: 'Search repositories on GitHub…',
  emptyLabel: 'Start typing to search GitHub repositories.',
  getCommands: () => [],
}

export const githubCommand: Command = {
  id: 'github-search',
  title: 'Search GitHub',
  subtitle: 'Find repositories by name or topic',
  category: 'Search',
  icon: Github,
  keywords: ['github', 'repo', 'code', 'open source'],
  action: (ctx) => {
    ctx.push(githubView)
    return true
  },
}

/**
 * Async, debounced GitHub search. Because results arrive after a network
 * round-trip, the Palette component calls this directly (see useGithubResults)
 * rather than relying on the synchronous `getCommands` used elsewhere.
 */
export function debouncedGithubSearch(
  query: string,
  onResults: (commands: Command[]) => void
) {
  if (debounceTimer) clearTimeout(debounceTimer)
  if (!query.trim()) {
    onResults([])
    return
  }
  debounceTimer = setTimeout(async () => {
    const repos = await searchRepos(query)
    onResults(
      repos.map((repo) => ({
        id: `gh-${repo.id}`,
        title: repo.full_name,
        subtitle: repo.description ?? undefined,
        category: `★ ${repo.stargazers_count.toLocaleString()}`,
        icon: Package,
        action: (ctx) => {
          window.open(repo.html_url, '_blank')
          ctx.close()
        },
      }))
    )
  }, 300)
}
