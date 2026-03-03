'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Nav() {
  const pathname = usePathname()

  const links = [
    { href: '/app', label: 'App' },
    { href: '/blog', label: 'Blog' },
    { href: '/recipes', label: 'Recipes' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-brand-cream/80 backdrop-blur-md border-b border-brand-tan/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-lg font-bold text-brand-espresso hover:text-brand-brown transition-colors">
          Coffee Brewing Assistant
        </Link>
        <nav className="flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? 'bg-brand-brown text-brand-cream'
                  : 'text-brand-brown hover:bg-brand-tan/20'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
