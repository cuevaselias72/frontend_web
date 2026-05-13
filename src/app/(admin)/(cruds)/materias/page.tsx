"use client";

import { useState, useEffect } from "react";
import {
  getMateriasService,
  deleteMateriaService,
} from "@/lib/services/materias.service";
import { CrudCard } from "@/components/shared/CrudItem";
import { MateriasForm } from "@/components/features/cruds/MateriasForm";
import { ConfirmationModal } from "@/components/shared/DefaultModals";
import { useAuth } from "@/context/AuthContext";
import type { Materia } from "@/types/materias";

export default function MateriasPage() {
  const { token } = useAuth();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para modales
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Estados para saber qué elemento estamos editando o eliminando
  const [subjectToDelete, setSubjectToDelete] = useState<number | null>(null);
  const [materiaToEdit, setMateriaToEdit] = useState<Materia | null>(null);

  async function fetchData() {
    if (!token) return;

    try {
      setLoading(true);
      const response = await getMateriasService(token);

      if (response.success) {
        setMaterias(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // Al dar clic en editar, guardamos la materia completa y abrimos el modal
  const handleEdit = (materia: Materia) => {
    setMateriaToEdit(materia);
    setIsFormOpen(true);
  };

  // Función para abrir el modal de crear (limpiando si había algo para editar)
  const handleCreateNew = () => {
    setMateriaToEdit(null);
    setIsFormOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setSubjectToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (subjectToDelete === null || !token) return;

    try {
      await deleteMateriaService(subjectToDelete, token);
      setMaterias(materias.filter((m) => m.id_materia !== subjectToDelete));
      setIsConfirmOpen(false);
    } catch (err) {
      alert("No se pudo eliminar la materia");
    } finally {
      setSubjectToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Encabezado Skeleton */}
        <div className="flex justify-between items-center animate-pulse">
          <h2 className="text-3xl font-bold text-neutral-500 tracking-tight animate-pulse">
            Cargando Gestión de Materias..
          </h2>
          <div className="h-10 bg-neutral-300 rounded-xl w-36"></div>
        </div>

        {/* Cuadrícula de 9 Tarjetas Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm animate-pulse flex flex-col justify-between h-40"
            >
              <div>
                <div className="h-6 bg-neutral-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-neutral-300 rounded w-2/3 mb-2"></div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <div className="h-8 bg-neutral-200 rounded w-16"></div>
                <div className="h-8 bg-neutral-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-neutral-800 tracking-tight">
          Gestión de Materias
        </h2>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-black text-white rounded-xl hover:bg-neutral-800 transition-transform active:scale-95"
        >
          Nueva Materia
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materias.map((materia) => (
          <CrudCard
            key={materia.id_materia}
            title={materia.materia}
            details={[{ label: "ID", value: materia.id_materia }]}
            onEdit={() => handleEdit(materia)} // Pasamos la materia completa
            onDelete={() => openDeleteModal(materia.id_materia)}
          />
        ))}
      </div>

      <MateriasForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setMateriaToEdit(null); // Limpiamos el estado al cerrar
        }}
        onSuccess={fetchData}
        initialData={materiaToEdit} // Le pasamos los datos al form
      />

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Materia"
        message="¿Estás seguro de que deseas eliminar esta materia? Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
      />
    </div>
    // <div className="">
    //   {" "}
    //   {/* Contenedor padre que centra todo el contenido */}
    //   {/* El encabezado también debería estar dentro para que se alinee con las tarjetas */}
    //   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    //     <h2 className="text-3xl font-bold text-neutral-800 tracking-tight">
    //       Gestión de Materias
    //     </h2>
    //     <button onClick={handleCreateNew} className="...">
    //       Nueva Materia
    //     </button>
    //   </div>
    //   {/* La Grid */}
    //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //     {materias.map((materia) => (
    //       <CrudCard
    //         key={materia.id_materia}
    //         title={materia.materia}
    //         details={[{ label: "ID", value: materia.id_materia }]}
    //         onEdit={() => handleEdit(materia)} // Pasamos la materia completa
    //         onDelete={() => openDeleteModal(materia.id_materia)}
    //       />
    //     ))}
    //   </div>
    // </div>
  );
}
