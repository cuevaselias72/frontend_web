"use client";

import { LineChart } from "@mui/x-charts/LineChart";

interface LineChartCardProps {
  title: string;
  xAxisData: string[]; // Ej: ['Ene', 'Feb', 'Mar']
  seriesData: number[]; // Ej: [2, 5, 12]
}

export function LineChartCard({
  title,
  xAxisData,
  seriesData,
}: LineChartCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col transition-shadow hover:shadow-md h-full">
      <p className="text-sm text-neutral-500 font-medium mb-4">{title}</p>
      <div className="flex-1 w-full min-h-62.5">
        <LineChart
          xAxis={[{ data: xAxisData, scaleType: "point" }]}
          series={[{ data: seriesData, curve: "linear", color: "#737373" }]} // Neutral-800 de Tailwind
          margin={{ top: 10, bottom: 20, left: 30, right: 10 }}
        />
      </div>
    </div>
  );
}
