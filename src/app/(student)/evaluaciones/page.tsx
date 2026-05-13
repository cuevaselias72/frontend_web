'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getMisEvaluacionesPendientesService, getRubricaService, createEvaluacionService } from '@/lib/services/evaluaciones.service';
import { getEquipoDetalleService } from '@/lib/services/estudiante.service';
import { getMateriasService } from '@/lib/services/materias.service'; 
import type { Materia } from '@/types/materias';

import { SearchBar } from '@/components/shared/SearchBar';
import { OutlineButton } from '@/components/shared/FormElements';
import { ExpoEvalCard } from '@/components/features/evaluaciones/ExposicionCard';
import { FiltrosModal } from '@/components/features/evaluaciones/FilterModal';
import { EvaluarModal } from '@/components/features/evaluaciones/EvaluarModal';
import { AlertModal } from '@/components/shared/DefaultModals';

export default function EvaluarExposicionesPage() {
  const { token, user } = useAuth(); 
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [exposicionesUI, setExposicionesUI] = useState<any[]>([]);
  const [materiasDB, setMateriasDB] = useState<Materia[]>([]); 

  const [searchTerm, setSearchTerm] = useState('');
  const [filtrosMateria, setFiltrosMateria] = useState<string[]>([]);
  const [filtrosEstado, setFiltrosEstado] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  const [isFiltrosOpen, setIsFiltrosOpen] = useState(false);
  const [isEvaluarOpen, setIsEvaluarOpen] = useState(false);
  
  const [expoSeleccionada, setExpoSeleccionada] = useState<any>(null);
  const [criteriosActivos, setCriteriosActivos] = useState<any[]>([]);
  const [loadingCriterios, setLoadingCriterios] = useState(false);

  const [globalError, setGlobalError] = useState({ isOpen: false, title: '', message: '' });
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filtrosMateria, filtrosEstado]);

  useEffect(() => {
    async function fetchData() {
      if (!token) return;
      try {
        setLoading(true);

        const [evaluacionesRes, materiasRes] = await Promise.all([
          getMisEvaluacionesPendientesService(token),
          getMateriasService(token)
        ]);

        setMateriasDB(materiasRes.data);
        const exposAPI = evaluacionesRes.data;

        const equiposIds = Array.from(new Set<number>(exposAPI.map((expo: any) => expo.id_equipo)));
        const detallesEquipos = await Promise.all(
          equiposIds.map(id => getEquipoDetalleService(id, token))
        );

        const diccionarioMaterias: Record<number, string> = {};
        detallesEquipos.forEach((det: any) => {
          diccionarioMaterias[det.data.id_equipo] = det.data.grupo?.materia?.materia || 'Materia Desconocida';
        });

        const datosAdaptados = exposAPI.map((expo: any) => {
          const isEvaluado = expo.evaluaciones && expo.evaluaciones.length > 0;
          return {
            id_expo: expo.id_expo,
            id_rubrica: expo.id_rubrica,
            tema: expo.tema,
            equipo: expo.equipo?.equipo || 'Sin equipo',
            materia: diccionarioMaterias[expo.id_equipo] || 'Materia Desconocida',
            estado: isEvaluado ? 'Evaluado' : 'Sin evaluar',
            evaluacionPrevia: isEvaluado ? expo.evaluaciones[0] : null,
          };
        });

        setExposicionesUI(datosAdaptados);

      } catch (error: any) {
        console.error("Error cargando evaluaciones:", error);
        setGlobalError({
          isOpen: true,
          title: 'Error de conexión',
          message: error.message || 'No se pudieron cargar las evaluaciones. Por favor, recarga la página.'
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token]);

  async function saveEvaluacion(payloadExtra: any) {
    if (!token || !user) return;
    try {
      setIsSaving(true);
      
      const payloadCompleto = {
        ...payloadExtra,
        id_usuario: user.id_usuario
      };

      await createEvaluacionService(payloadCompleto, token);

      const nuevosDetalles = payloadCompleto.calificaciones.map((cal: any) => {
        const criterioBase = criteriosActivos.find(c => c.id === cal.id_criterio);
        return {
          id_criterios: cal.id_criterio,
          descripcion: criterioBase?.nombre || 'Criterio',
          pivot: { calificacion: cal.nota }
        };
      });

      setExposicionesUI(prev => prev.map(expo => {
        if (expo.id_expo === payloadCompleto.id_expo) {
          return { 
            ...expo, 
            estado: 'Evaluado',
            evaluacionPrevia: {
              observaciones: payloadCompleto.observaciones,
              detalles: nuevosDetalles
            }
          };
        }
        return expo;
      }));

      setIsEvaluarOpen(false);

    } catch (error: any) {
      console.error("Error al guardar la evaluación", error);
      setSaveError(error.message || "No se pudo guardar la evaluación. Revisa tu conexión e intenta de nuevo.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleOpenEvaluar(expo: any) {
    setExpoSeleccionada(expo);
    setIsEvaluarOpen(true);

    if (expo.estado === 'Evaluado') {
      const criteriosDeEvaluacion = expo.evaluacionPrevia.detalles.map((det: any) => ({
        id: det.id_criterios,
        nombre: det.descripcion 
      }));
      setCriteriosActivos(criteriosDeEvaluacion);
    } else {
      if (!token) return;
      try {
        setLoadingCriterios(true);
        const resRubrica = await getRubricaService(expo.id_rubrica, token);
        const criteriosFormateados = resRubrica.data.criterios.map((c: any) => ({
          id: c.id_criterios,
          nombre: c.descripcion 
        }));
        setCriteriosActivos(criteriosFormateados);
      } catch (error) {
        console.error("Error trayendo rúbrica", error);
      } finally {
        setLoadingCriterios(false);
      }
    }
  }

  const exposFiltradas = exposicionesUI.filter(expo => {
    const coincideTexto = 
      expo.tema.toLowerCase().includes(searchTerm.toLowerCase()) || 
      expo.materia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expo.equipo.toLowerCase().includes(searchTerm.toLowerCase());

    const coincideMateria = filtrosMateria.length === 0 || filtrosMateria.includes(expo.materia);
    const coincideEstado = filtrosEstado.length === 0 || filtrosEstado.includes(expo.estado);

    return coincideTexto && coincideMateria && coincideEstado;
  });

  const totalPages = Math.ceil(exposFiltradas.length / itemsPerPage);
  const exposPaginadas = exposFiltradas.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-10 h-10 border-4 border-neutral-200 border-t-neutral-800 rounded-full animate-spin"></div>
        <p className="text-neutral-500 font-medium">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-2xl font-bold text-neutral-800">Evaluaciones Pendientes</h2>
        <p className="text-neutral-500 text-sm mt-1">Evalúa el desempeño de otros equipos.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="flex-1">
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="Buscar por exposición, equipo o materia..." 
          />
        </div>
        <OutlineButton onClick={() => setIsFiltrosOpen(true)} className="shrink-0">
          Filtros {(filtrosMateria.length > 0 || filtrosEstado.length > 0) && '•'}
        </OutlineButton>
      </div>

      <div className="space-y-4">
        {exposPaginadas.map((expo) => (
          <ExpoEvalCard 
            key={expo.id_expo}
            tema={expo.tema}
            equipo={expo.equipo}
            materia={expo.materia}
            estado={expo.estado}
            onEvaluar={() => handleOpenEvaluar(expo)}
          />
        ))}

        {exposFiltradas.length === 0 && (
          <div className="bg-white p-10 rounded-2xl border border-dashed border-neutral-300 text-center text-neutral-500">
            No tienes exposiciones pendientes con estos filtros.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>
          
          <span className="text-sm text-neutral-600">
            Página <span className="font-semibold text-neutral-900">{currentPage}</span> de <span className="font-semibold text-neutral-900">{totalPages}</span>
          </span>

          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}

      <FiltrosModal 
        isOpen={isFiltrosOpen} 
        onClose={() => setIsFiltrosOpen(false)} 
        materiasDisponibles={materiasDB}
        onApply={(materias, estados) => {
          setFiltrosMateria(materias);
          setFiltrosEstado(estados);
        }}
      />

      <EvaluarModal 
        isOpen={isEvaluarOpen}
        onClose={() => setIsEvaluarOpen(false)}
        exposicion={expoSeleccionada}
        criteriosDisponibles={criteriosActivos}
        isLoadingCriterios={loadingCriterios}
        onSaveEvaluacion={saveEvaluacion}
        isSaving={isSaving}
      />

      <AlertModal 
        isOpen={globalError.isOpen}
        onClose={() => setGlobalError({ ...globalError, isOpen: false })}
        title={globalError.title}
        message={globalError.message}
        btnText="Cerrar" 
      />

    </div>
  );
}