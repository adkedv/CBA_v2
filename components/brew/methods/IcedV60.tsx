'use client'
import { useState, useEffect, useMemo, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Toggle } from '@/components/ui/Toggle'
import { CircularTimer } from '@/components/ui/CircularTimer'

interface IcedV60Settings {
  gramsPerPerson: number
  coffeeRatio: number
  waterSplit: number
  bloomRatioMin: number
  bloomRatioMax: number
  bloomTimeMin: number
  bloomTimeMax: number
}

interface CustomBloomConfig {
  count: number
  durations: number[]
}

type BrewStep = 'setup' | 'brewing' | 'finishing' | 'complete'

const DEFAULTS = {
  settings: {
    gramsPerPerson: 18,
    coffeeRatio: 65,
    waterSplit: 60,
    bloomRatioMin: 2,
    bloomRatioMax: 3,
    bloomTimeMin: 45,
    bloomTimeMax: 55,
  } as IcedV60Settings,
  customBloom: false,
  customBloomConfig: { count: 2, durations: [45, 45] } as CustomBloomConfig,
  personalBrews: 0,
}

function getStoredValue<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = window.localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : fallback
  } catch {
    return fallback
  }
}

const checklist = ['grinder', 'kettle', 'scale', 'filter', 'v60', 'server'] as const
type ChecklistKey = (typeof checklist)[number]

const checklistLabels: Record<ChecklistKey, string> = {
  grinder: 'Grind your coffee',
  kettle: 'Heat water to ~96°C',
  scale: 'Get your scale ready',
  filter: 'Rinse paper filter',
  v60: 'Assemble brewer on server',
  server: 'Add ice to server',
}

