'use client';

interface KpiCardProps {
  title: string;
  value: string | number;
}

export function KpiCard({ title, value }: KpiCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-center transition-shadow hover:shadow-md">
      <p className="text-sm text-neutral-500 font-medium mb-1">
        {title}
      </p>
      <p className="text-3xl font-bold text-neutral-800 tracking-tight">
        {value}
      </p>
    </div>
  );
}