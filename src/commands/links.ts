import { Github, BookOpen, Search, CheckCircle2, Link2 } from 'lucide-react'
import type { Command } from '../lib/types'

const sites: { title: string; url: string; icon: Command['icon']; keywords: string[] }[] = [
  { title: 'GitHub', url: 'https://github.com', icon: Github, keywords: ['git', 'code'] },
  { title: 'MDN Web Docs', url: 'https://developer.mozilla.org', icon: BookOpen, keywords: ['docs', 'mdn'] },
  { title: 'Google', url: 'https://google.com', icon: Search, keywords: ['search'] },
  { title: 'Can I Use', url: 'https://caniuse.com', icon: CheckCircle2, keywords: ['browser', 'support'] },
]

export const linkCommands: Command[] = sites.map((site) => ({
  id: `link-${site.title.toLowerCase().replace(/\s+/g, '-')}`,
  title: `Open ${site.title}`,
  subtitle: site.url.replace('https://', ''),
  category: 'Navigation',
  icon: site.icon,
  keywords: site.keywords,
  action: (ctx) => {
    window.open(site.url, '_blank')
    ctx.close()
  },
}))

export const copyUrlCommand: Command = {
  id: 'copy-current-url',
  title: 'Copy Current URL',
  category: 'Actions',
  icon: Link2,
  keywords: ['link', 'share', 'copy'],
  action: (ctx) => {
    navigator.clipboard?.writeText(window.location.href)
    ctx.toast('URL copied')
    return false
  },
}
