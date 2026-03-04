import type { Metadata } from 'next'
import { BrewApp } from '@/components/brew/BrewApp'

export const metadata: Metadata = {
  title: 'Brew | Coffee Brewing Assistant',
  description:
    'Step-by-step brewing guides for V60, Iced V60, AeroPress, French Press, Moka Pot, and Cold Brew.',
}

export default function AppPage() {
  return <BrewApp />
}
