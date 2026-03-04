import type { Recipe } from './types'

export const BARISTA_RECIPES: Recipe[] = [
  // ── HOT V60 ──────────────────────────────────
  {
    id: 'hoffmann-4-6',
    name: '4:6 Method',
    author: 'James Hoffmann',
    method: 'hot-v60',
    description:
      "Hoffmann's famous 4:6 method divides brewing into two phases — 40% controls sweetness/acidity, 60% controls strength. Produces a balanced, complex cup.",
    coffeeGrams: 20,
    totalWaterGrams: 300,
    waterTempC: 93,
    grindSize: 'Medium (21 on Comandante, 15 on 1Zpresso JX)',
    totalTimeSeconds: 210,
    steps: [
      {
        label: 'First bloom',
        waterGrams: 50,
        durationSeconds: 45,
        instruction:
          'Pour 50g in slow circles. This controls sweetness — for sweeter, pour more here.',
      },
      {
        label: 'Second pour',
        waterGrams: 70,
        durationSeconds: 45,
        instruction:
          'Pour 70g. The 4th of your total water. Wait for 1:30 total before next pour.',
      },
      {
        label: 'Third pour',
        waterGrams: 60,
        durationSeconds: 45,
        instruction: 'Pour 60g. Start of the strength phase — three equal pours of 60g.',
      },
      {
        label: 'Fourth pour',
        waterGrams: 60,
        durationSeconds: 45,
        instruction: 'Pour 60g. Maintain even saturation.',
      },
      {
        label: 'Fifth pour',
        waterGrams: 60,
        durationSeconds: 45,
        instruction: 'Final 60g. Allow to fully drain — should finish at 3:30.',
      },
    ],
    isDefault: true,
    slug: 'hoffmann-4-6-hot-v60',
  },
  {
    id: 'hedrick-single-pour',
    name: 'Single Pour Method',
    author: 'Lance Hedrick',
    method: 'hot-v60',
    description:
      "Hedrick's fast single-pour technique for those who prefer a more hands-off approach. Great for medium-dark roasts.",
    coffeeGrams: 15,
    totalWaterGrams: 250,
    waterTempC: 96,
    grindSize: 'Medium-coarse (24 on Comandante)',
    totalTimeSeconds: 180,
    steps: [
      {
        label: 'Bloom',
        waterGrams: 45,
        durationSeconds: 40,
        instruction: 'Pour 45g in a spiral from center out. All grounds should be saturated.',
      },
      {
        label: 'Main pour',
        waterGrams: 205,
        durationSeconds: 90,
        instruction:
          'Pour remaining 205g in one steady, continuous pour. Maintain a consistent flow rate.',
      },
    ],
    isDefault: true,
    slug: 'hedrick-single-pour-hot-v60',
  },
  // ── ICED V60 ─────────────────────────────────
  {
    id: 'japanese-iced-v60',
    name: 'Japanese Iced V60',
    author: 'Traditional',
    method: 'iced-v60',
    description:
      'Brew hot, directly onto ice. The dilution from melting ice is calculated into the recipe — resulting in a bright, clear, cold cup with full extraction.',
    coffeeGrams: 20,
    totalWaterGrams: 200,
    waterTempC: 95,
    grindSize: 'Medium-fine (18 on Comandante)',
    totalTimeSeconds: 180,
    steps: [
      {
        label: 'Setup',
        waterGrams: 0,
        durationSeconds: 0,
        instruction: 'Place 100g ice in your server before brewing.',
      },
      {
        label: 'Bloom',
        waterGrams: 40,
        durationSeconds: 45,
        instruction: "Pour 40g in circles. Grounds will be more resistant — that's normal.",
      },
      {
        label: 'Second pour',
        waterGrams: 80,
        durationSeconds: 45,
        instruction: 'Pour 80g slowly. Ice in server will start melting.',
      },
      {
        label: 'Final pour',
        waterGrams: 80,
        durationSeconds: 45,
        instruction: 'Pour final 80g. Swirl gently when done. Serve immediately over more ice.',
      },
    ],
    isDefault: true,
    slug: 'japanese-iced-v60',
  },
  // ── AEROPRESS ────────────────────────────────
  {
    id: 'hoffmann-inverted-aeropress',
    name: 'Inverted Method',
    author: 'James Hoffmann',
    method: 'aeropress',
    description:
      "Hoffmann's inverted AeroPress technique for maximum immersion and control. More forgiving than standard and produces a richer cup.",
    coffeeGrams: 11,
    totalWaterGrams: 200,
    waterTempC: 100,
    grindSize: 'Medium (18 on Comandante)',
    totalTimeSeconds: 120,
    steps: [
      {
        label: 'Setup (inverted)',
        waterGrams: 0,
        durationSeconds: 0,
        instruction: 'Flip AeroPress upside down with plunger at bottom. Add 11g coffee.',
      },
      {
        label: 'Full pour',
        waterGrams: 200,
        durationSeconds: 30,
        instruction: 'Pour all 200g. Stir gently x3. Place wet filter cap on top.',
      },
      {
        label: 'Steep',
        waterGrams: 0,
        durationSeconds: 60,
        instruction: 'Wait 1 minute. Flip onto your cup carefully.',
      },
      {
        label: 'Press',
        waterGrams: 0,
        durationSeconds: 30,
        instruction: 'Press slowly and steadily for 30 seconds. Stop when you hear air.',
      },
    ],
    isDefault: true,
    slug: 'hoffmann-inverted-aeropress',
  },
  // ── FRENCH PRESS ─────────────────────────────
  {
    id: 'hoffmann-french-press',
    name: 'The Better French Press',
    author: 'James Hoffmann',
    method: 'french-press',
    description:
      "Hoffmann's technique that eliminates the sludge problem. Break the crust, skim the foam, wait — then pour through the press as a filter (don't plunge fully).",
    coffeeGrams: 30,
    totalWaterGrams: 500,
    waterTempC: 94,
    grindSize: 'Coarse (30 on Comandante)',
    totalTimeSeconds: 720,
    steps: [
      {
        label: 'Bloom pour',
        waterGrams: 500,
        durationSeconds: 30,
        instruction: 'Pour all 500g. Make sure all grounds are saturated. Do not stir.',
      },
      {
        label: 'Wait 4 minutes',
        waterGrams: 0,
        durationSeconds: 240,
        instruction: 'Leave completely undisturbed for 4 minutes.',
      },
      {
        label: 'Break crust',
        waterGrams: 0,
        durationSeconds: 60,
        instruction:
          'Stir the top 3 times to break the crust. Scoop off foam and any floating grounds with a spoon.',
      },
      {
        label: 'Wait 5-8 min',
        waterGrams: 0,
        durationSeconds: 390,
        instruction:
          'Wait another 5-8 minutes. Grounds will settle to bottom. Do NOT plunge — just pour slowly.',
      },
    ],
    isDefault: true,
    slug: 'hoffmann-french-press',
  },
  // ── MOKA POT ─────────────────────────────────
  {
    id: 'classic-moka-pot',
    name: 'Classic Stovetop',
    author: 'Traditional',
    method: 'moka-pot',
    description:
      'The traditional Italian stovetop method. Uses pressure to produce a concentrated, espresso-like coffee. Use pre-heated water for best results.',
    coffeeGrams: 18,
    totalWaterGrams: 130,
    waterTempC: 95,
    grindSize: 'Medium-fine (16 on Comandante)',
    totalTimeSeconds: 240,
    steps: [
      {
        label: 'Setup',
        waterGrams: 130,
        durationSeconds: 30,
        instruction:
          'Fill bottom chamber with pre-boiled hot water to the valve. Add ground coffee — level, not tamped.',
      },
      {
        label: 'Heat',
        waterGrams: 0,
        durationSeconds: 120,
        instruction:
          'Place on medium-low heat with lid open. Watch for coffee to start flowing.',
      },
      {
        label: 'Monitor',
        waterGrams: 0,
        durationSeconds: 60,
        instruction:
          "When coffee flows golden-brown, it's good. If it starts sputtering or darkening, reduce heat.",
      },
      {
        label: 'Stop',
        waterGrams: 0,
        durationSeconds: 30,
        instruction:
          'Remove from heat when chamber is 2/3 full. Run bottom under cold water to stop extraction.',
      },
    ],
    isDefault: true,
    slug: 'classic-moka-pot',
  },
  // ── COLD BREW ────────────────────────────────
  {
    id: 'cold-brew-concentrate',
    name: 'Concentrate (1:5)',
    author: 'CBA Standard',
    method: 'cold-brew',
    description:
      'A strong concentrate that you dilute 1:1 with water or milk before serving. Steep for 16-24 hours in the fridge.',
    coffeeGrams: 100,
    totalWaterGrams: 500,
    waterTempC: 4,
    grindSize: 'Coarse (32 on Comandante)',
    totalTimeSeconds: 72000,
    steps: [
      {
        label: 'Combine',
        waterGrams: 500,
        durationSeconds: 60,
        instruction:
          'Combine 100g coarse ground coffee with 500g cold water. Stir to saturate all grounds.',
      },
      {
        label: 'Steep',
        waterGrams: 0,
        durationSeconds: 72000,
        instruction: 'Cover and refrigerate for 16-24 hours. Longer = stronger and more bitter.',
      },
      {
        label: 'Filter',
        waterGrams: 0,
        durationSeconds: 300,
        instruction:
          'Strain through a fine mesh or paper filter into a clean bottle. This takes 3-5 minutes.',
      },
    ],
    isDefault: true,
    slug: 'cold-brew-concentrate',
  },
]

export function getRecipesByMethod(method: string): Recipe[] {
  return BARISTA_RECIPES.filter((r) => r.method === method)
}

export function getRecipeBySlug(slug: string): Recipe | null {
  return BARISTA_RECIPES.find((r) => r.slug === slug) ?? null
}
