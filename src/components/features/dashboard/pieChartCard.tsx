"use client";

import { PieChart } from "@mui/x-charts/PieChart";

interface PieChartCardProps {
  title: string;
  data: { id: number | string; value: number; label: string }[];
}

export function PieChartCard({ title, data }: PieChartCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col transition-shadow hover:shadow-md h-full">
      <p className="text-sm text-neutral-500 font-medium mb-4">{title}</p>
      <div className="flex-1 w-full min-h-62.5 flex justify-center items-center">
        <PieChart
          series={[
            {
              data,
              innerRadius: 30, // Le da un look de dona moderna
              paddingAngle: 2,
              cornerRadius: 4,
            },
          ]}
          margin={{ top: 10, bottom: 10, left: 10, right: 100 }} // Margen derecho para las etiquetas
          slotProps={{
            legend: {
              direction: "vertical",
              position: { vertical: "middle", horizontal: "center" },
            },
          }}
        />
      </div>
    </div>
  );
}
