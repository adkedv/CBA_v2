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

const checklist = ['grinder', 'kettle', 'scale', 'filter', 'v60'] as const
type ChecklistKey = (typeof checklist)[number]
const checklistLabels: Record<ChecklistKey, string> = {
  grinder: 'Grind your coffee',
  kettle: 'Heat water to temp',
  scale: 'Tare your scale',
  filter: 'Rinse the paper filter',
  v60: 'Assemble V60 on server',
}

const RECIPES = getRecipesByMethod('hot-v60')

export function HotV60() {
  const [selectedSlug, setSelectedSlug] = useState<string>(() =>
    getStored('cba_hotv60_recipe', RECIPES[0]?.slug ?? ''),
  )
  const [coffeeGrams, setCoffeeGrams] = useState<number>(() =>
    getStored('cba_hotv60_coffee', 20),
  )
  const [phase, setPhase] = useState<BrewPhase>('setup')
  const [checked, setChecked] = useState<Partial<Record<ChecklistKey, boolean>>>({})
  const [stepIndex, setStepIndex] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const recipe: Recipe = RECIPES.find((r) => r.slug === selectedSlug) ?? (RECIPES[0] as Recipe)

  // Scale factor relative to recipe defaults
  const scale = recipe.coffeeGrams > 0 ? coffeeGrams / recipe.coffeeGrams : 1

  const scaledSteps = recipe.steps.map((s) => ({
    ...s,
    waterGrams: s.waterGrams > 0 ? Math.round(s.waterGrams * scale) : 0,
    durationSeconds: s.durationSeconds,
  }))
  const totalWater = Math.round(recipe.totalWaterGrams * scale)

  useEffect(() => {
    localStorage.setItem('cba_hotv60_recipe', selectedSlug)
  }, [selectedSlug])

  useEffect(() => {
    localStorage.setItem('cba_hotv60_coffee', JSON.stringify(coffeeGrams))
  }, [coffeeGrams])

  // Timer
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
    setChecked({})
  }

  const allChecked = checklist.every((k) => checked[k])
  const currentStep = scaledSteps[stepIndex]
  const timeLeft =
    currentStep && currentStep.durationSeconds > 0
      ? Math.max(0, currentStep.durationSeconds - elapsed)
      : 0

  // ── SETUP PHASE ──────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-serif text-3xl font-bold text-brand-espresso">Hot V60 Guide</h2>
          <p className="text-brand-brown/70 mt-1">
            A clean, bright cup. Precise pouring unlocks full flavour potential.
          </p>
        </div>

        {/* Recipe selector */}
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

        {/* Adjust dose */}
        <Card>
          <h3 className="font-serif text-xl font-bold text-brand-espresso mb-4">
            2. Adjust Dose
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-brand-brown/80">Coffee</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={5}
                    max={50}
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
                max={50}
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
            <div>Ratio: 1:{coffeeGrams > 0 ? (totalWater / coffeeGrams).toFixed(1) : '—'}</div>
            <div>Temp: {recipe.waterTempC}°C</div>
            <div>Grind: {recipe.grindSize}</div>
          </div>
        </Card>

        {/* Checklist */}
        <Card>
          <h3 className="font-serif text-xl font-bold text-brand-espresso mb-4">
            3. Get Ready
          </h3>
          <div className="space-y-3">
            {checklist.map((key) => (
              <button
                key={key}
                onClick={() => setChecked((c) => ({ ...c, [key]: !c[key] }))}
                className="w-full flex items-center gap-3 text-left group"
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    checked[key]
                      ? 'bg-brand-brown border-brand-brown'
                      : 'border-brand-brown/30 group-hover:border-brand-brown/60'
                  }`}
                >
                  {checked[key] && (
                    <svg className="w-3 h-3 text-brand-cream" fill="none" viewBox="0 0 12 12">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-sm transition-colors ${
                    checked[key] ? 'text-brand-brown/40 line-through' : 'text-brand-brown/80'
                  }`}
                >
                  {checklistLabels[key]}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-5">
            <Button onClick={handleStart} disabled={!allChecked} className="w-full">
              Start Brewing
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // ── COMPLETE PHASE ────────────────────────────────────────────────────────
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
            <p className="text-brand-brown/80 mb-2">
              Brewed {coffeeGrams}g coffee with {totalWater}g water.
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

  // ── BREWING PHASE ─────────────────────────────────────────────────────────
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

      {/* Step progress */}
      <div className="flex gap-1.5">
        {scaledSteps.map((s, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < stepIndex
                ? 'bg-brand-brown'
                : i === stepIndex
                  ? 'bg-brand-amber'
                  : 'bg-brand-brown/20'
            }`}
          />
        ))}
      </div>

      {/* Current step */}
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

      {/* Remaining steps preview */}
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
