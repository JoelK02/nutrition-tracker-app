import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./card";

const CircularProgress = ({ value, maxValue, color, size, label }) => {
  const percentage = (value / maxValue) * 100;
  const strokeWidth = 17;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e6e6e6"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold">{value}g</span>
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
};

const NutrientSummary = () => {
  const data = [
    { name: 'Protein', value: 75, color: '#4ade80', maxValue: 100 },
    { name: 'Fats', value: 50, color: '#fbbf24', maxValue: 100 },
    { name: 'Carbs', value: 225, color: '#22d3ee', maxValue: 300 },
  ];

  const totalCalories = (data[0].value * 4 + data[1].value * 9 + data[2].value * 4).toFixed(0);

  return (
    <Card className="w-full max-w-3xl border-none shadow-none">
      <CardContent>
        <div className="flex items-baseline space-x-2 mb-5 justify-center"> 
          <span className="text-3xl font-bold">{totalCalories}</span> 
          <span className="text-sm text-muted-foreground">calories</span> 
        </div>
        <div className="flex justify-between items-center">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center ">
              <CircularProgress 
                value={item.value} 
                maxValue={item.maxValue} 
                color={item.color} 
                size={160} // Increased size
                label={item.name}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NutrientSummary;