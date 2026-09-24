import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders the title', () => {
    render(<EmptyState title="No sources yet" />)
    expect(screen.getByText('No sources yet')).toBeInTheDocument()
  })

  it('renders the description when provided', () => {
    render(<EmptyState title="No sources yet" description="Run research to populate this list." />)
    expect(screen.getByText('Run research to populate this list.')).toBeInTheDocument()
  })

  it('omits description text when not provided', () => {
    render(<EmptyState title="No sources yet" />)
    expect(screen.queryByText('Run research')).not.toBeInTheDocument()
  })
})
