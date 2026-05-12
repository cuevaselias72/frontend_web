"use client";

import { useState, useEffect } from "react";
import {
  createMateriaService,
  updateMateriaService,
} from "@/lib/services/materias.service";
import { useAuth } from "@/context/AuthContext";
import type { Materia } from "@/types/materias";

interface MateriasFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Materia | null; // <-- Añadimos esto para saber si estamos editando
}

export function MateriasForm({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: MateriasFormProps) {
  const { token } = useAuth();
  const [materiaName, setMateriaName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sincronizamos el estado local cuando se abre el modal o cambia el initialData
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setMateriaName(initialData.materia);
      } else {
        setMateriaName("");
      }
      setError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!materiaName.trim()) {
      setError("El nombre de la materia es obligatorio.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = { materia: materiaName.trim() };

      if (initialData) {
        // Si hay initialData, actualizamos
        await updateMateriaService(initialData.id_materia, payload, token);
      } else {
        // Si no hay initialData, creamos
        await createMateriaService(payload, token);
      }

      setMateriaName("");
      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al procesar la materia",
      );
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!initialData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-neutral-800">
              {isEditing ? "Editar Materia" : "Nueva Materia"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-neutral-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-neutral-700">
                Nombre de la Materia
              </label>
              <input
                type="text"
                autoFocus
                value={materiaName}
                onChange={(e) => setMateriaName(e.target.value)}
                placeholder="Ej. Programación Web"
                className="w-full rounded-2xl bg-neutral-50 text-neutral-900 border border-neutral-200 px-5 py-3.5 outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-400 transition-all"
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-sm text-red-600 font-medium text-center">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3.5 border border-neutral-200 text-neutral-600 font-bold rounded-2xl hover:bg-neutral-50 transition-all active:scale-95"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3.5 bg-black text-white font-bold rounded-2xl hover:bg-neutral-800 transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
