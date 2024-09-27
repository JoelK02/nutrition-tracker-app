import React from 'react';
import { AlertCircle } from 'lucide-react';

interface NutrientBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
}

const NutrientBar: React.FC<NutrientBarProps> = ({ label, value, max, color }) => {
  const percentage = Math.min((value / max) * 100, 100); // Ensure percentage doesn't exceed 100

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        <div className="flex items-center">
          <span className="text-sm font-medium">{value}g / {max}g</span>
          {value > max && (
            <AlertCircle className="w-4 h-4 ml-1 text-yellow-500" />
          )}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`${color} h-2.5 rounded-full`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default NutrientBar;