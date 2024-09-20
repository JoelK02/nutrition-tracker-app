import React from 'react'
import { Progress } from "@/components/ui/progress"

interface NutrientBarProps {
  label: string
  value: number
  max: number
  color: string
}

export default function NutrientBar({ label, value, max, color }: NutrientBarProps) {
  const percentage = (value / max) * 100
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value}g / {max}g</span>
      </div>
      <Progress value={percentage} className="h-2" indicatorClassName={color} />
    </div>
  )
}
