import React from 'react';
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartData = [
  { browser: "safari", visitors: 1000, fill: "var(--color-safari)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const CircularProgress = () => {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full max-w-[250px]"
    >
      <RadialBarChart
        data={chartData}
        startAngle={0}
        endAngle={250}
        innerRadius="80%"
        outerRadius="100%"
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={['86%', '74%']}
        />
        <RadialBar dataKey="visitors" background cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {chartData[0].visitors.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 20}
                      className="fill-muted-foreground text-sm"
                    >
                      Calories
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
};

const ProgressBar = ({ value, maxValue, color, label }) => (
  <div className="mb-4">
    <div className="flex justify-between text-sm text-black mb-1">
      <span className="font-medium">{label}</span>
      <span>{value} / {maxValue}</span>
    </div>
    <div className="h-2 bg-gray-200 rounded-full">
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
      <CardContent className="p-4 sm:p-6 shadow-none">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between">
          <div className="w-full sm:w-1/2 mb-6 sm:mb-0">
            <CircularProgress />
          </div>
          <div className="w-full sm:w-1/2 sm:pl-6">
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