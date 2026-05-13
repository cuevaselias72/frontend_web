'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  getExposicionesService, 
  createExposicionService 
} from '@/lib/services/exposiciones.service';
import { getRubricasService } from '@/lib/services/rubricas.service';
import { AlertModal, ConfirmationModal } from '@/components/shared/DefaultModals';

interface PresentationFormProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any; 
  onSuccess?: () => void;
}

export default function PresentationForm({ isOpen, onClose, data, onSuccess }: PresentationFormProps) {
  const { token } = useAuth();
  
  // Estados de formulario
  const [temaExpo, setTemaExpo] = useState('');
  const [fechaExpo, setFechaExpo] = useState('');
  const [horaExpo, setHoraExpo] = useState('10:00');
  const [idRubrica, setIdRubrica] = useState('');
  
  // Estados de datos y UI
  const [exposiciones, setExposiciones] = useState<any[]>([]);
  const [rubricasDisponibles, setRubricasDisponibles] = useState<any[]>([]);
  const [evaluaciones, setEvaluaciones] = useState<any[]>([]); // ✨ NUEVO ESTADO PARA EVALUACIONES
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados modales
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ open: false, title: '', message: '' });

  useEffect(() => {
    if (isOpen && data?.id_equipo && token) {
      const fetchData = async () => {
        try {
          setLoading(true);
          
          // ✨ AGREGAMOS LA LLAMADA A EVALUACIONES EN EL PROMISE.ALL
          const [resExpos, resRubricas, resEvals] = await Promise.all([
            getExposicionesService(token),
            getRubricasService(token),
            fetch('https://exposicioneslaravel-production.up.railway.app/api/evaluaciones', {
              headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
            }).then(r => r.json())
          ]);

          const exposEquipo = (resExpos.data || resExpos).filter(
            (expo: any) => expo.id_equipo === data.id_equipo
          );
          
          setExposiciones(exposEquipo);
          setRubricasDisponibles(resRubricas.data || resRubricas);
          setEvaluaciones(resEvals.data || resEvals); // Guardamos todas las evaluaciones
        } catch (error) {
          console.error("Error al cargar datos:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, data, token]);

  if (!isOpen) return null;

  // ✨ LÓGICA MATEMÁTICA: Calcular calificación por Exposición
  const obtenerCalificacionExpo = (id_expo: number) => {
    // 1. Encontrar todas las evaluaciones para esta exposición específica
    const evalsDeExpo = evaluaciones.filter((ev: any) => ev.id_expo === id_expo);
    
    // Si nadie ha evaluado aún, retornamos null
    if (evalsDeExpo.length === 0) return null;

    let sumaTotalEvaluaciones = 0;

    // 2. Procesar cada evaluación (cada persona que calificó)
    evalsDeExpo.forEach((ev: any) => {
      let calificacionIndividual = 0;
      
      // Sumamos el valor de cada criterio según su porcentaje
      if (ev.detalles && ev.detalles.length > 0) {
        ev.detalles.forEach((criterio: any) => {
          const calif = parseFloat(criterio.pivot?.calificacion) || 0;
          const porcentaje = parseFloat(criterio.porcentaje) || 0;
          
          // Regla de 3: (Calificación * Porcentaje) / 100
          calificacionIndividual += (calif * (porcentaje / 100));
        });
      }
      sumaTotalEvaluaciones += calificacionIndividual;
    });

    // 3. Promediamos las calificaciones de todas las personas que evaluaron
    return (sumaTotalEvaluaciones / evalsDeExpo.length).toFixed(1);
  };

  // ✨ LÓGICA MATEMÁTICA: Calcular Promedio Total del Equipo
  const calcularPromedioEquipo = () => {
    // Sacamos las calificaciones finales de todas las expos, ignorando las que son "null"
    const calificacionesValidas = exposiciones
      .map(expo => obtenerCalificacionExpo(expo.id_expo))
      .filter(calif => calif !== null);

    if (calificacionesValidas.length === 0) return "0.0";

    const sumaGeneral = calificacionesValidas.reduce((acc, curr) => acc + parseFloat(curr!), 0);
    return (sumaGeneral / calificacionesValidas.length).toFixed(1);
  };

  const promedioGeneral = calcularPromedioEquipo();

  // Funciones de asignación
  const handlePreAsignar = () => {
    if (!temaExpo || !fechaExpo || !horaExpo || !idRubrica) {
      setAlertConfig({
        open: true,
        title: 'Campos incompletos',
        message: 'Por favor, llena todos los campos antes de programar la exposición.'
      });
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleAsignarConfirmado = async () => {
    if (!token || !data?.id_equipo) return;

    try {
      setIsSubmitting(true);
      const payload = {
        id_equipo: Number(data.id_equipo),
        id_rubrica: Number(idRubrica),
        tema: temaExpo,
        fecha: `${fechaExpo} ${horaExpo}:00`, 
      };

      await createExposicionService(payload, token);
      
      setTemaExpo(''); setFechaExpo(''); setHoraExpo('10:00'); setIdRubrica('');
      
      const resExpos = await getExposicionesService(token);
      const exposEquipo = (resExpos.data || resExpos).filter(
        (expo: any) => expo.id_equipo === data.id_equipo
      );
      setExposiciones(exposEquipo);

      if (onSuccess) onSuccess();
      setAlertConfig({
        open: true,
        title: 'Éxito',
        message: 'La exposición se ha programado correctamente.'
      });
    } catch (error: any) {
      setAlertConfig({
        open: true,
        title: 'Error',
        message: error.message || "No se pudo programar la exposición."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl max-h-[90vh] flex flex-col">
          
          <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
            <h3 className="text-xl font-bold text-black">
              Equipo: {data?.equipo || data?.nombre || '---'}
            </h3>
            <button onClick={onClose} className="text-neutral-400 hover:text-black font-bold text-xl">&times;</button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-10 h-10 border-4 border-neutral-200 border-t-black rounded-full animate-spin"></div>
                <p className="text-black font-medium">Cargando información...</p>
              </div>
            ) : (
              <>
                <div className="space-y-1 text-sm text-black">
                  <p><span className="font-bold">Materia:</span> {data?.grupo?.materia?.materia || '---'}</p>
                  <p><span className="font-bold">Grupo:</span> {data?.grupo?.grupo || '---'}</p>
                  <p><span className="font-bold">Cantidad exposiciones:</span> {exposiciones.length}</p>
                </div>

                <div className="overflow-x-auto rounded-lg border border-neutral-200">
                  <table className="w-full text-sm text-left text-black">
                    <thead className="bg-neutral-100">
                      <tr>
                        <th className="px-3 py-2 font-bold">Tema</th>
                        <th className="px-3 py-2 font-bold">Fecha/Hora</th>
                        <th className="px-3 py-2 font-bold text-center">Final</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {exposiciones.length === 0 ? (
                        <tr><td colSpan={3} className="text-center py-4 italic">Sin exposiciones programadas.</td></tr>
                      ) : (
                        exposiciones.map((expo) => {
                          // ✨ SACAMOS LA CALIFICACIÓN JUSTO ANTES DE PINTAR LA FILA
                          const calificacion = obtenerCalificacionExpo(expo.id_expo);
                          
                          return (
                            <tr key={expo.id_expo} className="hover:bg-neutral-50">
                              <td className="px-3 py-2 font-medium">{expo.tema}</td>
                              <td className="px-3 py-2 text-xs">
                                {new Date(expo.fecha).toLocaleDateString()} {new Date(expo.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                              {/* ✨ PINTAMOS LA CALIFICACIÓN O UN GUION SI AÚN NO LO EVALÚAN */}
                              <td className={`px-3 py-2 font-bold text-center ${calificacion ? 'text-blue-600' : 'text-neutral-400'}`}>
                                {calificacion !== null ? calificacion : '--'}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="text-right font-bold text-black">
                  Promedio equipo: <span className="text-blue-600">{promedioGeneral}</span>
                </div>

                <hr className="border-dashed border-neutral-300" />

                <div className="space-y-4">
                  <h4 className="font-bold text-black text-center">Programar nueva exposición</h4>
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-bold text-black">Tema:</label>
                      <input 
                        type="text" value={temaExpo} onChange={(e) => setTemaExpo(e.target.value)}
                        className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-black">Fecha:</label>
                        <input type="date" value={fechaExpo} onChange={(e) => setFechaExpo(e.target.value)} className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-black" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-black">Hora:</label>
                        <input type="time" value={horaExpo} onChange={(e) => setHoraExpo(e.target.value)} className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-black" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-bold text-black">Rúbrica:</label>
                      <select value={idRubrica} onChange={(e) => setIdRubrica(e.target.value)} className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-black bg-white">
                        <option value="">Seleccionar rúbrica...</option>
                        {rubricasDisponibles.map(r => <option key={r.id_rubrica} value={r.id_rubrica}>{r.rubrica}</option>)}
                      </select>
                    </div>

                    <div className="flex justify-center pt-2">
                      <button 
                        onClick={handlePreAsignar} 
                        disabled={isSubmitting || loading}
                        className="px-8 py-2 bg-black text-white rounded-xl hover:bg-neutral-800 transition-all font-bold disabled:opacity-50"
                      >
                        Asignar exposición
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleAsignarConfirmado}
        title="Confirmar programación"
        message={`¿Estás seguro de programar la exposición "${temaExpo}" para el equipo "${data?.equipo || data?.nombre}"?`}
        confirmText="Sí, programar"
      />

      <AlertModal 
        isOpen={alertConfig.open}
        onClose={() => setAlertConfig({ ...alertConfig, open: false })}
        title={alertConfig.title}
        message={alertConfig.message}
      />
    </>
  );
}