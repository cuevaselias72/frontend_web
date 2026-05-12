'use client';

import { useState } from 'react';

interface CriterioVista {
  nombre: string;
  nota: number;
}

interface ExposicionVista {
  id_expo: number;
  tema: string;
  fecha: string;
  calificacionTotal: number;
  criterios: CriterioVista[];
}

interface CalificacionCardProps {
  materia: string;
  promedioGeneral: number;
  exposiciones: ExposicionVista[];
}

export function CalificacionCard({ materia, promedioGeneral, exposiciones }: CalificacionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
      
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-neutral-800">{materia}</h3>
          <div className="flex gap-4 text-sm text-neutral-600">
            <span className="font-medium">Exposiciones: {exposiciones.length}</span>
            <span className="font-medium">Promedio: <span className="text-neutral-900">{promedioGeneral.toFixed(2)}</span></span>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="self-start sm:self-center px-4 py-1.5 border border-neutral-800 text-neutral-800 text-sm font-medium rounded-full hover:bg-neutral-100 transition-colors active:scale-95 shrink-0"
        >
          {isExpanded ? 'Ocultar detalle' : 'Ver detalle'}
        </button>
      </div>

      {isExpanded && (
        <div className="px-5 pb-5 animate-in slide-in-from-top-2 fade-in duration-200">
          <hr className="border-neutral-200 border-2 rounded-full mb-5" />
          
          <div className="space-y-6">
            {exposiciones.map((expo) => (
              <div key={expo.id_expo} className="space-y-3">
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start text-sm">
                  <div>
                    <h4 className="font-semibold text-neutral-800">{expo.tema}</h4>
                    <p className="text-neutral-500">Fecha: {expo.fecha}</p>
                  </div>
                  <p className="font-medium text-neutral-800 mt-1 sm:mt-0">
                    Calificación: {expo.calificacionTotal.toFixed(2)}
                  </p>
                </div>

                <div className="overflow-x-auto pb-2">
                  <table className="w-full text-xs text-left border-collapse min-w-[300px]">
                    <thead>
                      <tr>
                        {expo.criterios.map((crit, idx) => (
                          <th key={idx} className="border border-neutral-300 bg-neutral-50 px-2 py-1.5 font-medium text-neutral-600 whitespace-nowrap">
                            {crit.nombre}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {expo.criterios.map((crit, idx) => (
                          <td key={idx} className="border border-neutral-300 px-2 py-1.5 text-neutral-800 font-medium">
                            {crit.nota.toFixed(2)}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="border-b border-dashed border-neutral-300 pt-2 last:border-0" />
              </div>
            ))}

            {exposiciones.length === 0 && (
              <p className="text-sm text-neutral-500 text-center py-2">
                Aún no hay calificaciones registradas.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}