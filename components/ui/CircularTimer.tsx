interface CircularTimerProps {
  seconds: number
  totalSeconds: number
  size?: number
  label?: string
}

export function CircularTimer({
  seconds,
  totalSeconds,
  size = 200,
  label,
}: CircularTimerProps) {
  const radius = size / 2 - 16
  const circumference = 2 * Math.PI * radius
  const progress = totalSeconds > 0 ? seconds / totalSeconds : 0
  const dashOffset = circumference * (1 - progress)

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* SVG rings */}
      <svg
        width={size}
        height={size}
        style={{ position: 'absolute', transform: 'rotate(-90deg)' }}
        aria-hidden="true"
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#C4A882"
          strokeWidth="8"
          opacity="0.3"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#5C3A1E"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>

      {/* Text overlay */}
      <div className="relative flex flex-col items-center justify-center z-10">
        <span className="font-serif text-4xl font-bold text-brand-espresso leading-none">
          {seconds}
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
