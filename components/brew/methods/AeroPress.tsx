'use client'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CircularTimer } from '@/components/ui/CircularTimer'
import { getRecipesByMethod } from '@/lib/recipes/barista-recipes'
import type { Recipe } from '@/lib/recipes/types'

type BrewPhase = 'setup' | 'brewing' | 'complete'

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = window.localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : fallback
  } catch {
    return fallback
  }
}

const RECIPES = getRecipesByMethod('aeropress')

export function AeroPress() {
  const [selectedSlug, setSelectedSlug] = useState<string>(() =>
    getStored('cba_aeropress_recipe', RECIPES[0]?.slug ?? ''),
  )
  const [coffeeGrams, setCoffeeGrams] = useState<number>(() =>
    getStored('cba_aeropress_coffee', 11),
  )
  const [phase, setPhase] = useState<BrewPhase>('setup')
  const [stepIndex, setStepIndex] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const recipe: Recipe = RECIPES.find((r) => r.slug === selectedSlug) ?? (RECIPES[0] as Recipe)
  const scale = recipe.coffeeGrams > 0 ? coffeeGrams / recipe.coffeeGrams : 1

  const scaledSteps = recipe.steps.map((s) => ({
    ...s,
    waterGrams: s.waterGrams > 0 ? Math.round(s.waterGrams * scale) : 0,
  }))
  const totalWater = Math.round(recipe.totalWaterGrams * scale)

  useEffect(() => {
    localStorage.setItem('cba_aeropress_recipe', selectedSlug)
  }, [selectedSlug])

  useEffect(() => {
    localStorage.setItem('cba_aeropress_coffee', JSON.stringify(coffeeGrams))
  }, [coffeeGrams])

  useEffect(() => {
    if (phase !== 'brewing') return
    const step = scaledSteps[stepIndex]
    if (!step || step.durationSeconds === 0) return

    intervalRef.current = setInterval(() => {
      setElapsed((e) => {
        if (e + 1 >= step.durationSeconds) {
          clearInterval(intervalRef.current!)
          return step.durationSeconds
        }
        return e + 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [phase, stepIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-advance to next step 1.5s after timer reaches 0
  useEffect(() => {
    if (phase !== 'brewing') return
    const step = scaledSteps[stepIndex]
    if (!step || step.durationSeconds === 0) return
    if (elapsed < step.durationSeconds) return
    const t = setTimeout(handleNextStep, 1500)
    return () => clearTimeout(t)
  }, [elapsed, stepIndex, phase]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleStart() {
    setPhase('brewing')
    setStepIndex(0)
    setElapsed(0)
  }

  function handleNextStep() {
    if (stepIndex + 1 >= scaledSteps.length) {
      setPhase('complete')
    } else {
      setStepIndex((i) => i + 1)
      setElapsed(0)
    }
  }

  function handleReset() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setPhase('setup')
    setStepIndex(0)
    setElapsed(0)
  }

  const currentStep = scaledSteps[stepIndex]
  const timeLeft =
    currentStep && currentStep.durationSeconds > 0
      ? Math.max(0, currentStep.durationSeconds - elapsed)
      : 0

  // ── SETUP ────────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-serif text-3xl font-bold text-brand-espresso">AeroPress Guide</h2>
          <p className="text-brand-brown/70 mt-1">
            Versatile and forgiving. Great for strong, espresso-style or filter-style brews.
          </p>
        </div>

        <Card>
          <h3 className="font-serif text-xl font-bold text-brand-espresso mb-4">
            1. Choose a Recipe
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {RECIPES.map((r) => (
              <button
                key={r.slug}
                onClick={() => setSelectedSlug(r.slug)}
                className={`text-left p-4 rounded-lg border-2 transition-colors ${
                  selectedSlug === r.slug
                    ? 'border-brand-brown bg-brand-tan/20'
                    : 'border-transparent bg-brand-tan/10 hover:bg-brand-tan/20'
                }`}
              >
                <div className="font-semibold text-brand-espresso">{r.name}</div>
                <div className="text-sm text-brand-brown/60 mt-0.5">by {r.author}</div>
                <div className="text-sm text-brand-brown/70 mt-1 leading-snug">{r.description}</div>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-serif text-xl font-bold text-brand-espresso mb-4">
            2. Set Your Dose
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-brand-brown/80">Coffee</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={5}
                    max={30}
                    value={coffeeGrams}
                    onChange={(e) => setCoffeeGrams(Math.max(5, Number(e.target.value)))}
                    className="w-14 text-center font-bold text-brand-espresso bg-brand-tan/20 rounded-lg p-1 border border-transparent focus:border-brand-brown focus:outline-none text-sm"
                  />
                  <span className="text-sm text-brand-brown/60">g</span>
                </div>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                value={coffeeGrams}
                onChange={(e) => setCoffeeGrams(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-brand-brown bg-brand-brown/20"
              />
            </div>
            <div className="flex items-center justify-between py-2.5 px-3 bg-brand-tan/10 rounded-lg">
              <span className="text-sm font-medium text-brand-brown/80">Water</span>
              <span className="font-bold text-brand-espresso">{totalWater}g</span>
            </div>
          </div>
          <div className="mt-3 text-sm text-brand-brown/60 space-y-0.5">
            <div>Temp: {recipe.waterTempC}°C</div>
            <div>Grind: {recipe.grindSize}</div>
          </div>
        </Card>

        <Card>
          <h3 className="font-serif text-xl font-bold text-brand-espresso mb-2">
            3. Before You Start
          </h3>
          <p className="text-sm text-brand-brown/70 mb-4">
            Wet the filter cap. Have your cup or server ready beneath the AeroPress.
          </p>
          <Button onClick={handleStart} className="w-full">
            Start Brewing
          </Button>
        </Card>
      </div>
    )
  }

  // ── COMPLETE ──────────────────────────────────────────────────────────────
  if (phase === 'complete') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-serif text-3xl font-bold text-brand-espresso">Brew Complete</h2>
          <p className="text-brand-brown/70 mt-1">Enjoy your {recipe.name}.</p>
        </div>
        <Card>
          <div className="text-center py-6">
            <div className="text-6xl mb-4">☕</div>
            <p className="text-brand-brown/80 mb-1">
              {coffeeGrams}g coffee · {totalWater}g water
            </p>
            <p className="text-sm text-brand-brown/60">{recipe.grindSize}</p>
          </div>
          <Button onClick={handleReset} variant="secondary" className="w-full">
            Brew Again
          </Button>
        </Card>
      </div>
    )
  }

  // ── BREWING ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-bold text-brand-espresso">{recipe.name}</h2>
          <p className="text-brand-brown/60 text-sm mt-0.5">by {recipe.author}</p>
        </div>
        <button onClick={handleReset} className="text-brand-brown/40 hover:text-brand-brown text-sm">
          Reset
        </button>
      </div>

      <div className="flex gap-1.5">
        {scaledSteps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < stepIndex ? 'bg-brand-brown' : i === stepIndex ? 'bg-brand-amber' : 'bg-brand-brown/20'
            }`}
          />
        ))}
      </div>

      {currentStep && (
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs font-medium text-brand-brown/50 uppercase tracking-wide mb-1">
                Step {stepIndex + 1} of {scaledSteps.length}
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-espresso">
                {currentStep.label}
              </h3>
              {currentStep.waterGrams > 0 && (
                <div className="text-brand-brown/70 mt-1">
                  Pour <strong>{currentStep.waterGrams}g</strong>
                </div>
              )}
            </div>
            {currentStep.durationSeconds > 0 && (
              <CircularTimer
                seconds={timeLeft}
                totalSeconds={currentStep.durationSeconds}
                isRunning={phase === 'brewing' && timeLeft > 0}
              />
            )}
          </div>
          <p className="text-brand-brown/80 text-sm leading-relaxed mb-5">
            {currentStep.instruction}
          </p>
          <Button onClick={handleNextStep} className="w-full">
            {stepIndex + 1 >= scaledSteps.length ? 'Finish' : 'Next Step'}
          </Button>
        </Card>
      )}

      {scaledSteps.slice(stepIndex + 1).length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-brand-brown/40 uppercase tracking-wide">
            Coming up
          </p>
          {scaledSteps.slice(stepIndex + 1).map((s, i) => (
            <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-brand-tan/10">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-brown/20 flex-shrink-0" />
              <span className="text-sm text-brand-brown/60">{s.label}</span>
              {s.waterGrams > 0 && (
                <span className="ml-auto text-xs text-brand-brown/40">{s.waterGrams}g</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
