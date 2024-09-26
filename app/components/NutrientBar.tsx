import React from 'react';

interface NutrientBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
}

const NutrientBar: React.FC<NutrientBarProps> = ({ label, value, max, color }) => {
  const percentage = (value / max) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{value}g / {max}g</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default NutrientBar;