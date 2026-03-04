export type BrewMethod =
  | 'hot-v60'
  | 'iced-v60'
  | 'aeropress'
  | 'french-press'
  | 'moka-pot'
  | 'cold-brew'

export interface BrewStep {
  label: string
  waterGrams: number
  durationSeconds: number
  instruction: string
}

export interface Recipe {
  id: string
  name: string
  author: string
  method: BrewMethod
  description: string
  coffeeGrams: number
  totalWaterGrams: number
  waterTempC: number
  grindSize: string
  totalTimeSeconds: number
  steps: BrewStep[]
  isDefault: boolean
  slug: string
}
