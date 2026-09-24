import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProvenanceList } from './ProvenanceList'
import type { Claim } from '../../types'

const claim: Claim = {
  id: 'c1',
  claim: 'Example claim',
  source: 'Self-reported',
  url: 'https://example.com',
  confidence: 'high',
  last_verified: '2026-09-24',
  evidence: 'Provided directly.',
}

describe('ProvenanceList', () => {
  it('shows "Not verified." when there are no claims', () => {
    render(<ProvenanceList claims={[]} />)
    expect(screen.getByText('Not verified.')).toBeInTheDocument()
  })

  it('renders source, confidence and evidence for each claim', () => {
    render(<ProvenanceList claims={[claim]} />)
    expect(screen.getByText('Self-reported')).toBeInTheDocument()
    expect(screen.getByText('Provided directly.')).toBeInTheDocument()
    expect(screen.getByText('High confidence')).toBeInTheDocument()
  })

  it('does not render a link when the claim has no URL', () => {
    render(<ProvenanceList claims={[{ ...claim, url: null }]} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
