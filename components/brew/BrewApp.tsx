'use client'
import { useState } from 'react'
import { HotV60 } from '@/components/brew/methods/HotV60'
import { IcedV60 } from '@/components/brew/methods/IcedV60'
import { AeroPress } from '@/components/brew/methods/AeroPress'
import { FrenchPress } from '@/components/brew/methods/FrenchPress'
import { MokaPot } from '@/components/brew/methods/MokaPot'
import { ColdBrew } from '@/components/brew/methods/ColdBrew'

type MethodId = 'hot-v60' | 'iced-v60' | 'aeropress' | 'french-press' | 'moka-pot' | 'cold-brew'

interface Method {
  id: MethodId
  label: string
  emoji: string
}

const METHODS: Method[] = [
  { id: 'hot-v60', label: 'Hot V60', emoji: '🫗' },
  { id: 'iced-v60', label: 'Iced V60', emoji: '🧊' },
  { id: 'aeropress', label: 'AeroPress', emoji: '🔩' },
  { id: 'french-press', label: 'French Press', emoji: '⬛' },
  { id: 'moka-pot', label: 'Moka Pot', emoji: '🫙' },
  { id: 'cold-brew', label: 'Cold Brew', emoji: '🫙' },
]

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = window.localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : fallback
  } catch {
    return fallback
  }
}

export function BrewApp() {
  const [active, setActive] = useState<MethodId>(() =>
    getStored<MethodId>('cba_activeMethod', 'hot-v60'),
  )

  function handleSelect(id: MethodId) {
    setActive(id)
    localStorage.setItem('cba_activeMethod', JSON.stringify(id))
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Method tabs — horizontal scroll on small screens */}
      <div className="mb-8 -mx-4 px-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => handleSelect(m.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                active === m.id
                  ? 'bg-brand-brown text-brand-cream'
                  : 'bg-brand-tan/20 text-brand-brown hover:bg-brand-tan/40'
              }`}
            >
              <span className="text-lg">{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active method */}
      {active === 'hot-v60' && <HotV60 />}
      {active === 'iced-v60' && <IcedV60 />}
      {active === 'aeropress' && <AeroPress />}
      {active === 'french-press' && <FrenchPress />}
      {active === 'moka-pot' && <MokaPot />}
      {active === 'cold-brew' && <ColdBrew />}
    </div>
  )
}
