import React from 'react';

interface NutrientBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
  icon?: string;
}

const NutrientBar: React.FC<NutrientBarProps> = ({ label, value, max, color, icon }) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon && <span className="text-xl">{icon}</span>}
          <span className="font-medium">{label}</span>
        </div>
        <span className="text-sm text-gray-600">
          {value} / {max}g
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default NutrientBar;