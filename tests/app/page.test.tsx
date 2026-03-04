import { render, screen } from '@testing-library/react'
import LandingPage from '@/app/page'

describe('LandingPage', () => {
  it('renders hero heading', () => {
    render(<LandingPage />)
    expect(screen.getByText(/Stop Guessing/)).toBeInTheDocument()
  })

  it('renders all 6 brew methods', () => {
    render(<LandingPage />)
    expect(screen.getByText('Hot V60')).toBeInTheDocument()
    expect(screen.getByText('Iced V60')).toBeInTheDocument()
    expect(screen.getByText('AeroPress')).toBeInTheDocument()
    expect(screen.getByText('French Press')).toBeInTheDocument()
    expect(screen.getByText('Moka Pot')).toBeInTheDocument()
    expect(screen.getByText('Cold Brew')).toBeInTheDocument()
  })

  it('renders CTA button linking to /app', () => {
    render(<LandingPage />)
    const ctaLinks = screen.getAllByRole('link', { name: /Start Brewing/i })
    expect(ctaLinks.length).toBeGreaterThan(0)
  })
})
