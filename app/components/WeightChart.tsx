'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data - replace this with actual data from your application
const data = [
  { week: 'Week 1', weight: 70 },
  { week: 'Week 2', weight: 69.5 },
  { week: 'Week 3', weight: 69.8 },
  { week: 'Week 4', weight: 69.2 },
  { week: 'Week 5', weight: 68.9 },
  { week: 'Week 6', weight: 68.5 },
  { week: 'Week 7', weight: 68.3 },
  { week: 'Week 8', weight: 68 },
];

const WeightChart: React.FC = () => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
          <Tooltip />
          <Bar dataKey="weight" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightChart;