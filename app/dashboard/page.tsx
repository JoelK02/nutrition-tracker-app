"use client"

import React, { useState, useEffect } from 'react'
import { Menu, PieChart, Settings, BookOpen, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { supabase } from '@/lib/supabaseClient' // Import Supabase client
import ProtectedLayout from '@/layouts/ProtectedLayout'
import Image from 'next/image';
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
import { FoodEntry } from '../components/AddFood'; // Import the FoodEntry interface

import NavItem from '../components/NavItem'
import CircularProgressBar from '../components/CircularProgressBar'
import NutrientBar from '../components/NutrientBar'
import AnalyticsSection from '../components/Analytics';
import AddFood from '../components/AddFood';
import SettingsComponent from '../components/Settings';
import { useUser } from '@supabase/auth-helpers-react';
import DateSelector from '../components/DateSelector';

const foodEntriesDefault = [
  { id: 1, calories: 350, protein: 20, carbs: 40, fat: 15, created_at: '2023-09-14T12:00:00Z', food_image: 'food-images/1.jpg', food_description: 'Chicken Parmesan' },
  { id: 2, calories: 550, protein: 25, carbs: 60, fat: 20, created_at: '2023-09-14T12:00:00Z', food_image: 'food-images/2.jpg', food_description: 'Spaghetti Carbonara' },
  { id: 3, calories: 200, protein: 10, carbs: 30, fat: 10, created_at: '2023-09-14T12:00:00Z', food_image: 'food-images/3.jpg', food_description: 'Grilled Salmon with Asparagus' },
  { id: 4, calories: 650, protein: 30, carbs: 70, fat: 25, created_at: '2023-09-14T12:00:00Z', food_image: 'food-images/4.jpg', food_description: 'Vegetable Stir-Fry' },
]

function getImageUrl(path: string | null) {
  if (!path) return null;
  const { data } = supabase.storage.from('food-images').getPublicUrl(path);
  return data.publicUrl;
}

export default function NutritionTracker() {
  const user = useUser();

  const [dailyIntakes, setDailyIntakes] = useState({
    calories: 2000,
    protein: 50,
    carbs: 250,
    fat: 70
  });

  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>(foodEntriesDefault)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FoodEntry | null>(null);

  // Filter entries for today


  // Calculate total nutrients for today
  const totalCalories = Math.round(foodEntries.reduce((sum, entry) => sum + entry.calories, 0))
  const totalProtein = Math.round(foodEntries.reduce((sum, entry) => sum + entry.protein, 0))
  const totalCarbs = Math.round(foodEntries.reduce((sum, entry) => sum + entry.carbs, 0))
  const totalFat = Math.round(foodEntries.reduce((sum, entry) => sum + entry.fat, 0))

  const [selectedDate, setSelectedDate] = useState(new Date())


  useEffect(() => {
    if (user) {
      fetchDailyIntakes();
      fetchFoodEntries()
    }
}, [user, selectedDate]);



  const fetchDailyIntakes = async () => {
    if (!user) {
      return;
    }

  const { data, error } = await supabase
    .from('user_settings')
    .select('daily_intakes')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching daily intakes:', error);
  } else {
    if (data && data.length > 0) {
      setDailyIntakes(data[0].daily_intakes);
    } else {
      console.log('No settings found for user. Using default values.');
      // Optionally, you could set default values here;
    }
  }
};

  // Function to fetch food entries from Supabase
  const fetchFoodEntries = async () => {
    if (!user) {
      console.log('No user, skipping fetch');
      return;
    }
    const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(selectedDate)
    endOfDay.setHours(23, 59, 59, 999)
  
    console.log('Fetching entries for date:', selectedDate);
    console.log('Start of day:', startOfDay.toISOString());
    console.log('End of day:', endOfDay.toISOString());
  
    const { data, error } = await supabase
      .from('food_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startOfDay.toISOString())
      .lte('created_at', endOfDay.toISOString());
  
    if (error) {
      console.error('Error fetching food entries:', error.message)
    } else {
      console.log('Fetched entries:', data);
      setFoodEntries(data)
    }
  }

  
  const handleEditEntry = (entry: FoodEntry) => {
    setEditingEntry(entry);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  return (
    <ProtectedLayout>
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
          <div className="flex items-center justify-between px-4 h-16 pt-safe">
            <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
              <h1 className="text-2xl font-bold">NutriTrack</h1>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4">
                  <NavItem icon={<PieChart size={24} />} label="Home" active />
                  <NavItem icon={<BookOpen size={24} />} label="Recipes" />
                  <NavItem icon={<Settings size={24} />} label="Settings" />
                </nav>
              </SheetContent>
            </Sheet>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings size={24} />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 pt-safe mt-20 pb-4 overflow-y-auto">

          <div className="mb-4 mt-1"> {/* Added margin-bottom for spacing */}
            <DateSelector selectedDate={selectedDate} onDateSelect={handleDateSelect} />
          </div>

          {/* Today's Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8 mt-4">
            <h2 className="text-lg font-semibold mb-4">Today&apos;s Summary</h2>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                {/* Update CircularProgressBar to reflect today's total calories */}
                <CircularProgressBar value={totalCalories} max={dailyIntakes.calories} />
              </div>
              <div className="w-full md:w-1/2 space-y-4">
              <div className="w-full md:w-1/2 space-y-4">

                  <NutrientBar 
                    label="Protein" 
                    value={totalProtein} 
                    max={dailyIntakes.protein} 
                    color="bg-red-400" 
                    icon="🍗"
                  />
                  <NutrientBar 
                    label="Fat" 
                    value={totalFat} 
                    max={dailyIntakes.fat} 
                    color="bg-blue-400" 
                    icon="🥑"
                  />
                  <NutrientBar 
                    label="Carbs" 
                    value={totalCarbs} 
                    max={dailyIntakes.carbs} 
                    color="bg-yellow-400" 
                    icon="🍞"
                  />
                  
                </div>
              </div>
            </div>
          </div>

          {/* Food Entries */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Recently Consumed</h2>
            {foodEntries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-lg p-4 shadow-sm cursor-pointer" onClick={() => handleEditEntry(entry)}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {entry.food_image && (
                      <Image
                        src={getImageUrl(entry.food_image) || '/placeholder-image.jpg'}
                        alt={entry.food_description || 'Food image'}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                        loader={({ src }) => src}
                        unoptimized
                      />
                    )}
                    <div>
                      <h3 className="font-medium truncate max-w-[200px]" title={entry.food_description || 'Unnamed Food'}>
                        {entry.food_description || 'Unnamed Food'}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <button className="text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div>
                    <p className="font-medium">Calories</p>
                    <p>{entry.calories}</p>
                  </div>
                  <div>
                    <p className="font-medium">Protein</p>
                    <p>{entry.protein}g</p>
                  </div>
                  <div>
                    <p className="font-medium">Carbs</p>
                    <p>{entry.carbs}g</p>
                  </div>
                  <div>
                    <p className="font-medium">Fat</p>
                    <p>{entry.fat}g</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
        
        {/* Use the new AddFood component */}
        <AddFood 
          foodEntries={foodEntries} 
          setFoodEntries={setFoodEntries} 
          editingEntry={editingEntry}
          setEditingEntry={setEditingEntry}
        />
      </div>

      {/* Settings Component */}
      <SettingsComponent isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </ProtectedLayout>
  )
}