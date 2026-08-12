import { Calculator, Lock, Pipette, KeyRound, Clock } from 'lucide-react'
import type { Command } from '../lib/types'

function safeCalc(expr: string): string | null {
  if (!/^[0-9+\-*/().\s%]+$/.test(expr)) return null
  try {
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${expr})`)()
    if (typeof result !== 'number' || Number.isNaN(result)) return null
    return String(Math.round(result * 1e6) / 1e6)
  } catch {
    return null
  }
}

export const calculatorCommand: Command = {
  id: 'calc',
  title: 'Calculate',
  subtitle: 'calc 12*4+1 — copies the answer',
  category: 'Utilities',
  icon: Calculator,
  keywords: ['math', 'calc', 'add', 'multiply', 'sum'],
  preview: (input) => {
    const match = input.match(/^calc\s+(.+)/i) ?? input.match(/^([0-9+\-*/().\s%]{2,})$/)
    if (!match) return null
    return safeCalc(match[1])
  },
  action: (ctx) => {
    const result = calculatorCommand.preview?.(ctx.input)
    if (result) {
      navigator.clipboard?.writeText(result)
      ctx.toast(`Copied ${result}`)
    }
    return false
  },
}

export const base64Command: Command = {
  id: 'base64',
  title: 'Encode Base64',
  subtitle: 'base64 <text> — copies the encoded result',
  category: 'Utilities',
  icon: Lock,
  keywords: ['encode', 'decode', 'b64'],
  preview: (input) => {
    const match = input.match(/^base64\s+(.+)/i)
    if (!match) return null
    try {
      return btoa(match[1])
    } catch {
      return 'Invalid input'
    }
  },
  action: (ctx) => {
    const result = base64Command.preview?.(ctx.input)
    if (result) {
      navigator.clipboard?.writeText(result)
      ctx.toast('Copied encoded string')
    }
    return false
  },
}

export const colorCommand: Command = {
  id: 'color',
  title: 'Preview Hex Color',
  subtitle: 'color #6366f1 — shows a swatch, copies it',
  category: 'Utilities',
  icon: Pipette,
  keywords: ['hex', 'color', 'swatch', 'css'],
  preview: (input) => {
    const match = input.match(/^color\s+(#?[0-9a-fA-F]{3,6})/)
    if (!match) return null
    return match[1].startsWith('#') ? match[1] : `#${match[1]}`
  },
  action: (ctx) => {
    const result = colorCommand.preview?.(ctx.input)
    if (result) {
      navigator.clipboard?.writeText(result)
      ctx.toast(`Copied ${result}`)
    }
    return false
  },
}

export const passwordCommand: Command = {
  id: 'password',
  title: 'Generate Password',
  subtitle: 'A random 16-character password, copied instantly',
  category: 'Utilities',
  icon: KeyRound,
  keywords: ['password', 'generate', 'random', 'secure'],
  action: (ctx) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*'
    const pw = Array.from(crypto.getRandomValues(new Uint32Array(16)))
      .map((n) => chars[n % chars.length])
      .join('')
    navigator.clipboard?.writeText(pw)
    ctx.toast('Password copied to clipboard')
    return false
  },
}

export const timestampCommand: Command = {
  id: 'timestamp',
  title: 'Current Unix Timestamp',
  subtitle: 'Copies the current time as a Unix timestamp',
  category: 'Utilities',
  icon: Clock,
  keywords: ['time', 'unix', 'epoch', 'timestamp'],
  preview: () => String(Math.floor(Date.now() / 1000)),
  action: (ctx) => {
    const ts = String(Math.floor(Date.now() / 1000))
    navigator.clipboard?.writeText(ts)
    ctx.toast(`Copied ${ts}`)
    return false
  },
}

export const utilityCommands: Command[] = [
  calculatorCommand,
  base64Command,
  colorCommand,
  passwordCommand,
  timestampCommand,
]
