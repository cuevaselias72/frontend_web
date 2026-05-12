"use client";

import { BarChart } from "@mui/x-charts/BarChart";

interface BarChartCardProps {
  title: string;
  xAxisData: string[]; // Nombres de grupos o maestros
  seriesData: number[]; // Cantidades
  horizontal?: boolean; // Para voltear la gráfica si los nombres son muy largos
}

export function BarChartCard({
  title,
  xAxisData,
  seriesData,
  horizontal = false,
}: BarChartCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col transition-shadow hover:shadow-md h-full">
      <p className="text-sm text-neutral-500 font-medium mb-4">{title}</p>
      <div className="flex-1 w-full min-h-62.5">
        <BarChart
          xAxis={
            horizontal ? undefined : [{ data: xAxisData, scaleType: "band" }]
          }
          yAxis={
            horizontal ? [{ data: xAxisData, scaleType: "band" }] : undefined
          }
          series={[{ data: seriesData, color: "#8b5cf6" }]} // Morado de Tailwind
          layout={horizontal ? "horizontal" : "vertical"}
          margin={{
            top: 10,
            bottom: horizontal ? 20 : 30,
            left: horizontal ? 80 : 30,
            right: 10,
          }}
        />
      </div>
    </div>
  );
}
