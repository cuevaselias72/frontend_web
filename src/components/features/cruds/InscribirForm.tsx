"use client";

import { useState, useEffect } from "react";
import {
  getGrupoService,
  inscribirAlumnosService,
} from "@/lib/services/grupos.service";
import { getAlumnosService } from "@/lib/services/alumnos.service";
import { useAuth } from "@/context/AuthContext";
import type { Alumno } from "@/types/alumnos";
import type { GrupoDetails } from "@/types/grupos";

interface InscribirFormProps {
  isOpen: boolean;
  onClose: () => void;
  grupoId: number | null;
  onSuccess: () => void;
}

export function InscribirForm({
  isOpen,
  onClose,
  grupoId,
  onSuccess,
}: InscribirFormProps) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [grupo, setGrupo] = useState<GrupoDetails | null>(null);
  const [allAlumnos, setAllAlumnos] = useState<Alumno[]>([]);
  const [selectedAlumnoId, setSelectedAlumnoId] = useState("");

  useEffect(() => {
    if (isOpen && token && grupoId) {
      const loadData = async () => {
        try {
          setLoading(true);
          setError(null);
          const [grupoRes, alumnosRes] = await Promise.all([
            getGrupoService(grupoId, token),
            getAlumnosService(token),
          ]);

          if (grupoRes.success) setGrupo(grupoRes.data);
          if (alumnosRes.success) setAllAlumnos(alumnosRes.data);
        } catch (err) {
          setError("Error al cargar los datos de alumnos o grupo.");
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [isOpen, token, grupoId]);

  const handleInscribir = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !grupoId || !selectedAlumnoId || !grupo) return;

    try {
      setLoading(true);
      setError(null);

      // Extraemos los IDs de los alumnos actuales para no perderlos
      const currentIds = grupo.alumnos?.map((a) => a.id_usuario) || [];

      const payload = {
        // Enviamos los que ya estaban + el nuevo seleccionado
        alumnos: [...currentIds, Number(selectedAlumnoId)],
      };

      const res = await inscribirAlumnosService(grupoId, payload, token);
      if (res.success) setGrupo(res.data);

      setSelectedAlumnoId("");
      onSuccess(); // Notificar a la página padre
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al inscribir al alumno",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAlumno = async (alumnoId: number) => {
    if (!token || !grupoId || !grupo) return;

    try {
      setLoading(true);
      setError(null);

      // Filtramos la lista actual para excluir al alumno que queremos quitar
      const updatedIds =
        grupo.alumnos
          ?.map((a) => a.id_usuario)
          .filter((id) => id !== alumnoId) || [];

      const payload = { alumnos: updatedIds };

      const res = await inscribirAlumnosService(grupoId, payload, token);
      if (res.success) setGrupo(res.data);

      onSuccess(); // Notificar a la página padre
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al quitar al alumno",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-neutral-800">
                Inscribir Alumnos
              </h3>
              <p className="text-neutral-500 font-medium">
                Grupo: {grupo?.grupo || "Cargando..."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 transition-colors"
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

          <form
            onSubmit={handleInscribir}
            className="flex flex-col sm:flex-row gap-3 mb-8"
          >
            <div className="flex-1">
              <select
                value={selectedAlumnoId}
                onChange={(e) => setSelectedAlumnoId(e.target.value)}
                className="w-full rounded-2xl bg-neutral-50 text-neutral-900 border border-neutral-200 px-5 py-3.5 outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-400 transition-all appearance-none"
                required
              >
                <option value="">Seleccionar alumno...</option>
                {allAlumnos
                  .filter(
                    (a) =>
                      !grupo?.alumnos?.some(
                        (ga) => ga.id_usuario === a.id_usuario,
                      ),
                  )
                  .map((a) => (
                    <option key={a.id_usuario} value={a.id_usuario}>
                      {a.usuario?.nombre} — {a.num_ctrl}
                    </option>
                  ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading || !selectedAlumnoId}
              className="px-8 py-3.5 bg-black text-white font-bold rounded-2xl hover:bg-neutral-800 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Añadiendo..." : "Inscribir"}
            </button>
          </form>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Alumnos Inscritos
            </h4>
            <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {grupo?.alumnos && grupo.alumnos.length > 0 ? (
                grupo.alumnos.map((a) => (
                  <div
                    key={a.id_usuario}
                    className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100"
                  >
                    <div>
                      <p className="font-bold text-neutral-800">
                        {a.usuario?.nombre}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveAlumno(a.id_usuario)}
                      disabled={loading}
                      className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90 disabled:opacity-50"
                      title="Quitar del grupo"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-neutral-100 rounded-3xl">
                  <p className="text-neutral-400 text-sm">
                    No hay alumnos inscritos en este grupo.
                  </p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 rounded-2xl border border-red-100 text-sm text-red-600 font-medium text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
