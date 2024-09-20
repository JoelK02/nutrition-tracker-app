import React from 'react'

interface CircularProgressBarProps {
  value: number
  max: number
}

export default function CircularProgressBar({ value, max }: CircularProgressBarProps) {
  const percentage = (value / max) * 100
  const strokeWidth = 10
  const radius = 70
  const circumference = 2 * Math.PI * radius

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full" viewBox="0 0 180 180">
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="90"
          cy="90"
        />
        <circle
          className="text-green-500"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (percentage / 100) * circumference}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="90"
          cy="90"
          style={{
            transition: 'stroke-dashoffset 0.5s ease 0s',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-sm text-gray-500">/ {max} kcal</div>
      </div>
    </div>
  )
}
