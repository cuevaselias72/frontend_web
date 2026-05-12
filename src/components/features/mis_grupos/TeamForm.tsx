'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

// ✨ IMPORTAMOS LOS SERVICIOS NECESARIOS
import { getGrupoService } from '@/lib/services/grupos.service';
import { getEquipoService, updateIntegrantesService } from '@/lib/services/equipos.service';

interface TeamFormProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any; // Recibe el equipo (data.id_equipo, data.id_grupo, etc.)
  onSuccess?: () => void;
}

export default function TeamForm({ isOpen, onClose, data, onSuccess }: TeamFormProps) {
  const { token } = useAuth();

  const [integranteSeleccionado, setIntegranteSeleccionado] = useState('');
  
  // Estados para los datos reales de la API
  const [integrantes, setIntegrantes] = useState<any[]>([]); // Los que ya están en el equipo
  const [alumnosGrupo, setAlumnosGrupo] = useState<any[]>([]); // Todos los del grupo
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✨ Cargar datos al abrir el modal
  useEffect(() => {
    if (isOpen && data && token) {
      const fetchData = async () => {
        try {
          setLoading(true);
          
          const idEquipo = data.id_equipo || data.id;
          const idGrupo = data.id_grupo;

          // Pedimos los detalles del equipo Y los alumnos del grupo al mismo tiempo
          const [resEquipo, resGrupo] = await Promise.all([
            getEquipoService(idEquipo, token),
            getGrupoService(idGrupo, token)
          ]);

          const detallesEquipo = resEquipo.data || resEquipo;
          const detallesGrupo = resGrupo.data || resGrupo;

          // Guardamos los integrantes actuales
          setIntegrantes(detallesEquipo.integrantes || []);
          // Guardamos todos los alumnos del grupo
          setAlumnosGrupo(detallesGrupo.alumnos || []);

        } catch (error) {
          console.error("Error al cargar los datos del equipo:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
      setIntegranteSeleccionado('');
    }
  }, [isOpen, data, token]);

  if (!isOpen) return null;

  // ✨ MAGIA: Filtramos para que en el select SOLO salgan los alumnos que NO están en el equipo
  const alumnosDisponibles = alumnosGrupo.filter(
    (alumno) => !integrantes.some((int) => int.id_usuario === alumno.id_usuario)
  );

  const handleAgregar = () => {
    if (!integranteSeleccionado) return;
    
    // Buscamos al alumno completo usando el ID seleccionado
    const alumno = alumnosGrupo.find(a => a.id_usuario.toString() === integranteSeleccionado);
    
    if (alumno && !integrantes.some(i => i.id_usuario === alumno.id_usuario)) {
      setIntegrantes([...integrantes, alumno]);
      setIntegranteSeleccionado(''); // Resetear el select
    }
  };

  const handleEliminar = (id_usuario: number) => {
    setIntegrantes(integrantes.filter(i => i.id_usuario !== id_usuario));
  };

  // ✨ GUARDAR CAMBIOS EN LA API
  const handleGuardar = async () => {
    if (!token || !data) return;

    try {
      setIsSubmitting(true);
      const idEquipo = data.id_equipo || data.id;

      // Armamos el payload con los puros IDs como exige tu backend
      const payload = {
        alumnos: integrantes.map(int => int.id_usuario)
      };

      await updateIntegrantesService(idEquipo, payload, token);
      
      if (onSuccess) onSuccess(); // Refrescar la tabla de atrás
      onClose(); // Cerrar el modal

    } catch (error: any) {
      alert(error.message || "Error al guardar los integrantes");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
        
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
          <h3 className="text-xl font-bold text-neutral-800">
            {data?.nombre || data?.equipo || 'Integrantes'}
          </h3>
          <button onClick={onClose} disabled={isSubmitting} className="text-neutral-400 hover:text-neutral-600 font-bold text-xl disabled:opacity-50">
            &times;
          </button>
        </div>

        {/* Cuerpo del modal */}
        <div className="p-6 space-y-6">
          
          {loading ? (
             <div className="py-8 text-center text-neutral-500 animate-pulse">Cargando datos del equipo...</div>
          ) : (
            <>
              {/* Controles para agregar */}
              <div className="flex gap-3 items-end">
                <div className="flex-1 space-y-1">
                  <label className="text-sm font-medium text-neutral-700">Seleccionar alumno</label>
                  <select 
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black focus:border-black transition-all bg-white"
                    value={integranteSeleccionado}
                    onChange={(e) => setIntegranteSeleccionado(e.target.value)}
                    disabled={isSubmitting || alumnosDisponibles.length === 0}
                  >
                    <option value="">
                      {alumnosDisponibles.length === 0 ? "No hay más alumnos disponibles" : "Seleccione un alumno..."}
                    </option>
                    {alumnosDisponibles.map((alumno) => (
                      <option key={alumno.id_usuario} value={alumno.id_usuario}>
                        {alumno.num_ctrl} - {alumno.usuario?.nombre || 'Sin nombre'}
                      </option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={handleAgregar}
                  disabled={!integranteSeleccionado || isSubmitting}
                  className="px-4 py-2 bg-black text-white rounded-xl hover:bg-neutral-800 transition-transform active:scale-95 whitespace-nowrap h-[42px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Agregar
                </button>
              </div>

              {/* Lista de Integrantes */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-neutral-700">Integrantes actuales</h4>
                <div className="border border-neutral-200 rounded-xl divide-y divide-neutral-100 max-h-48 overflow-y-auto">
                  {integrantes.length === 0 ? (
                    <p className="text-sm text-neutral-500 p-4 text-center">No hay integrantes en este equipo.</p>
                  ) : (
                    integrantes.map(integrante => (
                      <div key={integrante.id_usuario} className="flex justify-between items-center p-3 hover:bg-neutral-50 transition-colors">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-neutral-800">{integrante.usuario?.nombre || integrante.nombre || 'Sin nombre'}</span>
                          <span className="text-xs text-neutral-500">{integrante.num_ctrl}</span>
                        </div>
                        <button 
                          onClick={() => handleEliminar(integrante.id_usuario)}
                          disabled={isSubmitting}
                          className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Eliminar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 flex justify-end bg-neutral-50">
          <button 
            onClick={handleGuardar}
            disabled={loading || isSubmitting}
            className="px-6 py-2 bg-black text-white rounded-xl hover:bg-neutral-800 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>

      </div>
    </div>
  );
}