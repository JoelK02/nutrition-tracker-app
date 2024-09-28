'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"

export function SettingsComponent() {
  const [dailyIntakes, setDailyIntakes] = useState({
    calories: 3041,
    protein: 129,
    carbs: 440,
    fat: 84
  })

  const handleIntakeChange = (type: keyof typeof dailyIntakes, value: number[]) => {
    setDailyIntakes(prev => ({ ...prev, [type]: value[0] }))
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <X className="h-6 w-6" />
        </Button>
      </header>

      <main className="flex-1 space-y-6">
        {/* User Details */}
        <Card className="shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">John Doe</h2>
                <p className="text-gray-500">john.doe@example.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Intakes */}
        <Card className="shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">My daily intakes</h2>
            <div className="space-y-6">
              {Object.entries(dailyIntakes).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">
                      {key === 'calories' && '🔥'}
                      {key === 'protein' && '🍗'}
                      {key === 'carbs' && '🍞'}
                      {key === 'fat' && '🥑'}
                      {' '}{key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                    <span className="font-semibold">{value}{key !== 'calories' && 'g'}</span>
                  </div>
                  <Slider
                    value={[value]}
                    max={key === 'calories' ? 5000 : key === 'carbs' ? 700 : key === 'protein' ? 300 : 200}
                    step={1}
                    onValueChange={(newValue) => handleIntakeChange(key as keyof typeof dailyIntakes, newValue)}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calculate Macros Button */}
        <Button className="w-full bg-black text-white py-6 text-lg rounded-xl shadow-lg">
          Calculate my macros with AI
        </Button>
      </main>
    </div>
  )
}