"use client";

import { useState, useEffect } from "react";
import {
  getMaestrosService,
  deleteMaestroservice,
} from "@/lib/services/maestros.service";
import { CrudCard } from "@/components/shared/CrudItem";
import { ProfesoresForm } from "@/components/features/cruds/ProfesoresForm";
import { ConfirmationModal } from "@/components/shared/DefaultModals";
import { useAuth } from "@/context/AuthContext";
import type { Maestro } from "@/types/maestros";

export default function ProfesoresPage() {
  const { token } = useAuth();
  const [profesores, setProfesores] = useState<Maestro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [maestroToDelete, setMaestroToDelete] = useState<number | null>(null);
  const [maestroToEdit, setMaestroToEdit] = useState<Maestro | null>(null);

  async function fetchData() {
    if (!token) return;
    try {
      setLoading(true);
      const response = await getMaestrosService(token);
      if (response.success) {
        setProfesores(response.data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar profesores",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleEdit = (maestro: Maestro) => {
    setMaestroToEdit(maestro);
    setIsFormOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setMaestroToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (maestroToDelete === null || !token) return;
    try {
      await deleteMaestroservice(maestroToDelete, token);
      setProfesores(profesores.filter((p) => p.id_usuario !== maestroToDelete));
      setIsConfirmOpen(false);
    } catch (err) {
      alert("No se pudo eliminar al profesor");
    } finally {
      setMaestroToDelete(null);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setMaestroToEdit(null);
  };

  if (loading)
    return <div className="p-6 text-neutral-500">Cargando profesores...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-neutral-800 tracking-tight">
          Gestión de Profesores
        </h2>
        <button
          onClick={() => {
            setMaestroToEdit(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 bg-black text-white rounded-xl hover:bg-neutral-800 transition-transform active:scale-95"
        >
          Nuevo Profesor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profesores.length === 0 ? (
          <p className="text-neutral-500 italic">
            No hay profesores registrados.
          </p>
        ) : (
          profesores.map((profesor) => (
            <CrudCard
              key={profesor.id_usuario}
              title={profesor.usuario?.nombre || "Sin nombre"}
              details={[
                { label: "Email", value: profesor.usuario?.email || "N/A" },
                // { label: "Rol ID", value: 10 },
              ]}
              onEdit={() => handleEdit(profesor)}
              onDelete={() => openDeleteModal(profesor.id_usuario)}
            />
          ))
        )}
      </div>

      <ProfesoresForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSuccess={fetchData}
        maestroToEdit={maestroToEdit}
      />

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Profesor"
        message="¿Estás seguro de que deseas eliminar a este docente? Se perderá su acceso al sistema."
        confirmText="Sí, eliminar"
      />
    </div>
  );
}
