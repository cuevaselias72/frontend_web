"use client";

import { useState, useEffect } from "react";
import {
  createMaestroservice,
  updateMaestroservice,
} from "@/lib/services/maestros.service";
import { useAuth } from "@/context/AuthContext";
import type { Maestro } from "@/types/maestros";

interface ProfesoresFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  maestroToEdit?: Maestro | null;
}

export function ProfesoresForm({
  isOpen,
  onClose,
  onSuccess,
  maestroToEdit,
}: ProfesoresFormProps) {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    id_rol: 10, // ID solicitado para maestros
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (maestroToEdit) {
        setFormData({
          nombre: maestroToEdit.usuario?.nombre || "",
          email: maestroToEdit.usuario?.email || "",
          password: "", // Se deja vacío por seguridad en edición
          id_rol: 10,
        });
      } else {
        setFormData({
          nombre: "",
          email: "",
          password: "",
          id_rol: 10,
        });
      }
      setError(null);
    }
  }, [isOpen, maestroToEdit]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!maestroToEdit && formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = { ...formData };
      // Si estamos editando y no hay password, lo eliminamos del envío
      if (maestroToEdit && !payload.password) {
        delete (payload as any).password;
      }

      if (maestroToEdit) {
        await updateMaestroservice(maestroToEdit.id_usuario, payload, token);
      } else {
        await createMaestroservice(payload, token);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al procesar la solicitud",
      );
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!maestroToEdit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-neutral-800">
              {isEditing ? "Editar Profesor" : "Nuevo Profesor"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400"
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-neutral-700">
                Nombre del Docente
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Prof. López"
                className="w-full rounded-2xl text-neutral-700 bg-neutral-50 border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-400 transition-all"
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-semibold text-neutral-700">
                Correo Institucional
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="lopez@docente.com"
                className="w-full rounded-2xl text-neutral-700 bg-neutral-50 border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-400 transition-all"
                required
              />
            </div>
            {/* Solo se muestra si NO estamos editando */}
            {!isEditing && (
              <div>
                <label className="block mb-1.5 text-sm font-semibold text-neutral-700">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full rounded-2xl text-neutral-700 bg-neutral-50 border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-400 transition-all"
                  required={!isEditing} // Solo es obligatorio si no se está editando
                />
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 rounded-2xl text-sm text-red-600 text-center font-medium">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3.5 border border-neutral-200 text-neutral-600 font-bold rounded-2xl hover:bg-neutral-50 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3.5 bg-black text-white font-bold rounded-2xl hover:bg-neutral-800 transition-all disabled:opacity-50"
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
