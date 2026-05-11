"use client";

import { useState, useEffect } from "react";
import {
  createAlumnoService,
  updateAlumnoService, // Asegúrate de tener este servicio en alumnos.service.ts
} from "@/lib/services/alumnos.service";
import { useAuth } from "@/context/AuthContext";
import type { Alumno } from "@/types/alumnos";

interface AlumnosFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  alumnoToEdit?: Alumno | null; // NUEVO: Recibe el alumno a editar
}

export function AlumnosForm({
  isOpen,
  onClose,
  onSuccess,
  alumnoToEdit,
}: AlumnosFormProps) {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    num_ctrl: "",
    id_rol: 11,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // NUEVO: Efecto para llenar los datos si estamos en modo edición
  useEffect(() => {
    if (isOpen) {
      if (alumnoToEdit) {
        // Llenar datos con el alumno seleccionado
        setFormData({
          nombre: alumnoToEdit.usuario?.nombre || "",
          email: alumnoToEdit.usuario?.email || "",
          password: "", // La contraseña suele ir vacía en edición a menos que la quieran cambiar
          num_ctrl: alumnoToEdit.num_ctrl || "",
          id_rol: 11,
        });
      } else {
        // Limpiar si es creación
        setFormData({
          nombre: "",
          email: "",
          password: "",
          num_ctrl: "",
          id_rol: 11,
        });
      }
      setError(null);
    }
  }, [isOpen, alumnoToEdit]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "id_rol" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    // Validación básica: Si estamos creando, es obligatoria. Si estamos editando, solo si escribieron algo.
    if (!alumnoToEdit && formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (
      alumnoToEdit &&
      formData.password.length > 0 &&
      formData.password.length < 8
    ) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Preparamos el payload (si estamos editando y no hay password, no lo mandamos)
      const payload = { ...formData };
      if (alumnoToEdit && !payload.password) {
        delete (payload as any).password; // Omitimos mandar una contraseña vacía al backend
      }

      if (alumnoToEdit) {
        // MODO EDICIÓN
        await updateAlumnoService(alumnoToEdit.id_usuario, payload, token);
      } else {
        // MODO CREACIÓN
        await createAlumnoService(payload, token);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Error al ${alumnoToEdit ? "actualizar" : "registrar"} al alumno`,
      );
    } finally {
      setLoading(false);
    }
  };

  // Variables dinámicas para la UI
  const isEditing = !!alumnoToEdit;
  const title = isEditing ? "Editar Alumno" : "Nuevo Alumno";
  const submitText = isEditing ? "Actualizar" : "Registrar";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-neutral-800">{title}</h3>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre Completo */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-neutral-700">
                Nombre Completo
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Juan Pérez"
                className="w-full rounded-2xl text-neutral-700 bg-neutral-50 border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-400 transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Correo */}
              <div>
                <label className="block mb-1.5 text-sm font-semibold text-neutral-700">
                  Email Institucional
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="juan@example.com"
                  className="w-full rounded-2xl text-neutral-700 bg-neutral-50 border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-400 transition-all"
                  required
                />
              </div>
              {/* Número de Control */}
              <div>
                <label className="block mb-1.5 text-sm font-semibold text-neutral-700">
                  Num. Control
                </label>
                <input
                  type="text"
                  name="num_ctrl"
                  value={formData.num_ctrl}
                  onChange={handleChange}
                  placeholder="19030001"
                  className="w-full rounded-2xl text-neutral-700 bg-neutral-50 border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-400 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-neutral-700">
                {isEditing ? "Nueva Contraseña (opcional)" : "Contraseña"}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={
                  isEditing
                    ? "Dejar vacío para no cambiar"
                    : "Mínimo 8 caracteres"
                }
                className="w-full rounded-2xl text-neutral-700 bg-neutral-50 border border-neutral-200 px-4 py-3 outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-400 transition-all"
                required={!isEditing} // Solo es obligatorio al crear
              />
            </div>

            {/* ID Rol */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-neutral-700">
                Rol ID
              </label>
              <input
                type="number"
                name="id_rol"
                value={11}
                onChange={handleChange}
                className="w-full rounded-2xl bg-neutral-100 border border-neutral-200 px-4 py-3 text-neutral-500 cursor-not-allowed"
                readOnly
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-sm text-red-600 font-medium text-center">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
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
                {loading ? "Procesando..." : submitText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
