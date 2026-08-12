import type { Command } from '../lib/types'

/** Safely evaluate simple math expressions without using eval() directly on raw input */
function safeCalc(expr: string): string | null {
  if (!/^[0-9+\-*/().\s%]+$/.test(expr)) return null
  try {
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${expr})`)()
    if (typeof result !== 'number' || Number.isNaN(result)) return null
    return String(result)
  } catch {
    return null
  }
}

export const calculatorCommand: Command = {
  id: 'calc',
  title: 'Calculate',
  subtitle: 'Type a math expression, e.g. 12*4+1',
  category: 'Utilities',
  keywords: ['math', 'calc', 'add', 'multiply'],
  preview: (input) => {
    const match = input.match(/^calc\s+(.+)/i) ?? input.match(/^([0-9+\-*/().\s%]+)$/)
    if (!match) return null
    return safeCalc(match[1])
  },
  action: (ctx) => {
    const result = calculatorCommand.preview?.(ctx.input)
    if (result) navigator.clipboard?.writeText(result)
    return false
  },
}

export const base64Command: Command = {
  id: 'base64',
  title: 'Encode Base64',
  subtitle: 'base64 <text> — copies the encoded result',
  category: 'Utilities',
  keywords: ['encode', 'decode', 'b64'],
  preview: (input) => {
    const match = input.match(/^base64\s+(.+)/i)
    if (!match) return null
    try {
      return btoa(match[1])
    } catch {
      return 'Invalid input for base64'
    }
  },
  action: (ctx) => {
    const result = base64Command.preview?.(ctx.input)
    if (result) navigator.clipboard?.writeText(result)
    return false
  },
}

export const inlineCommands: Command[] = [calculatorCommand, base64Command]
