'use client';

import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

const data = [
  { name: 'Protein', value: 56 },
  { name: 'Carbs', value: 250 },
  { name: 'Fats', value: 70 },
];

const NutrientDonut: React.FC = () => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex items-center justify-between max-w-2xl mx-auto">
      <div>
        <p className="text-4xl font-bold text-gray-800">{total}g</p>
        <p className="text-sm text-green-500 mb-4">▲ 32.1%</p>
        <div className="space-y-1">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: COLORS[index] }}></div>
              <span className="text-sm text-gray-600 mr-2">{item.name}</span>
              <span className="text-sm font-semibold text-gray-800">{item.value}g</span>
            </div>
          ))}
        </div>
      </div>
      <div className="w-32 h-32">
        <PieChart width={128} height={128}>
          <Pie
            data={data}
            cx={64}
            cy={64}
            innerRadius={40}
            outerRadius={60}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </div>
    </div>
  );
};

export default NutrientDonut;