'use client'

const RING_NORMAL = '#5C3A1E'   // brand-brown
const RING_WARNING = '#D47C2A'  // brand-amber
const RING_URGENT = '#DC2626'   // red

const GLOW_NORMAL = 'rgba(92,58,30,0.35)'
const GLOW_WARNING = 'rgba(212,124,42,0.45)'
const GLOW_URGENT = 'rgba(220,38,38,0.55)'

interface CircularTimerProps {
  seconds: number
  totalSeconds: number
  size?: number
  label?: string
  isRunning?: boolean
}

function formatTime(s: number): string {
  if (s < 60) return `${s}`
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export function CircularTimer({
  seconds,
  totalSeconds,
  size = 88,
  label,
  isRunning = false,
}: CircularTimerProps) {
  const radius = size / 2 - 8
  const circumference = 2 * Math.PI * radius
  const ratio = totalSeconds > 0 ? seconds / totalSeconds : 0
  const dashOffset = circumference * (1 - ratio)

  const isUrgent = ratio <= 0.25 && isRunning
  const isWarning = ratio > 0.25 && ratio <= 0.5 && isRunning
  const ringColor = isUrgent ? RING_URGENT : isWarning ? RING_WARNING : RING_NORMAL
  const glowColor = isUrgent ? GLOW_URGENT : isWarning ? GLOW_WARNING : GLOW_NORMAL

  const fontSize = size >= 160 ? 'text-4xl' : size >= 100 ? 'text-2xl' : 'text-xl'
  const textColor = isUrgent ? '#DC2626' : '#1a0a00'

  const animClass = isRunning
    ? isUrgent
      ? 'timer-urgent'
      : 'timer-running'
    : ''

  return (
    <div
      className={`relative inline-flex items-center justify-center ${animClass}`}
      style={{ width: size, height: size }}
    >
      {/* SVG rings */}
      <svg
        width={size}
        height={size}
        style={{ position: 'absolute', transform: 'rotate(-90deg)' }}
        aria-hidden="true"
      >
        {/* Track ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#C4A882"
          strokeWidth="6"
          opacity="0.25"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: 'stroke-dashoffset 1s linear, stroke 0.6s ease',
            filter: isRunning ? `drop-shadow(0 0 5px ${glowColor})` : 'none',
          }}
        />
      </svg>

      {/* Text overlay */}
      <div
        className="relative z-10 flex flex-col items-center justify-center"
        aria-live="polite"
        aria-label={`${seconds} seconds remaining`}
      >
        <span
          className={`font-serif font-bold leading-none ${fontSize}`}
          style={{ color: textColor, transition: 'color 0.6s ease' }}
        >
          {formatTime(seconds)}
        </span>
        {label && (
          <span className="text-xs text-brand-tan uppercase tracking-widest mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
