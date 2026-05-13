'use client';

import { useState, useEffect } from 'react';
import { ModalWrapper } from '@/components/shared/ModalWrapper';
import { ModalDefaultBtn, ModalCloseBtn } from '@/components/shared/ModalButtons';

interface EvaluarModalProps {
  isOpen: boolean;
  onClose: () => void;
  exposicion: any | null; 
  criteriosDisponibles: any[]; 
  isLoadingCriterios: boolean;
  onSaveEvaluacion: (payload: any) => void;
  isSaving: boolean; 
}

export function EvaluarModal({ 
  isOpen, 
  onClose, 
  exposicion, 
  criteriosDisponibles, 
  isLoadingCriterios, 
  onSaveEvaluacion, 
  isSaving 
}: EvaluarModalProps) {
  const [calificaciones, setCalificaciones] = useState<Record<number, number>>({});
  const [observaciones, setObservaciones] = useState('');
  
  const [step, setStep] = useState<'form' | 'confirm'>('form');

  useEffect(() => {
    setStep('form');
    
    if (exposicion && exposicion.estado === 'Evaluado' && exposicion.evaluacionPrevia) {
      const notasPrevias: Record<number, number> = {};
      exposicion.evaluacionPrevia.detalles.forEach((det: any) => {
        notasPrevias[det.id_criterios] = Number(det.pivot.calificacion);
      });
      setCalificaciones(notasPrevias);
      setObservaciones(exposicion.evaluacionPrevia.observaciones || '');
    } else {
      setCalificaciones({});
      setObservaciones('');
    }
  }, [exposicion, isOpen]);

  if (!exposicion) return null;

  function handleConfirmSave() {
    const fechaActual = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const payload = {
      id_expo: exposicion.id_expo,
      observaciones: observaciones.trim(), // Limpiamos espacios extra
      fecha: fechaActual,
      calificaciones: Object.entries(calificaciones).map(([id, nota]) => ({
        id_criterio: Number(id),
        nota: Number(nota)
      }))
    };
    
    onSaveEvaluacion(payload);
  }

  const isFormValid = criteriosDisponibles.length > 0 && Object.keys(calificaciones).length === criteriosDisponibles.length;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={`Evaluar: ${exposicion.tema}`}>
      
      <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
        
        {step === 'form' ? (
          <>
            <div className="text-sm text-neutral-600 space-y-1 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
              <p><span className="font-medium text-neutral-800">Equipo:</span> {exposicion.equipo}</p>
              <p><span className="font-medium text-neutral-800">Materia:</span> {exposicion.materia}</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-neutral-800">
                {exposicion.estado === 'Evaluado' ? 'Tus calificaciones registradas:' : 'Asigna una calificación:'}
              </h4>
              
              {isLoadingCriterios ? (
                <p className="text-sm text-neutral-500 animate-pulse">Cargando rúbrica...</p>
              ) : (
                criteriosDisponibles.map((crit: any) => (
                  <div key={crit.id} className="flex justify-between items-center gap-4">
                    <label className="text-sm text-neutral-700 flex-1">{crit.nombre}:</label>
                    <select 
                      className="w-24 p-2 bg-white text-neutral-900 border border-neutral-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50"
                      value={calificaciones[crit.id] || ''}
                      onChange={(e) => setCalificaciones({...calificaciones, [crit.id]: Number(e.target.value)})}
                      disabled={exposicion.estado === 'Evaluado'}
                    >
                      <option value="" disabled className="text-neutral-400">--</option>
                      {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map(num => (
                        <option key={num} value={num} className="text-neutral-900">{num}</option>
                      ))}
                    </select>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2">
               <div className="flex justify-between items-end">
                 <label className="text-sm font-medium text-neutral-700">Observaciones (Opcional)</label>
                 <span className="text-xs text-neutral-400">{observaciones.length}/255</span>
               </div>
               <textarea 
                 className="w-full p-3 bg-white text-neutral-900 border border-neutral-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-neutral-400 resize-none disabled:bg-neutral-50 disabled:text-neutral-500"
                 rows={3}
                 maxLength={255} // Límite para proteger la BD
                 placeholder="Escribe algún comentario o retroalimentación sobre la exposición..."
                 value={observaciones}
                 onChange={(e) => setObservaciones(e.target.value)}
                 disabled={exposicion.estado === 'Evaluado'}
               ></textarea>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-800">¿Enviar Evaluación?</h3>
            <p className="text-neutral-600 text-sm">
              Estás a punto de enviar las calificaciones para el equipo <span className="font-semibold text-neutral-900">"{exposicion.equipo}"</span>.
            </p>
            <p className="text-neutral-500 text-xs">
              Asegúrate de que las notas sean correctas.
            </p>
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex justify-end gap-3">
        {step === 'form' ? (
          <>
            <ModalCloseBtn onClick={onClose}>Cerrar</ModalCloseBtn>
            {exposicion.estado !== 'Evaluado' && (
              <ModalDefaultBtn 
                onClick={() => setStep('confirm')} 
                disabled={!isFormValid || isLoadingCriterios}
              >
                Revisar y Guardar
              </ModalDefaultBtn>
            )}
          </>
        ) : (
          <>
            <button 
              onClick={() => setStep('form')} 
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
            >
              Atrás
            </button>
            <button 
              onClick={handleConfirmSave} 
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-neutral-800 rounded-lg hover:bg-neutral-900 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Sí, enviar calificación</span>
              )}
            </button>
          </>
        )}
      </div>
    </ModalWrapper>
  );
}