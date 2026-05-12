'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/shared/SearchBar';
import { OutlineButton } from '@/components/shared/FormElements';
import { ExpoEvalCard } from '@/components/features/evaluaciones/ExposicionCard';
import { EvaluarModal } from '@/components/features/evaluaciones/EvaluacionesForm';
import { FiltrosModal } from '@/components/features/evaluaciones/FilterModal';

export default function EvaluacionesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtrosMateria, setFiltrosMateria] = useState<string[]>([]);
  const [filtrosEstado, setFiltrosEstado] = useState<string[]>([]);

  const [isFiltrosOpen, setIsFiltrosOpen] = useState(false);
  const [isEvaluarOpen, setIsEvaluarOpen] = useState(false);
  const [expoSeleccionada, setExpoSeleccionada] = useState<any>(null);

  // --- MOCK DATA ---
  const mockExposiciones = [
    {
      id_expo: 1,
      tema: 'Exposicion laravel',
      equipo: 'Equipo 1',
      materia: 'Topicos web',
      estado: 'Sin evaluar' as const,
      criteriosMock: [
        { id: 1, nombre: 'Dominio del tema' },
        { id: 2, nombre: 'Material visual' },
        { id: 3, nombre: 'Dicción' }
      ]
    },
    {
      id_expo: 2,
      tema: 'Exposicion sprint 2',
      equipo: 'Equipo 2',
      materia: 'Gestión de proyectos',
      estado: 'Evaluado' as const,
      criteriosMock: [
        { id: 1, nombre: 'Avance técnico' },
        { id: 4, nombre: 'Trabajo en equipo' }
      ]
    },
    {
      id_expo: 3,
      tema: 'Exposicion app 2do parcial',
      equipo: 'Equipo 1',
      materia: 'Desarrollo movil',
      estado: 'En proceso' as const,
      criteriosMock: [
        { id: 5, nombre: 'UX/UI' },
        { id: 6, nombre: 'Funcionalidad' }
      ]
    },
    {
      id_expo: 4,
      tema: 'Exposicion herramientas',
      equipo: 'Equipo 5',
      materia: 'Ciberseguridad',
      estado: 'En proceso' as const,
      criteriosMock: [
        { id: 7, nombre: 'Conceptos' },
        { id: 8, nombre: 'Ejemplos prácticos' }
      ]
    }
  ];

  const exposFiltradas = mockExposiciones.filter(expo => {
    const coincideTexto = 
      expo.tema.toLowerCase().includes(searchTerm.toLowerCase()) || 
      expo.materia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expo.equipo.toLowerCase().includes(searchTerm.toLowerCase());

    const coincideMateria = filtrosMateria.length === 0 || filtrosMateria.includes(expo.materia);

    const coincideEstado = filtrosEstado.length === 0 || filtrosEstado.includes(expo.estado);

    return coincideTexto && coincideMateria && coincideEstado;
  });

  function aplicarFiltros(materias: string[], estados: string[]) {
    setFiltrosMateria(materias);
    setFiltrosEstado(estados);
  }

  function handleOpenEvaluar(expo: any) {
    setExpoSeleccionada(expo);
    setIsEvaluarOpen(true);
  }

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="flex-1">
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="Buscar exposición, equipo o materia..." 
          />
        </div>
        <OutlineButton 
          onClick={() => setIsFiltrosOpen(true)}
          className="shrink-0"
        >
          Filtros {(filtrosMateria.length > 0 || filtrosEstado.length > 0) && '•'}
        </OutlineButton>
      </div>

      <div className="space-y-4">
        {exposFiltradas.map((expo) => (
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
            No se encontraron exposiciones con esos filtros.
          </div>
        )}
      </div>

      <FiltrosModal 
        isOpen={isFiltrosOpen} 
        onClose={() => setIsFiltrosOpen(false)} 
        onApply={aplicarFiltros}
      />

      <EvaluarModal 
        isOpen={isEvaluarOpen}
        onClose={() => setIsEvaluarOpen(false)}
        exposicion={expoSeleccionada}
      />

    </div>
  );
}