import { PartyPopper, Smile, Coins } from 'lucide-react'
import type { Command } from '../lib/types'
import { fireConfetti } from '../lib/confetti'

const jokes = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "There are 10 types of people: those who understand binary and those who don't.",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
  "!false — it's funny because it's true.",
  "Why did the developer go broke? Because they used up all their cache.",
]

export const confettiCommand: Command = {
  id: 'celebrate',
  title: 'Celebrate',
  subtitle: 'Just for fun',
  category: 'Fun',
  icon: PartyPopper,
  keywords: ['confetti', 'party', 'celebrate', 'fun'],
  action: (ctx) => {
    fireConfetti()
    ctx.toast('Confetti!')
    return false
  },
}

export const jokeCommand: Command = {
  id: 'joke',
  title: 'Tell Me a Joke',
  subtitle: 'A random dev joke, copied to clipboard',
  category: 'Fun',
  icon: Smile,
  keywords: ['joke', 'fun', 'laugh'],
  action: (ctx) => {
    const joke = jokes[Math.floor(Math.random() * jokes.length)]
    navigator.clipboard?.writeText(joke)
    ctx.toast(joke)
    return false
  },
}

export const coinFlipCommand: Command = {
  id: 'coinflip',
  title: 'Flip a Coin',
  category: 'Fun',
  icon: Coins,
  keywords: ['coin', 'flip', 'random', 'decide'],
  action: (ctx) => {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails'
    ctx.toast(result)
    return false
  },
}

export const funCommands: Command[] = [confettiCommand, jokeCommand, coinFlipCommand]
