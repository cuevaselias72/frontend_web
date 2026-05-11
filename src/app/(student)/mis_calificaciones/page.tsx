'use client';

import { CalificacionCard } from '@/components/features/mis_calificaciones/CalificacionCard';
import { KpiCard } from '@/components/shared/KpiCard';

export default function MisCalificacionesPage() {
  
  const materias = [
    {
      id_materia: 1,
      materia: 'Ingeniería de Software',
      promedioGeneral: 8.75,
      exposiciones: [
        {
          id_expo: 101,
          tema: 'Exposición 1er parcial',
          fecha: '15/09/2025',
          calificacionTotal: 9.80,
          criterios: [
            { nombre: 'Dominio del tema', nota: 10 },
            { nombre: 'Material visual', nota: 9.5 },
          ]
        },
        {
          id_expo: 102,
          tema: 'Exposición 2do parcial',
          fecha: '20/10/2025',
          calificacionTotal: 7.70,
          criterios: [
            { nombre: 'Dominio del tema', nota: 8 },
            { nombre: 'Material visual', nota: 7.5 },
          ]
        }
      ]
    },
    {
      id_materia: 2,
      materia: 'Bases de Datos Avanzadas',
      promedioGeneral: 9.20,
      exposiciones: [
        {
          id_expo: 201,
          tema: 'Bases NoSQL',
          fecha: '05/11/2025',
          calificacionTotal: 9.20,
          criterios: [
            { nombre: 'Contenido', nota: 9 },
            { nombre: 'Ejemplos', nota: 9.5 },
          ]
        }
      ]
    }
  ];

  const totalMaterias = materias.length;
  
  const totalExposiciones = materias.reduce(
    (acc, mat) => acc + mat.exposiciones.length, 
    0
  );
  
  const promedioGlobal = totalMaterias > 0 
    ? materias.reduce((acc, mat) => acc + mat.promedioGeneral, 0) / totalMaterias 
    : 0;

  return (
    <div className="space-y-8">
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard 
          title="Promedio Global" 
          value={promedioGlobal.toFixed(2)} 
        />
        <KpiCard 
          title="Materias Evaluadas" 
          value={totalMaterias} 
        />
        <KpiCard 
          title="Total de Exposiciones" 
          value={totalExposiciones} 
        />
      </div>

      <div className="space-y-4">
        {materias.length > 0 ? (
          materias.map((data) => (
            <CalificacionCard 
              key={data.id_materia}
              materia={data.materia}
              promedioGeneral={data.promedioGeneral}
              exposiciones={data.exposiciones}
            />
          ))
        ) : (
          <div className="bg-white p-10 rounded-2xl border border-dashed border-neutral-300 text-center text-neutral-500">
            Aún no tienes evaluaciones registradas.
          </div>
        )}
      </div>

    </div>
  );
}