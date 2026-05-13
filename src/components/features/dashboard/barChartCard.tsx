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
  const grayscalePalette = [
    "#404040",
    "#737373",
    "#b8b6b6",
    "#d4d4d4",
    "#e5e5e5",
    "#f5f5f5",
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col transition-shadow hover:shadow-md h-full">
      <p className="text-sm text-neutral-500 font-medium mb-4">{title}</p>
      <div className="flex-1 w-full min-h-62.5">
        <BarChart
          colors={grayscalePalette}
          xAxis={
            horizontal
              ? undefined
              : [
                  {
                    data: xAxisData,
                    scaleType: "band",
                    colorMap: { type: "ordinal", colors: grayscalePalette },
                  },
                ]
          }
          yAxis={
            horizontal
              ? [
                  {
                    data: xAxisData,
                    scaleType: "band",
                    colorMap: { type: "ordinal", colors: grayscalePalette },
                  },
                ]
              : undefined
          }
          series={[{ data: seriesData }]}
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
