import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean
}

export function Card({ glass = false, className = '', children, ...props }: CardProps) {
  const base = 'rounded-2xl p-6'
  const surface = glass
    ? 'bg-white/60 backdrop-blur-sm border border-white/40 shadow-sm'
    : 'bg-white border border-brand-tan/30 shadow-sm'

  return (
    <div className={`${base} ${surface} ${className}`} {...props}>
      {children}
    </div>
  )
}
