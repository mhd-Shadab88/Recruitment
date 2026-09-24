import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SourceCard } from './SourceCard'
import type { Source } from '../../types'

function makeSource(overrides: Partial<Source> = {}): Source {
  return {
    id: 's1',
    name: 'Example Source',
    url: 'https://example.com/profile',
    type: 'linkedin',
    confidence: 'medium',
    confidenceRationale: 'Name and one signal matched.',
    matchSignals: ['Name matches'],
    description: 'A description',
    lastChecked: '2026-09-24',
    status: 'pending_review',
    ...overrides,
  }
}

describe('SourceCard', () => {
  it('renders the source name and confidence badge', () => {
    render(<SourceCard source={makeSource()} />)
    expect(screen.getByText('Example Source')).toBeInTheDocument()
    expect(screen.getByText('Medium confidence')).toBeInTheDocument()
  })

  it('shows "could not be verified" copy when the URL is missing', () => {
    render(<SourceCard source={makeSource({ url: '' })} />)
    expect(screen.getByText('No URL — source could not be verified.')).toBeInTheDocument()
  })

  it('renders gracefully when the description is empty', () => {
    render(<SourceCard source={makeSource({ description: '' })} />)
    expect(screen.getByText('Example Source')).toBeInTheDocument()
  })

  it('shows a demo badge for demo sources', () => {
    render(<SourceCard source={makeSource({ isDemo: true })} />)
    expect(screen.getByText('Demo data — not real')).toBeInTheDocument()
  })

  it('does not show a demo badge for non-demo sources', () => {
    render(<SourceCard source={makeSource({ isDemo: false })} />)
    expect(screen.queryByText('Demo data — not real')).not.toBeInTheDocument()
  })

  it('lists match signals when present', () => {
    render(<SourceCard source={makeSource({ matchSignals: ['Name matches', 'Role overlap'] })} />)
    expect(screen.getByText('Role overlap')).toBeInTheDocument()
  })
})
