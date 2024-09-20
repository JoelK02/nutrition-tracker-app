import React from 'react'

interface NutrientCardProps {
  label: string
  value: number
  icon: string
  color: string
}

export default function NutrientCard({ label, value, icon, color }: NutrientCardProps) {
  return (
    <div className={`${color} p-3 rounded-lg`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  )
}
