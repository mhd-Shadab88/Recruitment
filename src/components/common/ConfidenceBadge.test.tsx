import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ConfidenceBadge } from './ConfidenceBadge'

describe('ConfidenceBadge', () => {
  it('renders the correct label for each confidence level', () => {
    render(<ConfidenceBadge level="high" />)
    expect(screen.getByText('High confidence')).toBeInTheDocument()
  })

  it('renders "Probably not me" for probably_not', () => {
    render(<ConfidenceBadge level="probably_not" />)
    expect(screen.getByText('Probably not me')).toBeInTheDocument()
  })

  it('exposes the level via data attribute for styling/testing', () => {
    render(<ConfidenceBadge level="low" />)
    expect(screen.getByTestId('confidence-badge')).toHaveAttribute('data-level', 'low')
  })
})
