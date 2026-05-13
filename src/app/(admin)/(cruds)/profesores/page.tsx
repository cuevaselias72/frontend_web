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

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Encabezado Skeleton */}
        <div className="flex justify-between items-center animate-pulse">
          <h2 className="text-3xl font-bold text-neutral-500 tracking-tight animate-pulse">
            Cargando Gestión de Profesores..
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

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="max-w-md w-full bg-red-50 border border-red-100 rounded-2xl p-8 text-center shadow-sm">
          {/* Círculo con Icono de Alerta */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
          </div>

          {/* Textos del Error */}
          <h3 className="text-xl font-bold text-red-800 mb-2">
            ¡Vaya! Algo salió mal
          </h3>
          <p className="text-red-600/80 text-sm mb-8">
            {error ||
              "No pudimos cargar la información de los profesores. Por favor, verifica tu conexión o intenta más tarde."}
          </p>

          {/* Botón para reintentar */}
          <button
            onClick={() => {
              setError(null);
              fetchData();
            }}
            className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors active:scale-95 shadow-sm"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

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
