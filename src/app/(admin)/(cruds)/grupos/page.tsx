"use client";

import { useState, useEffect } from "react";
import {
  getGruposService,
  deleteGrupoService,
} from "@/lib/services/grupos.service";
import { CrudCard } from "@/components/shared/CrudItem";
import { GruposForm } from "@/components/features/cruds/GruposForm";
import { InscribirForm } from "@/components/features/cruds/InscribirForm";
import { ConfirmationModal } from "@/components/shared/DefaultModals";
import { useAuth } from "@/context/AuthContext";
import type { Grupo } from "@/types/grupos";
import { useRouter } from "next/navigation";

export default function GruposPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para modales
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isInscribirOpen, setIsInscribirOpen] = useState(false);

  const [grupoToDelete, setGrupoToDelete] = useState<number | null>(null);
  const [selectedGrupoId, setSelectedGrupoId] = useState<number | null>(null);

  async function fetchData() {
    if (!token) return;

    try {
      setLoading(true);
      const response = await getGruposService(token);

      if (response.success) {
        setGrupos(response.data);
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

  // Redirigir a los detalles del grupo (para ver alumnos o inscribir)
  const handleViewDetails = (id: number) => {
    setSelectedGrupoId(id);
    setIsInscribirOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setGrupoToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (grupoToDelete === null || !token) return;

    try {
      await deleteGrupoService(grupoToDelete, token);
      setGrupos(grupos.filter((g) => g.id_grupo !== grupoToDelete));
      setIsConfirmOpen(false);
    } catch (err) {
      alert("No se pudo eliminar el grupo");
    } finally {
      setGrupoToDelete(null);
    }
  };

  if (loading)
    return <div className="p-6 text-neutral-500">Cargando grupos...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-neutral-800 tracking-tight">
          Gestión de Grupos
        </h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-black text-white rounded-xl hover:bg-neutral-800 transition-transform active:scale-95"
        >
          Nuevo Grupo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {grupos.map((grupo) => (
          <CrudCard
            key={grupo.id_grupo}
            title={`Grupo: ${grupo.grupo}`}
            details={[
              {
                label: "Materia",
                value: grupo.materia?.materia || "Sin Materia",
              },
              {
                label: "Maestro",
                value: grupo.maestro?.usuario?.nombre || "Sin Maestro",
              },
            ]}
            // En vez de editar, usamos el botón para ir a inscribir/ver alumnos
            onEdit={() => handleViewDetails(grupo.id_grupo)}
            onDelete={() => openDeleteModal(grupo.id_grupo)}
          />
        ))}
      </div>

      <GruposForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchData}
      />

      <InscribirForm
        isOpen={isInscribirOpen}
        onClose={() => setIsInscribirOpen(false)}
        grupoId={selectedGrupoId}
        onSuccess={fetchData}
      />

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Grupo"
        message="¿Estás seguro de que deseas eliminar este grupo? Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
      />
    </div>
  );
}
