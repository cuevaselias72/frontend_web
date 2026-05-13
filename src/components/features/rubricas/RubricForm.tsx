'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateRubricaService } from '@/lib/services/rubricas.service';
import { getExposicionesService } from '@/lib/services/exposiciones.service';
import { AlertModal } from '@/components/shared/DefaultModals'; 

interface RubricFormProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any; // Recibe la rúbrica
  onSuccess?: () => void;
}

export default function RubricForm({ isOpen, onClose, data, onSuccess }: RubricFormProps) {
  const { token } = useAuth();
  
  const [nombreRubrica, setNombreRubrica] = useState('');
  const [exposicionesRelacionadas, setExposicionesRelacionadas] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ open: false, title: '', message: '' });

  // Obtenemos los criterios que ya vienen en la data de la rúbrica
  const criterios = data?.criterios || [];

  useEffect(() => {
    if (isOpen && data && token) {
      setNombreRubrica(data.rubrica || '');

      const fetchExposiciones = async () => {
        try {
          setLoading(true);
          const response = await getExposicionesService(token);
          const todasLasExpos = response.data || [];
          
          const exposFiltradas = todasLasExpos.filter(
            (expo: any) => expo.id_rubrica === data.id_rubrica
          );
          
          setExposicionesRelacionadas(exposFiltradas);
        } catch (error) {
          console.error("Error al cargar las exposiciones de esta rúbrica:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchExposiciones();
    }
  }, [isOpen, data, token]);

  if (!isOpen) return null;

  const handleGuardarCambios = async () => {
    if (!token || !data?.id_rubrica) return;
    if (!nombreRubrica.trim()) {
      setAlertConfig({ open: true, title: 'Atención', message: 'El nombre de la rúbrica no puede estar vacío.' });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        rubrica: nombreRubrica
      };

      await updateRubricaService(data.id_rubrica, payload, token);
      
      if (onSuccess) onSuccess(); 
      onClose(); 
      
    } catch (error: any) {
      setAlertConfig({ open: true, title: 'Error', message: error.message || "Error al actualizar la rúbrica" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-xl max-h-[90vh] flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
            <h3 className="text-xl font-bold text-black">Detalles de la Rúbrica</h3>
            <button onClick={onClose} disabled={isSubmitting} className="text-neutral-400 hover:text-black font-bold text-xl disabled:opacity-50">
              &times;
            </button>
          </div>

          {/* Body Scrollable */}
          <div className="p-6 overflow-y-auto space-y-8">
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="w-10 h-10 border-4 border-neutral-200 border-t-black rounded-full animate-spin"></div>
                <p className="text-black font-bold">Cargando detalles...</p>
              </div>
            ) : (
              <>
                {/* Edición de Nombre */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black">Nombre de la rúbrica</label>
                  <input 
                    type="text" 
                    value={nombreRubrica} 
                    onChange={(e) => setNombreRubrica(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full border border-neutral-300 rounded-xl px-4 py-2 text-black font-medium outline-none focus:ring-2 focus:ring-black bg-white disabled:bg-neutral-100" 
                  />
                </div>

                <hr className="border-dashed border-neutral-300" />

                {/* ✨ NUEVO: Tabla de Criterios (Solo lectura) */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <h4 className="text-sm font-bold text-black">Criterios de evaluación ({criterios.length})</h4>
                    <span className="text-xs font-bold text-black bg-neutral-100 px-2 py-1 rounded-md">
                      Suma total: {criterios.reduce((acc: number, curr: any) => acc + Number(curr.porcentaje), 0)}%
                    </span>
                  </div>
                  
                  <div className="overflow-x-auto rounded-xl border border-neutral-300 bg-white">
                    <table className="w-full text-sm text-left text-black">
                      <thead className="bg-neutral-100 border-b border-neutral-300">
                        <tr>
                          <th className="px-4 py-2 font-bold">Descripción del criterio</th>
                          <th className="px-4 py-2 font-bold text-center w-24">Valor (%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {criterios.length === 0 ? (
                          <tr>
                            <td colSpan={2} className="px-4 py-6 text-center text-black font-medium italic">
                              No hay criterios registrados en esta rúbrica.
                            </td>
                          </tr>
                        ) : (
                          criterios.map((c: any, index: number) => (
                            <tr key={c.id_criterios || index} className="hover:bg-neutral-50 transition-colors">
                              <td className="px-4 py-2 font-medium">{c.descripcion}</td>
                              <td className="px-4 py-2 font-bold text-center">{c.porcentaje}%</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <hr className="border-dashed border-neutral-300" />

                {/* Lista de Exposiciones vinculadas */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-black">Exposiciones que usan esta rúbrica ({exposicionesRelacionadas.length})</h4>
                  
                  <div className="overflow-x-auto rounded-xl border border-neutral-300 bg-white">
                    <table className="w-full text-sm text-left text-black">
                      <thead className="bg-neutral-100 border-b border-neutral-300">
                        <tr>
                          <th className="px-4 py-2 font-bold">Equipo</th>
                          <th className="px-4 py-2 font-bold">Tema</th>
                          <th className="px-4 py-2 font-bold">Fecha/Hora</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {exposicionesRelacionadas.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="px-4 py-6 text-center text-black font-medium italic">
                              Esta rúbrica aún no ha sido asignada a ninguna exposición.
                            </td>
                          </tr>
                        ) : (
                          exposicionesRelacionadas.map((expo) => (
                            <tr key={expo.id_expo} className="hover:bg-neutral-50 transition-colors">
                              <td className="px-4 py-2 font-bold">{expo.equipo?.equipo || 'Sin equipo'}</td>
                              <td className="px-4 py-2 font-medium">{expo.tema}</td>
                              <td className="px-4 py-2 text-xs font-medium">
                                {new Date(expo.fecha).toLocaleDateString()} {new Date(expo.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3 bg-neutral-50">
            <button 
              onClick={onClose} 
              disabled={isSubmitting || loading}
              className="px-4 py-2 text-sm font-bold text-black hover:bg-neutral-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              onClick={handleGuardarCambios}
              disabled={isSubmitting || loading || !nombreRubrica.trim() || nombreRubrica === data?.rubrica}
              className="px-6 py-2 bg-black text-white rounded-xl hover:bg-neutral-800 disabled:opacity-50 font-bold transition-transform active:scale-95"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Alertas */}
      <AlertModal 
        isOpen={alertConfig.open}
        onClose={() => setAlertConfig({ ...alertConfig, open: false })}
        title={alertConfig.title}
        message={alertConfig.message}
      />
    </>
  );
}