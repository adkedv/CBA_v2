import { render, screen, fireEvent } from '@testing-library/react'
import { Toggle } from '@/components/ui/Toggle'

describe('Toggle', () => {
  it('renders with correct aria-checked when unchecked', () => {
    render(<Toggle checked={false} onChange={() => {}} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })

  it('renders with correct aria-checked when checked', () => {
    render(<Toggle checked={true} onChange={() => {}} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('calls onChange when clicked', () => {
    const onChange = vi.fn()
    render(<Toggle checked={false} onChange={onChange} />)
    fireEvent.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('displays label when provided', () => {
    render(<Toggle checked={false} onChange={() => {}} label="Custom bloom" />)
    expect(screen.getByText('Custom bloom')).toBeInTheDocument()
  })
})
