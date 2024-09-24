"use client"

import React, { useState, useEffect } from 'react'
import { Menu, PieChart, Settings, BookOpen, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { supabase } from '@/lib/supabaseClient' // Import Supabase client
import ProtectedLayout from '@/layouts/ProtectedLayout'

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
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
import AnalyticsSection from '../../components/Analytics';
import AddFood from '../../components/AddFood';



const foodEntriesDefault = [
  { id: 1, calories: 350, protein: 20, carbs: 40, fat: 15, created_at: '2023-09-14T12:00:00Z' },
  { id: 2, calories: 550, protein: 25, carbs: 60, fat: 20, created_at: '2023-09-14T12:00:00Z' },
  { id: 3, calories: 200, protein: 10, carbs: 30, fat: 10, created_at: '2023-09-14T12:00:00Z' },
  { id: 4, calories: 650, protein: 30, carbs: 70, fat: 25, created_at: '2023-09-14T12:00:00Z' },
]

export default function NutritionTracker() {
  const [foodEntries, setFoodEntries] = useState(foodEntriesDefault)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)


  // Filter entries for today
  const today = new Date().toLocaleDateString('en-GB') // Use current date in 'DD/MM/YYYY' format
  const todayEntries = foodEntries.filter(entry => {
    const entryDate = new Date(entry.created_at).toLocaleDateString('en-GB')
    return entryDate === today
  })

  // Calculate total nutrients for today
  const totalCalories = todayEntries.reduce((sum, entry) => sum + entry.calories, 0)
  const totalProtein = todayEntries.reduce((sum, entry) => sum + entry.protein, 0)
  const totalCarbs = todayEntries.reduce((sum, entry) => sum + entry.carbs, 0)
  const totalFat = todayEntries.reduce((sum, entry) => sum + entry.fat, 0)

  // Daily recommended nutrient targets (you can modify these as needed)
  const maxCalories = 2000
  const maxProtein = 100
  const maxCarbs = 250
  const maxFat = 80

   // Function to fetch food entries from Supabase
   const fetchFoodEntries = async () => {
    const { data, error } = await supabase
      .from('food_entries')
      .select('*')  // Fetch all columns

    if (error) {
      console.error('Error fetching food entries:', error.message)
    } else {
      setFoodEntries(data)
      console.log(data)  // Update state with fetched data
    }
  }

  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchFoodEntries()
  }, [])  // Empty dependency array means this runs once on component mount

  


  return (
    <ProtectedLayout>
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
            <h2 className="text-lg font-semibold mb-4">Today&apos;s Summary</h2>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                {/* Update CircularProgressBar to reflect today's total calories */}
                <CircularProgressBar value={totalCalories} max={maxCalories} />
              </div>
              <div className="w-full md:w-1/2">
                {/* Update NutrientBars to reflect today's total nutrients */}
                <NutrientBar label="Protein" value={totalProtein} max={maxProtein} color="bg-blue-400" />
                <NutrientBar label="Carbs" value={totalCarbs} max={maxCarbs} color="bg-yellow-400" />
                <NutrientBar label="Fat" value={totalFat} max={maxFat} color="bg-red-400" />
              </div>
            </div>
          </div>

          {/* Analytics */}
          <AnalyticsSection />

          {/* Food Entries */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Today&apos;s Food Entries</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Calories</TableHead>
                  <TableHead>Protein</TableHead>
                  <TableHead>Carbs</TableHead>
                  <TableHead>Fat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.calories}</TableCell>
                    <TableCell>{entry.protein}</TableCell>
                    <TableCell>{entry.carbs}</TableCell>
                    <TableCell>{entry.fat}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
        
        {/* Use the new AddFood component */}
        <AddFood foodEntries={foodEntries} setFoodEntries={setFoodEntries} />
      </div>
    </ProtectedLayout>
  )
}
