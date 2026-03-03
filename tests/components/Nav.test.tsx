import { render, screen } from '@testing-library/react'
import { Nav } from '@/components/Nav'

// Mock next/navigation
vi.mock('next/navigation', () => ({ usePathname: () => '/app' }))

describe('Nav', () => {
  it('renders the brand name as a link', () => {
    render(<Nav />)
    expect(screen.getByText('Coffee Brewing Assistant')).toBeInTheDocument()
  })

  it('renders all nav links', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: 'App' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Blog' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Recipes' })).toBeInTheDocument()
  })

  it('marks active link when pathname matches', () => {
    render(<Nav />)
    const appLink = screen.getByRole('link', { name: 'App' })
    expect(appLink).toHaveClass('bg-brand-brown')
  })
})
