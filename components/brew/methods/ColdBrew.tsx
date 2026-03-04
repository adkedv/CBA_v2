'use client'
import { useState, useEffect, useMemo } from 'react'
import { Card } from '@/components/ui/Card'

interface ColdBrewRatios {
  concentrate: number
  light: number
  medium: number
  strong: number
}

type BrewType = 'concentrate' | 'ready'
type Strength = 'light' | 'medium' | 'strong'

const DEFAULT_RATIOS: ColdBrewRatios = { concentrate: 5, light: 18, medium: 15, strong: 12 }

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = window.localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : fallback
  } catch {
    return fallback
  }
}

const STEEP_TIMES = [12, 16, 20, 24, 48]

export function ColdBrew() {
  const [brewType, setBrewType] = useState<BrewType>('concentrate')
  const [strength, setStrength] = useState<Strength>('medium')
  const [coffee, setCoffee] = useState(100)
  const [water, setWater] = useState(500)
  const [steepTime, setSteepTime] = useState(16)
  const [showSettings, setShowSettings] = useState(false)
  const [ratios, setRatios] = useState<ColdBrewRatios>(() =>
    getStored('cba_coldBrewRatios', DEFAULT_RATIOS),
  )

  useEffect(() => {
    localStorage.setItem('cba_coldBrewRatios', JSON.stringify(ratios))
  }, [ratios])

  const currentRatio = useMemo(() => {
    return brewType === 'concentrate' ? ratios.concentrate : ratios[strength]
  }, [brewType, strength, ratios])

  useEffect(() => {
    setWater(Math.round(coffee * currentRatio))
  }, [brewType, strength, currentRatio])

  const handleCoffeeChange = (val: number) => {
    setCoffee(val)
    setWater(Math.round(val * currentRatio))
  }

  const handleWaterChange = (val: number) => {
    setWater(val)
    setCoffee(Math.round(val / currentRatio))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-bold text-brand-espresso">Cold Brew Guide</h2>
        <p className="text-brand-brown/70 mt-1">
          Smooth, low-acid coffee. Make it in the evening and it&apos;s ready by morning.
        </p>
      </div>

      {/* Style selector */}
      <Card>
        <h3 className="font-serif text-xl font-bold text-brand-espresso mb-4">
          1. Choose Your Style
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {(['concentrate', 'ready'] as BrewType[]).map((t) => (
            <button
              key={t}
              onClick={() => setBrewType(t)}
              className={`py-3 rounded-lg font-medium transition-colors capitalize ${brewType === t ? 'bg-brand-brown text-brand-cream' : 'bg-brand-tan/20 text-brand-brown'}`}
            >
              {t === 'concentrate' ? 'Concentrate' : 'Ready to Drink'}
            </button>
          ))}
        </div>
      </Card>

      {/* Ratio selector */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif text-xl font-bold text-brand-espresso">2. Set Your Ratio</h3>
          <button
            onClick={() => setShowSettings((s) => !s)}
            className="text-brand-brown/50 hover:text-brand-brown transition-colors text-sm"
          >
            Adjust ratios
          </button>
        </div>

        {showSettings && (
          <div className="space-y-4 p-4 mb-4 bg-brand-tan/10 rounded-lg">
            {Object.entries(ratios).map(([key, val]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-brand-brown/80 mb-1 capitalize">
                  {key} (1:{val})
                </label>
                <input
                  type="range"
                  min={key === 'concentrate' ? 3 : key === 'light' ? 16 : key === 'medium' ? 13 : 10}
                  max={key === 'concentrate' ? 8 : key === 'light' ? 20 : key === 'medium' ? 17 : 14}
                  value={val}
                  onChange={(e) =>
                    setRatios((r) => ({ ...r, [key]: Number(e.target.value) }))
                  }
                  className="w-full h-2 bg-brand-brown/20 rounded-lg appearance-none cursor-pointer accent-brand-brown"
                />
              </div>
            ))}
          </div>
        )}

        {brewType === 'concentrate' ? (
          <p className="text-brand-brown/80 mb-4 text-center">
            Using a <strong>1:{ratios.concentrate}</strong> coffee to water ratio.
          </p>
        ) : (
          <div className="mb-4">
            <div className="flex justify-between font-medium text-brand-brown/70 px-2 mb-2 text-sm">
              <span>Strong</span>
              <span>Medium</span>
              <span>Light</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              value={{ strong: 0, medium: 1, light: 2 }[strength]}
              onChange={(e) => setStrength((['strong', 'medium', 'light'] as Strength[])[Number(e.target.value)]!)}
              className="w-full h-2 bg-brand-brown/20 rounded-lg appearance-none cursor-pointer accent-brand-brown"
            />
            <p className="text-center text-brand-brown/70 mt-2 text-sm">
              {strength.charAt(0).toUpperCase() + strength.slice(1)} — 1:{currentRatio} ratio
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-brown/80 mb-1">Coffee (g)</label>
            <input
              type="number"
              value={coffee}
              onChange={(e) => handleCoffeeChange(Number(e.target.value))}
              className="w-full p-3 font-bold text-lg text-brand-espresso bg-brand-tan/20 rounded-lg border border-transparent focus:border-brand-brown focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-brown/80 mb-1">Water (g)</label>
            <input
              type="number"
              value={water}
              onChange={(e) => handleWaterChange(Number(e.target.value))}
              className="w-full p-3 font-bold text-lg text-brand-espresso bg-brand-tan/20 rounded-lg border border-transparent focus:border-brand-brown focus:outline-none"
            />
          </div>
        </div>
      </Card>

      {/* Steep time */}
      <Card>
        <h3 className="font-serif text-xl font-bold text-brand-espresso mb-4">
          3. Choose Steep Time
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {STEEP_TIMES.map((t) => (
            <button
              key={t}
              onClick={() => setSteepTime(t)}
              className={`py-3 rounded-lg font-medium transition-colors text-sm text-center ${steepTime === t ? 'bg-brand-brown text-brand-cream' : 'bg-brand-tan/20 text-brand-brown'}`}
            >
              {t}h
            </button>
          ))}
        </div>
        <div className="mt-4 p-3 bg-brand-amber/10 rounded-lg text-sm text-brand-brown/80">
          <strong>Tip:</strong> Steep for {steepTime} hours in the fridge. For best results use
          cold water from the start.
        </div>
      </Card>

      {/* Grind guide */}
      <Card>
        <h3 className="font-serif text-xl font-bold text-brand-espresso mb-2">
          4. Grind Setting
        </h3>
        <p className="text-brand-brown/80">
          Use a <strong>medium-coarse to coarse</strong> grind — similar to coarse sea salt. This
          prevents over-extraction and keeps the brew clean.
        </p>
      </Card>

      {/* Storage */}
      {brewType === 'concentrate' && (
        <Card>
          <h3 className="font-serif text-xl font-bold text-brand-espresso mb-2">
            5. Usage &amp; Storage
          </h3>
          <p className="text-brand-brown/80 mb-2">
            Store your concentrate in a sealed container in the fridge for up to 14 days.
          </p>
          <p className="text-brand-brown/70 text-sm">
            Dilute 1:1 or 1:2 with water or milk to serve. Experiment to find your ratio.
          </p>
        </Card>
      )}
    </div>
  )
}
