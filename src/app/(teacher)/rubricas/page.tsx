'use client';

import { useState, useEffect } from 'react';
import { CrudCard } from '@/components/shared/CrudItem';
import CreateForm from '@/components/features/rubricas/CreateForm';
import RubricForm from '@/components/features/rubricas/RubricForm';

import { useAuth } from '@/context/AuthContext';
import { getRubricasService, deleteRubricaService } from '@/lib/services/rubricas.service';
import { Rubrica } from '@/types/rubricas'; // ✨ Importamos el tipo real

export default function RubricasPage() {
  const { token } = useAuth();

  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [rubricaSeleccionada, setRubricaSeleccionada] = useState<Rubrica | null>(null);

  const [rubricas, setRubricas] = useState<Rubrica[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRubricas = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await getRubricasService(token);
      // Ajustamos según la estructura de tu ApiResponse
      setRubricas(response.data || []); 
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las rúbricas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRubricas();
  }, [token]);

  const handleEditar = (rubrica: Rubrica) => {
    setRubricaSeleccionada(rubrica);
    setIsEditarModalOpen(true);
  };

  const handleEliminar = async (id_rubrica: number) => {
    if (!token) return;
    
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta rúbrica?");
    if (!confirmar) return;

    try {
      await deleteRubricaService(id_rubrica, token);
      // Refresco optimista o fetch
      fetchRubricas();
    } catch (error: any) {
      alert(error.message || "Error al eliminar la rúbrica");
    }
  };

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-neutral-100 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
        <h2 className="text-3xl font-bold text-neutral-800 tracking-tight">
          Rúbricas
        </h2>
        <button
          onClick={() => setIsCrearModalOpen(true)}
          className="px-4 py-2 bg-black text-white rounded-xl hover:bg-neutral-800 transition-all active:scale-95 font-medium shadow-sm"
        >
          Crear rúbrica
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {rubricas.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-neutral-500 italic">No has creado ninguna rúbrica aún.</p>
          </div>
        ) : (
          rubricas.map((rubrica) => (
            <CrudCard
              key={rubrica.id_rubrica}
              title={rubrica.rubrica}
              details={[
                {
                  label: "Criterios",
                  value: rubrica.criterios?.length.toString() || "0",
                },
                {
                  label: "Exposiciones",
                  value: rubrica.exposiciones_count?.toString() || "0",
                },
              ]}
              onEdit={() => handleEditar(rubrica)}
              onDelete={() => handleEliminar(rubrica.id_rubrica)} 
            />
          ))
        )}
      </div>

      {/* Modales con recarga automática al éxito */}
      {isCrearModalOpen && (
        <CreateForm 
          isOpen={isCrearModalOpen} 
          onClose={() => setIsCrearModalOpen(false)} 
          onSuccess={fetchRubricas} 
        />
      )}
      
      {isEditarModalOpen && rubricaSeleccionada && (
        <RubricForm 
          isOpen={isEditarModalOpen} 
          onClose={() => {
            setIsEditarModalOpen(false);
            setRubricaSeleccionada(null);
          }} 
          data={rubricaSeleccionada} 
          onSuccess={fetchRubricas} 
        />
      )}
      
    </div>
  );
}