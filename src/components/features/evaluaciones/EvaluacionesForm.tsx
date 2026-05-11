'use client';

import { useState } from 'react';
import { ModalWrapper } from '@/components/shared/ModalWrapper';
import { ModalDefaultBtn, ModalCloseBtn } from '@/components/shared/ModalButtons';

interface EvaluarModalProps {
  isOpen: boolean;
  onClose: () => void;
  exposicion: any; 
}

export function EvaluarModal({ isOpen, onClose, exposicion }: EvaluarModalProps) {
  const [calificaciones, setCalificaciones] = useState<Record<number, number>>({});

  if (!exposicion) return null;

  function handleSubmit() {
    const payload = {
      id_expo: exposicion.id_expo,
      id_usuario: 1, 
      observaciones: "",
      calificaciones: Object.entries(calificaciones).map(([id, nota]) => ({
        id_criterio: Number(id),
        nota: Number(nota)
      }))
    };
    
    console.log("Enviando evaluación:", payload);
    onClose();
  }

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={exposicion.tema}>
      <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
        
        <div className="text-sm text-neutral-600 space-y-1">
          <p><span className="font-medium text-neutral-800">Equipo:</span> {exposicion.equipo}</p>
          <p><span className="font-medium text-neutral-800">Materia:</span> {exposicion.materia}</p>
          <p><span className="font-medium text-neutral-800">Integrantes:</span> Alumno 1, Alumno 2, Alumno 3</p>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-neutral-800">Criterios y calificaciones:</h4>
          
          {exposicion.criteriosMock.map((crit: any) => (
            <div key={crit.id} className="flex justify-between items-center gap-4">
              <label className="text-sm text-neutral-700 flex-1">{crit.nombre}:</label>
              <select 
                // AQUÍ AGREGUÉ text-neutral-900 PARA FORZAR EL TEXTO OSCURO
                className="w-24 p-2 bg-white text-neutral-900 border border-neutral-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-neutral-400"
                value={calificaciones[crit.id] || ''}
                onChange={(e) => setCalificaciones({...calificaciones, [crit.id]: Number(e.target.value)})}
              >
                <option value="" disabled className="text-neutral-400">--</option>
                {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map(num => (
                  <option key={num} value={num} className="text-neutral-900">{num}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex justify-end gap-3">
        <ModalCloseBtn onClick={onClose}>Cancelar</ModalCloseBtn>
        <ModalDefaultBtn onClick={handleSubmit}>Guardar Evaluación</ModalDefaultBtn>
      </div>
    </ModalWrapper>
  );
}