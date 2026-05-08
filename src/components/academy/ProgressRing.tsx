'use client'

interface ProgressRingProps {
  percent: number
  size?: number
  strokeWidth?: number
  className?: string
}

export default function ProgressRing({ percent, size = 40, strokeWidth = 3, className = '' }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference
  const color = percent >= 100 ? '#10B981' : percent > 0 ? '#2563EB' : '#CBD5E1'

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-gray-600">
        {percent > 0 ? `${Math.round(percent)}%` : ''}
      </span>
    </div>
  )
}
