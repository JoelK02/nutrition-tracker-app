"use client"

import React, { useState } from 'react'
import { Menu, PieChart, Settings, BookOpen, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import NavItem from '../../components/NavItem'
import CircularProgressBar from '../../components/CircularProgressBar'
import NutrientBar from '../../components/NutrientBar'
import NutrientCard from '../../components/NutrientCard'

const generateWeekData = (startDate: Date) => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    return {
      day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      calories: Math.floor(Math.random() * (2200 - 1800 + 1) + 1800)
    }
  })
}

const foodEntries = [
  { id: 1, type: 'Breakfast', time: '08:00', calories: 350 },
  { id: 2, type: 'Lunch', time: '12:30', calories: 550 },
  { id: 3, type: 'Snack', time: '15:00', calories: 200 },
  { id: 4, type: 'Dinner', time: '19:00', calories: 650 },
]

export default function NutritionTracker() {
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date('2023-09-14'))
  const [weeklyData, setWeeklyData] = useState(generateWeekData(currentWeekStart))
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const changeWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    setCurrentWeekStart(newDate)
    setWeeklyData(generateWeekData(newDate))
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Navigation Menu - Desktop */}
      <nav className="hidden md:flex flex-col justify-between w-20 bg-white p-4">
        <div className="space-y-8">
          <NavItem icon={<PieChart size={24} />} label="Home" active />
          <NavItem icon={<BookOpen size={24} />} label="Recipes" />
          <NavItem icon={<Settings size={24} />} label="Settings" />
        </div>
      </nav>

      {/* Mobile Navigation */}
      <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-10">
            <Menu size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col gap-4">
            <NavItem icon={<PieChart size={24} />} label="Home" active />
            <NavItem icon={<BookOpen size={24} />} label="Recipes" />
            <NavItem icon={<Settings size={24} />} label="Settings" />
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Mobile Header */}
        <header className="md:hidden flex justify-center items-center mb-6">
          <h1 className="text-2xl font-semibold">Nutrition Tracker</h1>
        </header>

        {/* Today's Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4">Today's Summary</h2>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <CircularProgressBar value={1750} max={2000} />
            </div>
            <div className="w-full md:w-1/2">
              <NutrientBar label="Protein" value={80} max={100} color="bg-blue-400" />
              <NutrientBar label="Carbs" value={200} max={250} color="bg-yellow-400" />
              <NutrientBar label="Fat" value={60} max={80} color="bg-red-400" />
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">This Week</h2>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => changeWeek('prev')}>
                <ChevronLeft size={24} />
              </Button>
              <span className="text-sm font-medium">
                {currentWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                {new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <Button variant="ghost" size="icon" onClick={() => changeWeek('next')}>
                <ChevronRight size={24} />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <NutrientCard label="Avg. protein" value={60} icon="🍗" color="bg-blue-100" />
            <NutrientCard label="Avg. carbs" value={200} icon="🍞" color="bg-yellow-100" />
            <NutrientCard label="Avg. fat" value={50} icon="🥑" color="bg-green-100" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis hide />
                <Bar dataKey="calories" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-sm text-gray-500 mt-2">Calories Chart</div>
        </div>

        {/* Food Entries */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Today's Food Entries</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Calories</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {foodEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.type}</TableCell>
                  <TableCell>{entry.time}</TableCell>
                  <TableCell>{entry.calories}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Add Food Button */}
      <Button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg"
        style={{ backgroundColor: '#10B981' }}
      >
        <Plus size={24} color="white" />
      </Button>
    </div>
  )
}
