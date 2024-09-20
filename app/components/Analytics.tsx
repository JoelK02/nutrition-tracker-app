import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NutrientCard from "@/components/NutrientCard";

interface AnalyticsProps {
  weeklyData: { day: string; calories: number }[];
  currentWeekStart: Date;
  changeWeek: (direction: "prev" | "next") => void;
}

export default function Analytics({ weeklyData, currentWeekStart, changeWeek }: AnalyticsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">This Week</h2>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => changeWeek("prev")}>
            <ChevronLeft size={24} />
          </Button>
          <span className="text-sm font-medium">
            {currentWeekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
            {new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
          <Button variant="ghost" size="icon" onClick={() => changeWeek("next")}>
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
  );
}
