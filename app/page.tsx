import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Coffee Brewing Assistant | Your Guide to the Perfect Cup',
  description:
    'Free step-by-step brewing guides for V60, AeroPress, French Press, Moka Pot and more. Timers, ratios, and barista-approved recipes.',
}

const features = [
  {
    icon: '⏱',
    title: 'Guided Timers',
    body: 'Step-by-step pour timers with bloom detection. Never guess when to pour again.',
  },
  {
    icon: '☕',
    title: '6 Brew Methods',
    body: 'Hot V60, Iced V60, AeroPress, French Press, Moka Pot, Cold Brew — all in one place.',
  },
  {
    icon: '🏆',
    title: 'Barista Recipes',
    body: "James Hoffmann's 4:6, Scott Rao's allongé, Lance Hedrick's single-pour — built in.",
  },
  {
    icon: '✏️',
    title: 'Custom Recipes',
    body: 'Build your own. Adjust every variable. Save it, share it via link.',
  },
]

const methods = ['Hot V60', 'Iced V60', 'AeroPress', 'French Press', 'Moka Pot', 'Cold Brew']

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-cream to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <p className="text-brand-amber font-medium tracking-widest uppercase text-sm mb-4">
            Free · No Sign-up Required
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-brand-espresso leading-tight mb-6">
            Stop Guessing.
            <br />
            Start Brewing.
          </h1>
          <p className="text-brand-brown/70 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Precision brewing guides with real-time timers, barista-approved ratios, and recipes
            from the world&apos;s best coffee makers — free, forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/app">
              <Button size="lg">Start Brewing Free</Button>
            </Link>
            <Link href="/recipes">
              <Button size="lg" variant="secondary">
                Browse Recipes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-center text-brand-espresso mb-12">
          Everything you need for better coffee
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="text-center hover:shadow-md transition-shadow">
              <span className="text-4xl block mb-4">{f.icon}</span>
              <h3 className="font-serif text-lg font-semibold text-brand-espresso mb-2">
                {f.title}
              </h3>
              <p className="text-brand-brown/70 text-sm leading-relaxed">{f.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-brand-espresso text-brand-cream py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="font-serif text-2xl sm:text-3xl italic leading-relaxed mb-6">
            &ldquo;This is the tool I wish I had when I started. It&apos;s like having a patient,
            knowledgeable barista in your pocket.&rdquo;
          </p>
          <p className="text-brand-tan text-sm tracking-wide uppercase">— Home Barista, Beta User</p>
        </div>
      </section>

      {/* Methods section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-center text-brand-espresso mb-4">
          Six methods. One app.
        </h2>
        <p className="text-brand-brown/70 text-center mb-12 max-w-xl mx-auto">
          From your morning V60 to weekend cold brew experiments — all your brew methods live here.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {methods.map((method) => (
            <Card
              key={method}
              glass
              className="text-center py-8 hover:border-brand-brown/40 transition-colors cursor-pointer"
            >
              <p className="font-serif text-lg font-semibold text-brand-espresso">{method}</p>
            </Card>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/app">
            <Button size="lg">Open the App</Button>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-amber/10 border-t border-brand-tan/30 py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-espresso mb-4">
            Ready to craft your best cup?
          </h2>
          <p className="text-brand-brown/70 mb-8">
            Free to use. No account required to start brewing.
          </p>
          <Link href="/app">
            <Button size="lg">Start Your First Brew</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
