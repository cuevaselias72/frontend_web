'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getGrupoService } from '@/lib/services/grupos.service';
import { createEquipoService } from '@/lib/services/equipos.service'; // ✨ IMPORTAMOS EL SERVICIO DE EQUIPOS

interface GroupFormProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any; // Recibe el grupo (id_grupo, nombre, etc.)
  onSuccess?: () => void;
}

export default function GroupForm({ isOpen, onClose, data, onSuccess }: GroupFormProps) {
  const { token } = useAuth();

  // Estados para la API
  const [alumnosGrupo, setAlumnosGrupo] = useState<any[]>([]);
  const [loadingAlumnos, setLoadingAlumnos] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para la creación aleatoria
  const [cantidadIntegrantes, setCantidadIntegrantes] = useState('');

  // Estados para la creación personalizada
  const [nombreEquipoManual, setNombreEquipoManual] = useState(''); // ✨ NUEVO: Para el nombre del equipo
  const [noControlInput, setNoControlInput] = useState('');
  const [integrantesManuales, setIntegrantesManuales] = useState<any[]>([]);

  // ✨ EFECTO: Cargar alumnos al abrir el modal
  useEffect(() => {
    if (isOpen && data?.id_grupo && token) {
      const fetchAlumnos = async () => {
        try {
          setLoadingAlumnos(true);
          const response = await getGrupoService(data.id_grupo, token);
          const grupoDetalle = response.data || response;
          setAlumnosGrupo(grupoDetalle.alumnos || []);
        } catch (error) {
          console.error("Error al cargar los alumnos del grupo:", error);
        } finally {
          setLoadingAlumnos(false);
        }
      };

      fetchAlumnos();
      // Limpiamos los estados al abrir
      setIntegrantesManuales([]);
      setNoControlInput('');
      setCantidadIntegrantes('');
      setNombreEquipoManual('');
    }
  }, [isOpen, data, token]);

  if (!isOpen) return null;

  // --- FUNCIONES ---

  const handleCrearAleatorios = () => {
    // Si tu backend hace esto automático, aquí llamarías al servicio
    console.log('Creando equipos aleatorios de', cantidadIntegrantes, 'integrantes');
    alert("Función de equipos aleatorios pendiente de conectar al backend.");
  };

  const handleAñadirPersonalizado = () => {
    if (!noControlInput) return;
    
    // ✨ VALIDACIÓN: Buscar si el número de control existe en la lista del grupo
    const alumnoEncontrado = alumnosGrupo.find(a => a.num_ctrl === noControlInput);

    if (alumnoEncontrado) {
      // Evitar que metan al mismo alumno dos veces al equipo
      if (!integrantesManuales.some(int => int.num_ctrl === noControlInput)) {
        setIntegrantesManuales([...integrantesManuales, alumnoEncontrado]);
      } else {
        alert("Este alumno ya está en la lista de integrantes.");
      }
    } else {
      alert("No se encontró un alumno con ese número de control en este grupo.");
    }
    setNoControlInput(''); // Limpiar el input
  };

  const handleEliminarManual = (id_usuario: number) => {
    setIntegrantesManuales(integrantesManuales.filter(int => int.id_usuario !== id_usuario));
  };

  // ✨ CONEXIÓN A LA API: Crear el equipo personalizado
  const handleCrearEquipoPersonalizado = async () => {
    if (!nombreEquipoManual) {
      alert("Por favor, ingresa un nombre para el equipo.");
      return;
    }

    if (!token || !data?.id_grupo) return;

    try {
      setIsSubmitting(true);
      
      const payload = {
        id_grupo: data.id_grupo,
        equipo: nombreEquipoManual,
        // Extraemos solo los IDs de los usuarios para mandarlos al backend
        alumnos: integrantesManuales.map(int => int.id_usuario) 
      };

      await createEquipoService(payload, token);
      
      if (onSuccess) onSuccess(); // Recargamos la tabla principal
      onClose(); // Cerramos el modal

    } catch (error: any) {
      alert(error.message || "Error al crear el equipo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center relative">
          <h3 className="text-2xl font-semibold text-neutral-800 text-center w-full">
            {data?.nombre || data?.grupo || 'Administrar Grupo'}
          </h3>
          <button onClick={onClose} className="absolute right-6 text-neutral-400 hover:text-neutral-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 pb-6 overflow-y-auto space-y-6">
          
          {/* Info Grupo */}
          <div className="space-y-1 text-lg text-neutral-800">
            <p>{data?.materia?.materia || 'Materia'}</p>
            <p>Cantidad alumnos: {alumnosGrupo.length}</p>
          </div>

          {/* Tabla de Alumnos API */}
          <div className="text-sm">
            <div className="flex font-semibold text-neutral-800 mb-2 px-2">
              <div className="flex-1">Nombre</div>
              <div className="w-28 text-center">No control</div>
            </div>
            
            {loadingAlumnos ? (
              <div className="py-6 text-center text-neutral-500 animate-pulse">Cargando alumnos...</div>
            ) : (
              <div className="space-y-1 max-h-40 overflow-y-auto border-t border-b border-neutral-200 py-2">
                {alumnosGrupo.length === 0 ? (
                  <p className="text-center text-neutral-400 py-2 italic">Sin alumnos inscritos.</p>
                ) : (
                  alumnosGrupo.map(alumno => (
                    <div key={alumno.id_usuario} className="flex px-2 py-1.5 hover:bg-neutral-50 rounded text-neutral-700">
                      <div className="flex-1 truncate pr-2 leading-tight">{alumno.usuario?.nombre || 'Sin nombre'}</div>
                      <div className="w-28 text-center">{alumno.num_ctrl}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sección Aleatoria */}
          <div className="space-y-4 flex flex-col items-center pt-2">
            <div className="flex items-center justify-center gap-3 w-full">
              <label className="text-sm text-neutral-800 whitespace-nowrap font-medium">Cantidad de integrantes:</label>
              <input 
                type="number" 
                value={cantidadIntegrantes}
                onChange={(e) => setCantidadIntegrantes(e.target.value)}
                disabled={loadingAlumnos}
                className="w-32 bg-neutral-300/60 border-none rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <button 
              onClick={handleCrearAleatorios} 
              disabled={loadingAlumnos}
              className="px-5 py-1.5 border border-black rounded-full text-sm font-medium hover:bg-neutral-100 transition-colors disabled:opacity-50"
            >
              Crear equipos aleatorios
            </button>
          </div>

          <hr className="border-dashed border-neutral-300" />

          {/* Sección Personalizada */}
          <div className="space-y-5">
            <h4 className="text-center font-medium text-neutral-800">Crear equipo personalizado</h4>
            
            {/* Input para el Nombre del equipo */}
            <div className="flex items-center justify-center gap-3">
              <label className="text-sm text-neutral-800 whitespace-nowrap font-medium w-20 text-right">Nombre:</label>
              <input 
                type="text" 
                value={nombreEquipoManual}
                onChange={(e) => setNombreEquipoManual(e.target.value)}
                placeholder="Ej. Equipo Dinamita"
                disabled={loadingAlumnos || isSubmitting}
                className="flex-1 max-w-[200px] bg-neutral-300/60 border-none rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-black"
              />
              <div className="w-[84px]"></div> {/* Espaciador invisible para alinear */}
            </div>

            <div className="flex items-center justify-center gap-3">
              <label className="text-sm text-neutral-800 whitespace-nowrap font-medium w-20 text-right">No Control:</label>
              <input 
                type="text" 
                value={noControlInput}
                onChange={(e) => setNoControlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAñadirPersonalizado()}
                placeholder="Ej. 22030575"
                disabled={loadingAlumnos || isSubmitting}
                className="flex-1 max-w-[200px] bg-neutral-300/60 border-none rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-black"
              />
              <button 
                onClick={handleAñadirPersonalizado} 
                disabled={loadingAlumnos || isSubmitting}
                className="px-5 py-1.5 border border-black rounded-full text-sm font-medium hover:bg-neutral-100 transition-colors disabled:opacity-50"
              >
                Añadir
              </button>
            </div>

            {/* Lista y botón final alineados */}
            <div className="flex items-center gap-4">
              
              <div className="flex-1 text-sm bg-white border border-neutral-200 rounded-lg overflow-hidden">
                <div className="flex font-semibold text-neutral-800 mb-1 px-3 py-2 bg-neutral-50 border-b border-neutral-200">
                  <div className="flex-1">Nombre integrantes</div>
                  <div className="w-24 text-center">No control</div>
                  <div className="w-8"></div>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto p-1">
                  {integrantesManuales.length === 0 ? (
                    <p className="text-center text-neutral-400 py-2 italic text-xs">Sin integrantes</p>
                  ) : (
                    integrantesManuales.map(int => (
                      <div key={int.id_usuario} className="flex items-center px-2 py-1.5 hover:bg-neutral-50 rounded text-neutral-700">
                        <div className="flex-1 leading-tight truncate pr-2">{int.usuario?.nombre}</div>
                        <div className="w-24 text-center">{int.num_ctrl}</div>
                        <button 
                          onClick={() => handleEliminarManual(int.id_usuario)}
                          disabled={isSubmitting}
                          className="w-8 text-red-500 hover:text-red-700 flex justify-center p-1 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Eliminar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                <button 
                  onClick={handleCrearEquipoPersonalizado} 
                  disabled={integrantesManuales.length === 0 || !nombreEquipoManual || isSubmitting}
                  className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creando...' : 'Crear equipo'}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}