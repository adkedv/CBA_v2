import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-brand-tan/30 bg-brand-cream mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-serif text-brand-brown font-semibold">Coffee Brewing Assistant</span>
          <nav className="flex gap-4 text-sm text-brand-brown/70">
            <Link href="/app" className="hover:text-brand-brown transition-colors">App</Link>
            <Link href="/blog" className="hover:text-brand-brown transition-colors">Blog</Link>
            <Link href="/recipes" className="hover:text-brand-brown transition-colors">Recipes</Link>
          </nav>
          <p className="text-xs text-brand-tan">
            © {new Date().getFullYear()} Coffee Brewing Assistant. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
