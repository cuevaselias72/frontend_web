"use client";

import { useState, useEffect } from "react";
import { createGrupoService } from "@/lib/services/grupos.service";
import { getMateriasService } from "@/lib/services/materias.service";
import { getMaestrosService } from "@/lib/services/maestros.service";
import { useAuth } from "@/context/AuthContext";
import type { Materia } from "@/types/materias";
import type { Maestro } from "@/types/maestros";

interface GruposFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function GruposForm({ isOpen, onClose, onSuccess }: GruposFormProps) {
  const { token } = useAuth();

  // Estados para los campos del formulario
  const [grupoName, setGrupoName] = useState("");
  const [idMateria, setIdMateria] = useState("");
  const [idMaestro, setIdMaestro] = useState("");

  // Estados para las listas de los selects
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [maestros, setMaestros] = useState<Maestro[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Limpiar el formulario y cargar datos al abrir
  useEffect(() => {
    if (isOpen && token) {
      setGrupoName("");
      setIdMateria("");
      setIdMaestro("");
      setError(null);

      // Cargar opciones para los select
      const loadData = async () => {
        try {
          const [matsRes, maesRes] = await Promise.all([
            getMateriasService(token),
            getMaestrosService(token),
          ]);
          if (matsRes.success) setMaterias(matsRes.data);
          if (maesRes.success) setMaestros(maesRes.data);
        } catch (err) {
          console.error("Error al cargar datos del formulario:", err);
        }
      };
      loadData();
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!grupoName.trim() || !idMateria || !idMaestro) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        grupo: grupoName.trim(),
        id_materia: Number(idMateria),
        id_maestro: Number(idMaestro),
      };

      await createGrupoService(payload, token);

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el grupo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-neutral-800">Nuevo Grupo</h3>
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
            <div>
              <label className="block mb-1 text-sm font-semibold text-neutral-700">
                Nombre/Identificador del Grupo
              </label>
              <input
                type="text"
                autoFocus
                value={grupoName}
                onChange={(e) => setGrupoName(e.target.value)}
                placeholder="Ej. 601-A"
                maxLength={10}
                className="w-full rounded-2xl bg-neutral-50 text-neutral-900 border border-neutral-200 px-5 py-3.5 outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-400 transition-all"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-neutral-700">
                Materia
              </label>
              <select
                value={idMateria}
                onChange={(e) => setIdMateria(e.target.value)}
                className="w-full rounded-2xl bg-neutral-50 text-neutral-900 border border-neutral-200 px-5 py-3.5 outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-400 transition-all appearance-none"
                required
              >
                <option value="">Selecciona una materia</option>
                {materias.map((m) => (
                  <option key={m.id_materia} value={m.id_materia}>
                    {m.materia}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-neutral-700">
                Maestro
              </label>
              <select
                value={idMaestro}
                onChange={(e) => setIdMaestro(e.target.value)}
                className="w-full rounded-2xl bg-neutral-50 text-neutral-900 border border-neutral-200 px-5 py-3.5 outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-400 transition-all appearance-none"
                required
              >
                <option value="">Selecciona un maestro</option>
                {maestros.map((m) => (
                  <option key={m.id_usuario} value={m.id_usuario}>
                    {m.usuario?.nombre || "Cargando..."}
                  </option>
                ))}
              </select>
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
                {loading ? "Creando..." : "Crear Grupo"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
