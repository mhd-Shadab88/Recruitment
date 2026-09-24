import { useState } from 'react'
import type { FormEvent } from 'react'
import { useResearchData } from '../hooks/useResearchData'
import { answerQuestion } from '../lib/assistant'
import { Section } from '../components/common/Section'
import { Card } from '../components/common/Card'

interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
}

const SUGGESTIONS = [
  'What can you find about my professional background?',
  'Which public sources appear to belong to me?',
  'What information is uncertain?',
  'What information appears outdated?',
  'Show me my professional timeline.',
]

export function AssistantPage() {
  const { bundle, allSources } = useResearchData()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')

  function ask(question: string) {
    if (!question.trim()) return
    const answer = answerQuestion(question, bundle, allSources)
    setMessages((prev) => [...prev, { role: 'user', text: question }, { role: 'assistant', text: answer.text }])
    setInput('')
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    ask(input)
  }

  return (
    <Section
      eyebrow="Ask"
      title="Local research assistant"
      description="Keyword-based, not an external AI call — every answer is composed only from the profile, sources, projects and skills stored in this app. It will never invent information."
    >
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => ask(s)}
            className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
          >
            {s}
          </button>
        ))}
      </div>

      <Card className="mt-6 min-h-[240px]">
        {messages.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">Ask a question or pick a suggestion above.</p>
        ) : (
          <ul className="space-y-4">
            {messages.map((m, i) => (
              <li key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <p
                  className={`inline-block max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    m.role === 'user'
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'bg-[var(--color-accent-soft)] text-[var(--color-ink-soft)]'
                  }`}
                >
                  {m.text}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about background, sources, uncertain info…"
          className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
        />
        <button
          type="submit"
          className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white"
        >
          Ask
        </button>
      </form>
    </Section>
  )
}
