'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createRubricaService } from '@/lib/services/rubricas.service';

interface CreateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateForm({ isOpen, onClose, onSuccess }: CreateFormProps) {
  const { token } = useAuth();
  
  // Estados del formulario
  const [nombreRubrica, setNombreRubrica] = useState('');
  const [criterioDesc, setCriterioDesc] = useState('');
  const [porcentaje, setPorcentaje] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lista temporal de criterios
  const [criterios, setCriterios] = useState<{ id: number; descripcion: string; porcentaje: number }[]>([]);

  if (!isOpen) return null;

  const handleAddCriterio = () => {
    if (!criterioDesc || !porcentaje) return;
    
    setCriterios([
      ...criterios, 
      { id: Date.now(), descripcion: criterioDesc, porcentaje: Number(porcentaje) }
    ]);
    
    setCriterioDesc('');
    setPorcentaje('');
  };

  const handleRemoveCriterio = (id: number) => {
    setCriterios(criterios.filter(c => c.id !== id));
  };

  const handleCrear = async () => {
    if (!nombreRubrica || criterios.length === 0 || !token) {
      alert("Asegúrate de poner un nombre y al menos un criterio.");
      return;
    }

    // Validar que sumen 100% (Opcional, pero recomendado)
    const sumaTotal = criterios.reduce((acc, curr) => acc + curr.porcentaje, 0);
    if (sumaTotal !== 100) {
       if(!confirm(`La suma de los criterios es ${sumaTotal}%, no 100%. ¿Deseas continuar?`)) return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        rubrica: nombreRubrica,
        criterios: criterios.map(({ descripcion, porcentaje }) => ({
          descripcion,
          porcentaje
        }))
      };

      await createRubricaService(payload, token);
      
      if (onSuccess) onSuccess();
      onClose();
      
      // Limpiar formulario
      setNombreRubrica('');
      setCriterios([]);
    } catch (error: any) {
      alert(error.message || "Error al crear la rúbrica");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
          <h3 className="text-xl font-bold text-neutral-800">Crear rúbrica</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 font-bold text-xl">&times;</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Nombre Rúbrica */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-700">Nombre de la rúbrica</label>
            <input 
              type="text" 
              value={nombreRubrica} 
              onChange={(e) => setNombreRubrica(e.target.value)}
              disabled={isSubmitting}
              placeholder="Ej. Exposición Final"
              className="w-full border border-neutral-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black bg-white disabled:opacity-50"
            />
          </div>

          {/* Inputs para añadir criterios */}
          <div className="flex gap-2 items-end">
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium text-neutral-700">Criterio</label>
              <input 
                type="text" 
                value={criterioDesc} 
                onChange={(e) => setCriterioDesc(e.target.value)} 
                disabled={isSubmitting}
                placeholder="Descripción"
                className="w-full border border-neutral-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black" 
              />
            </div>
            <div className="w-20 space-y-1">
              <label className="text-sm font-medium text-neutral-700">%</label>
              <input 
                type="number" 
                value={porcentaje} 
                onChange={(e) => setPorcentaje(e.target.value)} 
                disabled={isSubmitting}
                placeholder="0" 
                className="w-full border border-neutral-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black" 
              />
            </div>
            <button 
              onClick={handleAddCriterio} 
              disabled={isSubmitting}
              className="px-3 py-2 border border-black rounded-xl hover:bg-neutral-100 text-sm h-[42px] font-medium transition-colors disabled:opacity-50"
            >
              Añadir
            </button>
          </div>

          {/* Lista de criterios añadidos */}
          {criterios.length > 0 && (
            <div className="border border-neutral-200 rounded-xl p-3 space-y-2 max-h-48 overflow-y-auto bg-neutral-50">
              <div className="flex justify-between text-xs font-semibold text-neutral-500 pb-1 border-b border-neutral-200 px-1">
                <span className="flex-1">Criterio</span>
                <span className="w-16 text-center">Valor</span>
                <span className="w-8"></span>
              </div>
              {criterios.map(c => (
                <div key={c.id} className="flex items-center justify-between text-sm text-neutral-800 p-1 hover:bg-white rounded-md transition-all">
                  <span className="flex-1 truncate pr-2">{c.descripcion}</span>
                  <span className="w-16 text-center font-medium">{c.porcentaje}%</span>
                  <button 
                    onClick={() => handleRemoveCriterio(c.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3 bg-neutral-50">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-800"
          >
            Cancelar
          </button>
          <button 
            onClick={handleCrear} 
            disabled={isSubmitting || criterios.length === 0}
            className="px-6 py-2 bg-black text-white rounded-xl hover:bg-neutral-800 transition-transform active:scale-95 disabled:opacity-50 font-medium"
          >
            {isSubmitting ? 'Guardando...' : 'Crear rúbrica'}
          </button>
        </div>
      </div>
    </div>
  );
}