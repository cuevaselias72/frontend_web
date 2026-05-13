'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getMisCalificacionesService, getEquipoDetalleService } from '@/lib/services/estudiante.service';
import { CalificacionCard } from '@/components/features/mis_calificaciones/CalificacionCard';
import { KpiCard } from '@/components/shared/KpiCard';

export default function MisCalificacionesPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [materiasUI, setMateriasUI] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!token) return;

      try {
        setLoading(true);

        const calificacionesRes = await getMisCalificacionesService(token);
        const equiposEstudiante = calificacionesRes.data;

        const equiposIds = equiposEstudiante.map((eq: any) => eq.id_equipo);

        const detallesEquiposRes = await Promise.all(
          equiposIds.map((id: number) => getEquipoDetalleService(id, token))
        );

        const diccionarioMaterias: Record<number, { id_materia: number, nombre: string }> = {};
        detallesEquiposRes.forEach((res) => {
          const eqDetalle = res.data;
          diccionarioMaterias[eqDetalle.id_equipo] = {
            id_materia: eqDetalle.grupo?.materia?.id_materia || 999,
            nombre: eqDetalle.grupo?.materia?.materia || 'Materia Desconocida'
          };
        });

        const materiasAgrupadas: Record<number, any> = {};

        equiposEstudiante.forEach((equipo: any) => {
          const infoMateria = diccionarioMaterias[equipo.id_equipo];

          if (!materiasAgrupadas[infoMateria.id_materia]) {
            materiasAgrupadas[infoMateria.id_materia] = {
              id_materia: infoMateria.id_materia,
              materia: infoMateria.nombre,
              exposiciones: []
            };
          }

          equipo.exposiciones.forEach((expo: any) => {
            
            const criteriosMap: Record<number, { nombre: string, total: number, count: number }> = {};

            expo.evaluaciones?.forEach((ev: any) => {
              ev.detalles?.forEach((detalle: any) => {
                const idCrit = detalle.id_criterios;
                if (!criteriosMap[idCrit]) {
                  criteriosMap[idCrit] = { nombre: detalle.descripcion || 'Criterio', total: 0, count: 0 };
                }
                criteriosMap[idCrit].total += parseFloat(detalle.pivot.calificacion);
                criteriosMap[idCrit].count += 1;
              });
            });

            const criteriosUI = Object.values(criteriosMap).map(c => ({
              nombre: c.nombre,
              nota: c.total / c.count
            }));

            const calificacionFinalExpo = criteriosUI.length > 0 
              ? criteriosUI.reduce((acc, c) => acc + c.nota, 0) / criteriosUI.length 
              : 0;

            materiasAgrupadas[infoMateria.id_materia].exposiciones.push({
              id_expo: expo.id_expo,
              tema: expo.tema,
              fecha: new Date(expo.fecha).toLocaleDateString(),
              calificacionTotal: calificacionFinalExpo,
              criterios: criteriosUI
            });
          });
        });

        // 6. Calculamos el promedio general por materia
        const resultadoFinal = Object.values(materiasAgrupadas).map((mat: any) => {
          const sumaTotal = mat.exposiciones.reduce((acc: number, e: any) => acc + e.calificacionTotal, 0);
          return {
            ...mat,
            promedioGeneral: mat.exposiciones.length > 0 ? (sumaTotal / mat.exposiciones.length) : 0
          };
        });

        setMateriasUI(resultadoFinal);

      } catch (error) {
        console.error("Error al cargar calificaciones:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token]);

  const totalMaterias = materiasUI.length;
  const totalExposiciones = materiasUI.reduce((acc, mat) => acc + mat.exposiciones.length, 0);
  const promedioGlobal = totalMaterias > 0 
    ? materiasUI.reduce((acc, mat) => acc + mat.promedioGeneral, 0) / totalMaterias 
    : 0;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-800"></div>
        <p className="text-neutral-500 font-medium">Recopilando tus calificaciones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      <div>
        <h2 className="text-2xl font-bold text-neutral-800">Mis Calificaciones</h2>
        <p className="text-neutral-500 text-sm mt-1">Resumen de tu desempeño en exposiciones.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard 
          title="Promedio Global" 
          value={promedioGlobal > 0 ? promedioGlobal.toFixed(2) : '--'} 
        />
        <KpiCard 
          title="Materias Evaluadas" 
          value={totalMaterias} 
        />
        <KpiCard 
          title="Exposiciones Calificadas" 
          value={totalExposiciones} 
        />
      </div>

      <div className="space-y-4">
        {materiasUI.length > 0 ? (
          materiasUI.map((data) => (
            <CalificacionCard 
              key={data.id_materia}
              materia={data.materia}
              promedioGeneral={data.promedioGeneral}
              exposiciones={data.exposiciones}
            />
          ))
        ) : (
          <div className="bg-white p-10 rounded-2xl border border-dashed border-neutral-300 text-center flex flex-col items-center gap-2 text-neutral-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-neutral-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Aún no tienes evaluaciones registradas en ninguna materia.</p>
          </div>
        )}
      </div>

    </div>
  );
}