import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-xl font-sans font-medium transition-all' +
    ' duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

  const variants: Record<string, string> = {
    primary: 'bg-brand-brown text-brand-cream hover:bg-brand-espresso active:scale-[0.98]',
    secondary: 'bg-brand-cream text-brand-brown border border-brand-tan hover:border-brand-brown',
    ghost: 'text-brand-brown hover:bg-brand-tan/20',
  }

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3.5 text-lg w-full',
  }

  return (
    <button
      className={`${base} ${variants[variant] ?? variants['primary']} ${sizes[size] ?? sizes['md']} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
