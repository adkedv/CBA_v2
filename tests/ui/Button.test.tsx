import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('renders with default primary variant', () => {
    render(<Button>Brew Now</Button>)
    expect(screen.getByRole('button', { name: 'Brew Now' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Start</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Start</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('renders secondary variant', () => {
    render(<Button variant="secondary">Cancel</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
