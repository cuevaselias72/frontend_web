'use client';

interface ExpoEvalCardProps {
  tema: string;
  equipo: string;
  materia: string;
  estado: 'Sin evaluar' | 'Evaluado' | 'En proceso';
  onEvaluar: () => void;
}

export function ExpoEvalCard({ tema, equipo, materia, estado, onEvaluar }: ExpoEvalCardProps) {
  const estadoStyles = {
    'Sin evaluar': 'bg-neutral-200 text-neutral-600',
    'Evaluado': 'bg-green-100 text-green-700',
    'En proceso': 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="w-full bg-neutral-100 border border-neutral-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 transition-all hover:bg-neutral-200/50">
      
      <div className="space-y-1 flex-1">
        <h3 className="text-lg font-semibold text-neutral-800">{tema}</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-600">
          <span>{equipo}</span>
          <span className="hidden sm:inline">•</span>
          <span>{materia}</span>
        </div>
      </div>

      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 shrink-0">
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${estadoStyles[estado]}`}>
          {estado}
        </span>
        
        <button 
          onClick={onEvaluar}
          className="flex items-center justify-center p-2 bg-neutral-400 hover:bg-neutral-500 text-white rounded-xl transition-colors"
          title="Evaluar / Editar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M2.695 14.763l-1.262 3.152a.5.5 0 00.65.65l3.152-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
          </svg>
        </button>
      </div>
    </div>
  );
}