'use client';

export interface CardDetail {
  label: string;
  value: string | number;
}

interface CrudCardProps {
  title: string;
  details: CardDetail[];
  onEdit: () => void;
  onDelete: () => void;
}

export function CrudCard({ title, details, onEdit, onDelete }: CrudCardProps) {
  return (
    <div className="w-full bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      
      <div className="flex-1 space-y-3">
        <h3 className="text-2xl font-semibold text-neutral-800 tracking-tight">
          {title}
        </h3>
        
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {details.map((detail, index) => (
            <p key={index} className="text-sm text-neutral-600">
              <span className="font-medium text-neutral-500 mr-1">{detail.label}:</span> 
              <span className="text-neutral-800 font-medium">{detail.value}</span>
            </p>
          ))}
        </div>
      </div>

      <div className="flex sm:flex-col gap-2 shrink-0">
        <button 
          onClick={onEdit}
          className="flex-1 sm:flex-none px-4 py-1.5 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-full hover:bg-neutral-100 hover:text-black transition-colors active:scale-95"
        >
          Editar
        </button>
        <button 
          onClick={onDelete}
          className="flex-1 sm:flex-none px-4 py-1.5 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors active:scale-95"
        >
          Eliminar
        </button>
      </div>

    </div>
  );
}