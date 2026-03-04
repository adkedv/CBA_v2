import { BARISTA_RECIPES, getRecipesByMethod, getRecipeBySlug } from '@/lib/recipes/barista-recipes'

describe('barista recipes', () => {
  it('covers all 6 brew methods', () => {
    const methods = [...new Set(BARISTA_RECIPES.map((r) => r.method))]
    expect(methods).toHaveLength(6)
  })

  it('every recipe has valid water amounts', () => {
    for (const recipe of BARISTA_RECIPES) {
      const stepTotal = recipe.steps.reduce((sum, s) => sum + s.waterGrams, 0)
      expect(stepTotal).toBeLessThanOrEqual(recipe.totalWaterGrams * 1.1)
    }
  })

  it('getRecipesByMethod returns correct method', () => {
    const v60 = getRecipesByMethod('hot-v60')
    expect(v60.every((r) => r.method === 'hot-v60')).toBe(true)
  })

  it('getRecipeBySlug returns correct recipe', () => {
    const r = getRecipeBySlug('hoffmann-4-6-hot-v60')
    expect(r?.name).toBe('4:6 Method')
  })

  it('getRecipeBySlug returns null for unknown slug', () => {
    expect(getRecipeBySlug('not-real')).toBeNull()
  })
})
