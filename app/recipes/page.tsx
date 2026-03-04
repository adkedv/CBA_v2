import type { Metadata } from 'next'
import Link from 'next/link'
import { BARISTA_RECIPES } from '@/lib/recipes/barista-recipes'
import { Card } from '@/components/ui/Card'
import type { BrewMethod } from '@/lib/recipes/types'

export const metadata: Metadata = {
  title: 'Recipes | Coffee Brewing Assistant',
  description:
    'Barista recipes for V60, AeroPress, French Press, Moka Pot, Cold Brew and more — curated from world-class baristas.',
}

const METHOD_LABELS: Record<BrewMethod, string> = {
  'hot-v60': 'Hot V60',
  'iced-v60': 'Iced V60',
  aeropress: 'AeroPress',
  'french-press': 'French Press',
  'moka-pot': 'Moka Pot',
  'cold-brew': 'Cold Brew',
}

const METHOD_ORDER: BrewMethod[] = [
  'hot-v60',
  'iced-v60',
  'aeropress',
  'french-press',
  'moka-pot',
  'cold-brew',
]

export default function RecipesPage() {
  const byMethod = METHOD_ORDER.reduce<Partial<Record<BrewMethod, (typeof BARISTA_RECIPES)[number][]>>>(
    (acc, method) => {
      acc[method] = BARISTA_RECIPES.filter((r) => r.method === method)
      return acc
    },
    {},
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="font-serif text-4xl font-bold text-brand-espresso">Recipes</h1>
        <p className="text-brand-brown/70 mt-2">
          Curated recipes from James Hoffmann, Lance Hedrick, and traditional methods.
        </p>
      </div>

      <div className="space-y-12">
        {METHOD_ORDER.map((method) => {
          const recipes = byMethod[method] ?? []
          if (recipes.length === 0) return null
          return (
            <section key={method}>
              <h2 className="font-serif text-2xl font-bold text-brand-espresso mb-4">
                {METHOD_LABELS[method]}
              </h2>
              <div className="space-y-4">
                {recipes.map((recipe) => (
                  <Card key={recipe.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-brand-espresso">{recipe.name}</h3>
                        <p className="text-sm text-brand-brown/60 mt-0.5">by {recipe.author}</p>
                        <p className="text-sm text-brand-brown/70 mt-2 leading-relaxed">
                          {recipe.description}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-3 text-xs text-brand-brown/50">
                          <span>{recipe.coffeeGrams}g coffee</span>
                          <span>{recipe.totalWaterGrams}g water</span>
                          <span>{recipe.waterTempC}°C</span>
                        </div>
                      </div>
                      <Link
                        href={`/app#${method}`}
                        className="flex-shrink-0 text-sm font-medium text-brand-brown bg-brand-tan/20 hover:bg-brand-tan/40 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Brew
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
