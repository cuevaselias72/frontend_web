'use client';

import { useState, useEffect } from 'react';
import { CrudCard } from '@/components/shared/CrudItem';
import CreateForm from '@/components/features/rubricas/CreateForm';
import RubricForm from '@/components/features/rubricas/RubricForm';

import { useAuth } from '@/context/AuthContext';
import { getRubricasService, deleteRubricaService } from '@/lib/services/rubricas.service';
// ✨ IMPORTAMOS EL SERVICIO DE EXPOSICIONES
import { getExposicionesService } from '@/lib/services/exposiciones.service';
import { Rubrica } from '@/types/rubricas'; 
import { AlertModal, ConfirmationModal } from '@/components/shared/DefaultModals';

export default function RubricasPage() {
  const { token } = useAuth();

  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [rubricaSeleccionada, setRubricaSeleccionada] = useState<Rubrica | null>(null);

  const [rubricas, setRubricas] = useState<any[]>([]); // Usamos any para poder inyectarle el conteo manual
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para los modales de alerta y confirmación
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [idParaBorrar, setIdParaBorrar] = useState<number | null>(null);
  const [alertConfig, setAlertConfig] = useState({ open: false, title: '', message: '' });

  const fetchRubricas = async () => {
    if (!token) return;
    try {
      setLoading(true);
      
      // ✨ HACEMOS LAS DOS PETICIONES EN PARALELO
      const [resRubricas, resExposiciones] = await Promise.all([
        getRubricasService(token),
        getExposicionesService(token)
      ]);

      const rubricasLista = resRubricas.data || [];
      const exposicionesLista = resExposiciones.data || [];

      // ✨ CALCULAMOS EL CONTEO MANUALMENTE
      const rubricasConConteo = rubricasLista.map((rubrica: any) => {
        // Filtramos cuántas exposiciones tienen el id_rubrica de esta rúbrica
        const cantidadExpos = exposicionesLista.filter(
          (expo: any) => expo.id_rubrica === rubrica.id_rubrica
        ).length;

        return {
          ...rubrica,
          exposiciones_count_manual: cantidadExpos
        };
      });

      setRubricas(rubricasConConteo); 
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las rúbricas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRubricas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleEditar = (rubrica: Rubrica) => {
    setRubricaSeleccionada(rubrica);
    setIsEditarModalOpen(true);
  };

  const handleEliminarClick = (id_rubrica: number) => {
    setIdParaBorrar(id_rubrica);
    setIsConfirmOpen(true);
  };

  const handleConfirmarBorrado = async () => {
    if (!token || !idParaBorrar) return;
    try {
      await deleteRubricaService(idParaBorrar, token);
      fetchRubricas();
      setAlertConfig({ open: true, title: 'Éxito', message: 'Rúbrica eliminada correctamente.' });
    } catch (error: any) {
      let mensajeError = error.message || "Error al eliminar la rúbrica";
      
      if (mensajeError.includes("violates foreign key constraint") || mensajeError.includes("Foreign key violation")) {
        mensajeError = "No puedes eliminar esta rúbrica porque actualmente está asignada a una o más exposiciones. Debes quitarla de los equipos primero.";
      }

      setAlertConfig({ open: true, title: 'Acción denegada', message: mensajeError });
    } finally {
      setIsConfirmOpen(false);
      setIdParaBorrar(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-neutral-200 border-t-black rounded-full animate-spin"></div>
        <p className="text-black font-bold">Cargando tus rúbricas...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight">
          Rúbricas
        </h2>
        <button
          onClick={() => setIsCrearModalOpen(true)}
          className="w-full md:w-auto px-6 py-2 bg-black text-white rounded-xl hover:bg-neutral-800 transition-all active:scale-95 font-bold shadow-sm"
        >
          Crear rúbrica
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-800 font-bold rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {rubricas.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-black font-medium italic">No has creado ninguna rúbrica aún.</p>
          </div>
        ) : (
          rubricas.map((rubrica) => (
            <CrudCard
              key={rubrica.id_rubrica}
              title={rubrica.rubrica}
              details={[
                {
                  label: "Criterios",
                  value: rubrica.criterios?.length?.toString() || "0",
                },
                // ✨ SE REGRESÓ exposiciones_count, pero ahora usa la variable calculada manual
                {
                  label: "Exposiciones",
                  value: rubrica.exposiciones_count_manual?.toString() || "0",
                }
              ]}
              onEdit={() => handleEditar(rubrica)}
              onDelete={() => handleEliminarClick(rubrica.id_rubrica)} 
            />
          ))
        )}
      </div>

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

      <ConfirmationModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmarBorrado}
        title="Eliminar Rúbrica"
        message="¿Estás seguro de que deseas eliminar esta rúbrica? Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
      />

      <AlertModal 
        isOpen={alertConfig.open}
        onClose={() => setAlertConfig({ ...alertConfig, open: false })}
        title={alertConfig.title}
        message={alertConfig.message}
      />
      
    </div>
  );
}