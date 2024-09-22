import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import NutrientCard from '../components/NutrientCard';
import { supabase } from '@/lib/supabaseClient';

export default function AnalyticsSection() {
  const [foodEntries, setFoodEntries] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [weeklyData, setWeeklyData] = useState([]);
  const [firstEntryDate, setFirstEntryDate] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchFoodEntries = async () => {
      const { data, error } = await supabase.from('food_entries').select('*');
      if (error) {
        console.error('Error fetching food entries:', error.message);
      } else {
        setFoodEntries(data);
        const firstDate = new Date(data[0].created_at);
        setFirstEntryDate(firstDate);
        setCurrentWeekStart(firstDate); // Set the first week start date to the date of the first entry
        updateWeeklyData(firstDate, data); // Update weekly data
      }
    };
    fetchFoodEntries();
  }, []);

  // Update weekly data for the chart and average calculations
  const updateWeeklyData = (startDate, allEntries) => {
    const weekEntries = allEntries.filter(entry => {
      const entryDate = new Date(entry.created_at);
      return entryDate >= startDate && entryDate < new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    });

    // Calculate averages
    const totalCalories = weekEntries.reduce((sum, entry) => sum + entry.calories, 0);
    const totalProtein = weekEntries.reduce((sum, entry) => sum + entry.protein, 0);
    const totalCarbs = weekEntries.reduce((sum, entry) => sum + entry.carbs, 0);
    const totalFat = weekEntries.reduce((sum, entry) => sum + entry.fat, 0);

    const avgProtein = weekEntries.length ? Math.floor(totalProtein / weekEntries.length) : 0;
  const avgCarbs = weekEntries.length ? Math.floor(totalCarbs / weekEntries.length) : 0;
  const avgFat = weekEntries.length ? Math.floor(totalFat / weekEntries.length) : 0;

    // Update weekly chart data for calories
    const chartData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dayEntries = weekEntries.filter(entry => {
        const entryDate = new Date(entry.created_at);
        return entryDate.toDateString() === date.toDateString();
      });
      const dayCalories = dayEntries.reduce((sum, entry) => sum + entry.calories, 0);
      return {
        day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        calories: dayCalories,
      };
    });

    setWeeklyData({
      chartData,
      avgProtein,
      avgCarbs,
      avgFat,
    });
  };

  // Handle week navigation
  const changeWeek = (direction) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
    updateWeeklyData(newDate, foodEntries); // Recalculate the weekly data for the new week
  };

  return (
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
        <NutrientCard label="Avg. protein" value={weeklyData.avgProtein || 0} icon="🍗" color="bg-blue-100" />
        <NutrientCard label="Avg. carbs" value={weeklyData.avgCarbs || 0} icon="🍞" color="bg-yellow-100" />
        <NutrientCard label="Avg. fat" value={weeklyData.avgFat || 0} icon="🥑" color="bg-green-100" />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData.chartData || []}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} />
            <YAxis hide />
            <Bar dataKey="calories" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center text-sm text-gray-500 mt-2">Calories Chart</div>
    </div>
  );
}
