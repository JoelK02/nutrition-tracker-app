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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

export const description = "A radial chart with text";

const chartData = [
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
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
    <Card className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={250}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
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
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].visitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
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
      </CardContent>
      
    </Card>
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
      <CardContent className="ml-10 mr-10 p-8 pt-6 shadow-none">
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