"use client";

import { useState, useEffect } from "react";
import {
  getAlumnosService,
  deleteAlumnoService,
} from "@/lib/services/alumnos.service";
import { CrudCard } from "@/components/shared/CrudItem";
import { AlumnosForm } from "@/components/features/cruds/AlumnosForm";
import { ConfirmationModal } from "@/components/shared/DefaultModals";
import { useAuth } from "@/context/AuthContext";
import type { Alumno } from "@/types/alumnos";

export default function AlumnosPage() {
  const { token } = useAuth();
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para modales
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [alumnoToDelete, setAlumnoToDelete] = useState<number | null>(null);

  // NUEVO: Estado para saber si estamos editando
  const [alumnoToEdit, setAlumnoToEdit] = useState<Alumno | null>(null);

  async function fetchData() {
    if (!token) return;

    try {
      setLoading(true);
      const response = await getAlumnosService(token);

      if (response.success) {
        setAlumnos(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar alumnos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // NUEVO: Recibe el alumno completo y abre el modal
  const handleEdit = (alumno: Alumno) => {
    setAlumnoToEdit(alumno);
    setIsFormOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setAlumnoToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (alumnoToDelete === null || !token) return;

    try {
      await deleteAlumnoService(alumnoToDelete, token);
      setAlumnos(alumnos.filter((a) => a.id_usuario !== alumnoToDelete));
      setIsConfirmOpen(false);
    } catch (err) {
      alert("No se pudo eliminar al alumno");
    } finally {
      setAlumnoToDelete(null);
    }
  };

  // NUEVO: Función para cerrar el modal y limpiar el estado de edición
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setAlumnoToEdit(null);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Encabezado Skeleton */}
        <div className="flex justify-between items-center animate-pulse">
          <h2 className="text-3xl font-bold text-neutral-500 tracking-tight animate-pulse">
            Cargando Gestión de Alumnos..
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
          Gestión de Alumnos
        </h2>
        <button
          // NUEVO: Nos aseguramos de que alumnoToEdit sea null al crear uno nuevo
          onClick={() => {
            setAlumnoToEdit(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 bg-black text-white rounded-xl hover:bg-neutral-800 transition-transform active:scale-95"
        >
          Nuevo Alumno
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alumnos.length === 0 ? (
          <p className="text-neutral-500 italic">No hay alumnos registrados.</p>
        ) : (
          alumnos.map((alumno) => (
            <CrudCard
              key={alumno.id_usuario}
              title={alumno.usuario?.nombre || "Sin nombre"} // Aseguramos que no rompa si falta usuario
              details={[
                { label: "Num. Control", value: alumno.num_ctrl },
                // { label: "Email", value: alumno.usuario?.email },
              ]}
              // NUEVO: Pasamos el objeto alumno completo a handleEdit
              onEdit={() => handleEdit(alumno)}
              onDelete={() => openDeleteModal(alumno.id_usuario)}
            />
          ))
        )}
      </div>

      {/* Modal para Crear/Editar Alumno */}
      <AlumnosForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSuccess={fetchData}
        alumnoToEdit={alumnoToEdit} // NUEVO: Pasamos el alumno (puede ser null)
      />

      {/* Modal de Confirmación para eliminar */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Alumno"
        message={`¿Estás seguro de que deseas eliminar a este alumno? Esta acción eliminará su acceso al sistema.`}
        confirmText="Sí, eliminar"
      />
    </div>
  );
}