export function IcedV60() {
  const [people, setPeople] = useState(1)
  const [useCustomWeight, setUseCustomWeight] = useState(false)
  const [customCoffeeWeight, setCustomCoffeeWeight] = useState(20)
  const [currentStep, setCurrentStep] = useState<BrewStep>('setup')
  const [currentBloom, setCurrentBloom] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [checked, setChecked] = useState<Record<ChecklistKey, boolean>>({
    grinder: false,
    kettle: false,
    scale: false,
    filter: false,
    v60: false,
    server: false,
  })
  const [personalBrews, setPersonalBrews] = useState(() =>
    getStoredValue('cba_personalBrews', DEFAULTS.personalBrews),
  )
  const [settings, setSettings] = useState<IcedV60Settings>(() =>
    getStoredValue('cba_settings', DEFAULTS.settings),
  )
  const [useCustomBloom, setUseCustomBloom] = useState(() =>
    getStoredValue('cba_useCustomBloom', DEFAULTS.customBloom),
  )
  const [customBloomConfig, setCustomBloomConfig] = useState<CustomBloomConfig>(() =>
    getStoredValue('cba_customBloomConfig', DEFAULTS.customBloomConfig),
  )

  useEffect(() => {
    localStorage.setItem('cba_settings', JSON.stringify(settings))
  }, [settings])
  useEffect(() => {
    localStorage.setItem('cba_useCustomBloom', JSON.stringify(useCustomBloom))
  }, [useCustomBloom])
  useEffect(() => {
    localStorage.setItem('cba_customBloomConfig', JSON.stringify(customBloomConfig))
  }, [customBloomConfig])
  useEffect(() => {
    localStorage.setItem('cba_personalBrews', JSON.stringify(personalBrews))
  }, [personalBrews])

  const coffeeWeight = useCustomWeight ? customCoffeeWeight : people * settings.gramsPerPerson

  const brewConfig = useMemo(() => {
    const totalWater = Math.round((coffeeWeight / settings.coffeeRatio) * 1000)
    const brewWater = Math.round(totalWater * (settings.waterSplit / 100))
    const iceWeight = totalWater - brewWater
    if (useCustomBloom) {
      const waterPerBloom = Math.round(brewWater / customBloomConfig.count)
      return {
        coffeeWeight,
        totalWater,
        brewWater,
        iceWeight,
        bloomCount: customBloomConfig.count,
        waterPerBloom,
        bloomTimes: customBloomConfig.durations,
        reasoning: `Custom bloom plan: ${customBloomConfig.count} pours.`,
      }
    }
    for (let blooms = 4; blooms >= 2; blooms--) {
      const waterPer = Math.round(brewWater / blooms)
      const ratio = waterPer / coffeeWeight
      if (ratio >= settings.bloomRatioMin && ratio <= settings.bloomRatioMax) {
        return {
          coffeeWeight,
          totalWater,
          brewWater,
          iceWeight,
          bloomCount: blooms,
          waterPerBloom: waterPer,
          bloomTimes: Array(blooms).fill(settings.bloomTimeMin) as number[],
          reasoning: `${blooms} blooms for a ${ratio.toFixed(1)}x water-to-coffee ratio.`,
        }
      }
    }
    const waterPer = Math.round(brewWater / 2)
    return {
      coffeeWeight,
      totalWater,
      brewWater,
      iceWeight,
      bloomCount: 2,
      waterPerBloom: waterPer,
      bloomTimes: [settings.bloomTimeMin, settings.bloomTimeMin],
      reasoning: 'Standard 2-bloom starting point.',
    }
  }, [coffeeWeight, settings, useCustomBloom, customBloomConfig])

  useEffect(() => {
    if (!isTimerRunning) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          setIsTimerRunning(false)
          if (currentStep === 'brewing') {
            if (currentBloom < brewConfig.bloomCount - 1) {
              const next = currentBloom + 1
              setCurrentBloom(next)
              setTimeLeft(brewConfig.bloomTimes[next] ?? 45)
              setIsTimerRunning(true)
            } else {
              setCurrentStep('finishing')
            }
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isTimerRunning, currentStep, currentBloom, brewConfig])

  const handleStartBrewing = () => {
    setCurrentStep('brewing')
    setCurrentBloom(0)
    setTimeLeft(brewConfig.bloomTimes[0] ?? 45)
  }

  const handleReset = () => {
    setCurrentStep('setup')
    setIsTimerRunning(false)
    setTimeLeft(0)
    setCurrentBloom(0)
    setChecked({ grinder: false, kettle: false, scale: false, filter: false, v60: false, server: false })
  }

  const handleCompleteBrew = () => {
    setPersonalBrews((prev) => prev + 1)
    setCurrentStep('complete')
  }

  const isChecklistComplete = Object.values(checked).every(Boolean)
  const bloomDuration = brewConfig.bloomTimes[currentBloom] ?? 45

  const setupPhase = (
    <div className="space-y-6">
      <Card>
        <h2 className="font-serif text-xl font-bold text-brand-espresso mb-4">
          1. Choose Your Amount
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => setUseCustomWeight(false)}
            className={`py-3 rounded-lg font-medium transition-colors ${!useCustomWeight ? 'bg-brand-brown text-brand-cream' : 'bg-brand-tan/20 text-brand-brown'}`}
          >
            By People
          </button>
          <button
            onClick={() => setUseCustomWeight(true)}
            className={`py-3 rounded-lg font-medium transition-colors ${useCustomWeight ? 'bg-brand-brown text-brand-cream' : 'bg-brand-tan/20 text-brand-brown'}`}
          >
            By Weight
          </button>
        </div>
        {!useCustomWeight ? (
          <div>
            <label className="block text-sm font-medium text-brand-brown/80 mb-2">
              How many servings?
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="6"
                value={people}
                onChange={(e) => setPeople(Number(e.target.value))}
                className="w-full h-2 bg-brand-brown/20 rounded-lg appearance-none cursor-pointer accent-brand-brown"
              />
              <span className="font-bold text-lg text-brand-espresso w-8 text-center">
                {people}
              </span>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-brand-brown/80 mb-2">
              Coffee (grams)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="10"
                max="120"
                value={customCoffeeWeight}
                onChange={(e) => setCustomCoffeeWeight(Number(e.target.value))}
                className="w-full h-2 bg-brand-brown/20 rounded-lg appearance-none cursor-pointer accent-brand-brown"
              />
              <input
                type="number"
                value={customCoffeeWeight}
                onChange={(e) => setCustomCoffeeWeight(Number(e.target.value))}
                className="w-20 text-center font-bold text-brand-espresso bg-brand-tan/20 rounded-lg p-1 border border-transparent focus:border-brand-brown focus:outline-none"
              />
            </div>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="font-serif text-xl font-bold text-brand-espresso mb-4">2. Your Recipe</h2>
        <div className="space-y-3 text-brand-brown">
          <div className="flex justify-between">
            <span>Coffee:</span>
            <span className="font-bold text-xl text-brand-espresso">{brewConfig.coffeeWeight}g</span>
          </div>
          <div className="flex justify-between">
            <span>Brew Water (hot):</span>
            <span className="font-bold text-xl text-brand-espresso">{brewConfig.brewWater}g</span>
          </div>
          <div className="flex justify-between">
            <span>Ice in Server:</span>
            <span className="font-bold text-xl text-brand-espresso">{brewConfig.iceWeight}g</span>
          </div>
          <hr className="border-brand-tan/30" />
          <div className="flex justify-between">
            <span>Bloom Plan:</span>
            <span className="font-bold text-brand-espresso">
              {brewConfig.bloomCount} × {brewConfig.waterPerBloom}g
            </span>
          </div>
        </div>
        <p className="text-xs text-brand-brown/60 mt-3 p-2 bg-brand-tan/10 rounded-lg">
          {brewConfig.reasoning}
        </p>
      </Card>

      <Card>
        <h2 className="font-serif text-xl font-bold text-brand-espresso mb-4">3. Get Ready</h2>
        <div className="space-y-2">
          {checklist.map((key) => (
            <button
              type="button"
              key={key}
              onClick={() => setChecked((c) => ({ ...c, [key]: !c[key] }))}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${checked[key] ? 'bg-brand-amber/20 text-brand-brown/60' : 'bg-brand-tan/10'}`}
            >
              <div
                className={`w-5 h-5 rounded-md border-2 mr-3 flex-shrink-0 flex items-center justify-center transition-colors ${checked[key] ? 'bg-brand-amber border-brand-amber' : 'border-brand-brown/30'}`}
              >
                {checked[key] && (
                  <svg
                    className="text-white"
                    width="12"
                    height="12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-brand-brown ${checked[key] ? 'line-through' : ''}`}>
                {key === 'server'
                  ? `Add ${brewConfig.iceWeight}g of ice to server`
                  : key === 'grinder'
                    ? `Grind ${brewConfig.coffeeWeight}g of coffee`
                    : checklistLabels[key]}
              </span>
            </button>
          ))}
        </div>
      </Card>

      <Button size="lg" disabled={!isChecklistComplete} onClick={handleStartBrewing}>
        {isChecklistComplete ? "Let's Start Brewing" : 'Complete Your Checklist'}
      </Button>
    </div>
  )

  const brewingPhase = (
    <Card className="text-center">
      <h2 className="font-serif text-2xl font-bold text-brand-espresso mb-2">
        Pour <span className="text-brand-amber">{currentBloom + 1}</span> of{' '}
        {brewConfig.bloomCount}
      </h2>
      {currentBloom === 0 && !isTimerRunning && timeLeft === 0 ? (
        <div className="my-8 space-y-4">
          <p className="text-brand-brown/80 text-lg">Ready for your first pour?</p>
          <Button onClick={() => setIsTimerRunning(true)}>Start Bloom</Button>
        </div>
      ) : (
        <div className="my-6 flex justify-center">
          <CircularTimer
            seconds={timeLeft}
            totalSeconds={bloomDuration}
            size={180}
            label="seconds"
          />
        </div>
      )}
      <div className="bg-brand-tan/10 p-4 rounded-lg space-y-2">
        <p className="text-lg font-semibold text-brand-brown">
          Pour <span className="font-bold">{brewConfig.waterPerBloom}g</span> of water.
        </p>
        <p className="text-brand-brown/70 text-sm">
          Pour evenly in a circular motion, from the center outwards.
        </p>
      </div>
      <button
        onClick={handleReset}
        className="mt-6 text-brand-brown/50 hover:text-brand-brown transition-colors text-sm"
      >
        Cancel and Start Over
      </button>
    </Card>
  )

  const finishingPhase = (
    <Card className="text-center">
      <h2 className="font-serif text-2xl font-bold text-brand-espresso mb-4">Brewing Complete!</h2>
      <p className="text-brand-brown/80 mb-6">Let the coffee finish dripping.</p>
      <div className="bg-brand-tan/10 p-4 rounded-lg mb-6">
        <p className="font-semibold text-brand-brown">Final Step</p>
        <p className="text-brand-brown/80 mt-1">Gently swirl the server.</p>
      </div>
      <Button size="lg" onClick={handleCompleteBrew}>
        Finish &amp; Enjoy
      </Button>
    </Card>
  )

  const completePhase = (
    <Card className="text-center">
      <div className="w-20 h-20 mx-auto bg-brand-amber/20 rounded-full flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-brand-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="font-serif text-2xl font-bold text-brand-espresso mb-2">Enjoy!</h2>
      <p className="text-brand-brown/60 text-sm mb-6">Brew #{personalBrews} in the books.</p>
      <Button onClick={handleReset}>Brew Another</Button>
    </Card>
  )

  const contentMap: Record<BrewStep, React.ReactNode> = {
    setup: setupPhase,
    brewing: brewingPhase,
    finishing: finishingPhase,
    complete: completePhase,
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-bold text-brand-espresso">Iced V60 Pour-Over</h2>
        <p className="text-brand-brown/70 mt-1">
          A bright, clean iced coffee brewed hot directly over ice to lock in delicate flavours.
        </p>
      </div>

      {currentStep === 'setup' && (
        <details className="bg-brand-tan/10 rounded-2xl">
          <summary className="px-6 py-4 font-medium text-brand-brown cursor-pointer">
            Settings &amp; Custom Bloom
          </summary>
          <div className="px-6 pb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-brown/80 mb-1">
                Grams per person ({settings.gramsPerPerson}g)
              </label>
              <input
                type="range"
                min="15"
                max="25"
                value={settings.gramsPerPerson}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, gramsPerPerson: Number(e.target.value) }))
                }
                className="w-full h-2 bg-brand-brown/20 rounded-lg appearance-none cursor-pointer accent-brand-brown"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-brown/80 mb-1">
                Coffee ratio g/L ({settings.coffeeRatio})
              </label>
              <input
                type="range"
                min="50"
                max="80"
                value={settings.coffeeRatio}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, coffeeRatio: Number(e.target.value) }))
                }
                className="w-full h-2 bg-brand-brown/20 rounded-lg appearance-none cursor-pointer accent-brand-brown"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-brand-brown/80">Custom Bloom Plan</span>
              <Toggle checked={useCustomBloom} onChange={setUseCustomBloom} />
            </div>
            {useCustomBloom && (
              <div className="space-y-3 pt-2 border-t border-brand-tan/40">
                <div>
                  <label className="block text-sm font-medium text-brand-brown/80 mb-1">
                    Number of Pours ({customBloomConfig.count})
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="5"
                    value={customBloomConfig.count}
                    onChange={(e) => {
                      const n = Number(e.target.value)
                      setCustomBloomConfig((c) => ({
                        count: n,
                        durations: Array.from({ length: n }, (_, i) => c.durations[i] ?? 45),
                      }))
                    }}
                    className="w-full h-2 bg-brand-brown/20 rounded-lg appearance-none cursor-pointer accent-brand-brown"
                  />
                </div>
                {customBloomConfig.durations.map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm text-brand-brown w-16">Pour {i + 1}:</span>
                    <input
                      type="number"
                      value={d}
                      onChange={(e) =>
                        setCustomBloomConfig((c) => ({
                          ...c,
                          durations: c.durations.map((v, j) => (j === i ? Number(e.target.value) : v)),
                        }))
                      }
                      className="w-full text-center font-semibold text-brand-espresso bg-brand-tan/20 rounded-lg p-2 border border-transparent focus:border-brand-brown focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </details>
      )}

      {contentMap[currentStep]}
    </div>
  )
}
