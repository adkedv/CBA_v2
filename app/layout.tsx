// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    template: '%s | Coffee Brewing Assistant',
    default: 'Coffee Brewing Assistant | Your Guide to the Perfect Cup',
  },
  description: 'Step-by-step brewing guides, timers, and recipes for V60, AeroPress, French Press, Moka Pot, and more. Free, no sign-up required.',
  metadataBase: new URL('https://coffeebrewingassistant.com'),
  openGraph: {
    siteName: 'Coffee Brewing Assistant',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  keywords: ['coffee', 'brewing', 'V60', 'AeroPress', 'French Press', 'pour over', 'coffee timer', 'brewing guide'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-brand-cream">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
