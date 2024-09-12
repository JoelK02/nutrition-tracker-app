"use client"

import dynamic from 'next/dynamic'
import { FaSearch, FaCog, FaBell } from 'react-icons/fa'

const NutrientDonut = dynamic(() => import('./components/NutrientDonut'), { ssr: false })
const WeightChart = dynamic(() => import('./components/WeightChart'), { ssr: false })
import NutrientSummary from './components/NutrientComponent2';

export default function Home() {
  const userName = "John"; // Replace with actual user name logic

  return (
    <div className="bg-white min-h-screen">
      <div className="p-4 flex justify-between items-center border-b">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {userName}</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for something"
              className="pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <FaCog />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <FaBell />
          </button>
          <img src="/avatar.jpg" alt="User Avatar" className="w-10 h-10 rounded-full" />
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6 ml-10 mr-10"> 
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Nutrient Summary</h2> 
          <div className="flex justify-center">
            <NutrientSummary />
          </div>
        </div>

          <div className="bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold p-4 text-gray-800 border-b">Weight Progress</h2>
            <div className="p-4 ">
              <WeightChart />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold p-4 text-gray-800 border-b">Recently Consumed</h2>
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-600 text-sm">
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Meal ID</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Calories</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {recentMeals.map((meal, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-3 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                        {meal.icon}
                      </div>
                      {meal.description}
                    </td>
                    <td className="py-3">{meal.id}</td>
                    <td className="py-3">{meal.type}</td>
                    <td className="py-3">{meal.time}</td>
                    <td className="py-3">{meal.date}</td>
                    <td className="py-3 font-semibold text-green-500">
                      +{meal.calories}
                    </td>
                    <td className="py-3">
                      <button className="text-blue-500 hover:underline">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

const recentMeals = [
  { icon: '🍎', description: 'Apple', id: '#12345678', type: 'Snack', time: '14:30', date: '28 Jan', calories: 95 },
  { icon: '🍗', description: 'Chicken Breast', id: '#12345679', type: 'Lunch', time: '12:00', date: '28 Jan', calories: 165 },
  { icon: '🥗', description: 'Caesar Salad', id: '#12345680', type: 'Dinner', time: '19:00', date: '27 Jan', calories: 200 },
  { icon: '🥛', description: 'Milk', id: '#12345681', type: 'Breakfast', time: '08:00', date: '27 Jan', calories: 120 },
  { icon: '🍌', description: 'Banana', id: '#12345682', type: 'Snack', time: '10:30', date: '27 Jan', calories: 105 },
];