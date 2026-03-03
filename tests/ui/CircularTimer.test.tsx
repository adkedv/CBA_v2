import { render, screen } from '@testing-library/react'
import { CircularTimer } from '@/components/ui/CircularTimer'

describe('CircularTimer', () => {
  it('shows remaining seconds', () => {
    render(<CircularTimer seconds={45} totalSeconds={60} />)
    expect(screen.getByText('45')).toBeInTheDocument()
  })

  it('renders SVG progress ring', () => {
    const { container } = render(<CircularTimer seconds={30} totalSeconds={60} />)
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBeGreaterThanOrEqual(2)
  })

  it('shows 0 at completion', () => {
    render(<CircularTimer seconds={0} totalSeconds={60} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<CircularTimer seconds={30} totalSeconds={60} label="Pour" />)
    expect(screen.getByText('Pour')).toBeInTheDocument()
  })
})
