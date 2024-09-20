import React from 'react'

interface NavItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
}

export default function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <div className={`flex flex-col items-center cursor-pointer ${active ? 'text-green-500' : 'text-gray-400'}`}>
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </div>
  )
}
