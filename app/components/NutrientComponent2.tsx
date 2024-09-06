import React from 'react';
import { Card, CardContent } from "./card";

const CircularProgress = ({ value, maxValue, size }) => {
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e5e5"
          strokeWidth={strokeWidth}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-black">
        <span className="text-4xl font-bold">{value}</span>
        <span className="text-sm">of {maxValue} kcal</span>
      </div>
    </div>
  );
};

const ProgressBar = ({ value, maxValue, color, label }) => (
  <div className="mb-4">
    <div className="flex justify-between text-sm text-black mb-1">
      <span className="font-medium text-lg">{label}</span>
      <span>{value} / {maxValue}</span>
    </div>
    <div className="h-3 bg-gray-200 rounded-full">
      <div
        className="h-full rounded-full"
        style={{ width: `${(value / maxValue) * 100}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

const NutrientSummary = () => {
  const totalCalories = 1000;
  const maxCalories = 2200;
  const nutrients = [
    { name: 'Protein', value: 100, maxValue: 125, color: '#4a5568' },
    { name: 'Carbs', value: 100, maxValue: 275, color: '#4a5568' },
    { name: 'Fat', value: 30, maxValue: 90, color: '#4a5568' },
  ];

  return (
    <Card className="w-full max-w-2xl bg-white text-black shadow-none border-none">
      <CardContent className="ml-10 mr-10 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="w-1/2">
            <CircularProgress value={totalCalories} maxValue={maxCalories} size={200} />
          </div>
          <div className="w-1/2 pl-6">
            {nutrients.map((nutrient, index) => (
              <ProgressBar key={index} {...nutrient} label={nutrient.name} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutrientSummary;