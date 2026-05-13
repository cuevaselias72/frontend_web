'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getGrupoService } from '@/lib/services/grupos.service';
import { createEquipoService } from '@/lib/services/equipos.service'; 
import { AlertModal, ConfirmationModal } from '@/components/shared/DefaultModals'; // ✨ IMPORTAMOS TUS MODALES

interface GroupFormProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any; 
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
  const [nombreEquipoManual, setNombreEquipoManual] = useState('');
  const [noControlInput, setNoControlInput] = useState('');
  const [integrantesManuales, setIntegrantesManuales] = useState<any[]>([]);

  // ✨ ESTADOS PARA MODALES
  const [alertConfig, setAlertConfig] = useState({ open: false, title: '', message: '' });
  const [confirmConfig, setConfirmConfig] = useState<{ open: boolean; title: string; message: string; action: (() => void) | null }>({ 
    open: false, 
    title: '', 
    message: '', 
    action: null 
  });

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
      setIntegrantesManuales([]);
      setNoControlInput('');
      setCantidadIntegrantes('');
      setNombreEquipoManual('');
    }
  }, [isOpen, data, token]);

  if (!isOpen) return null;

  // --- FUNCIONES ALEATORIAS ---

  // Helper para revolver (shuffle) un arreglo
  const mezclarArreglo = (array: any[]) => {
    const nuevoArreglo = [...array];
    for (let i = nuevoArreglo.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nuevoArreglo[i], nuevoArreglo[j]] = [nuevoArreglo[j], nuevoArreglo[i]];
    }
    return nuevoArreglo;
  };

  const handlePreCrearAleatorios = () => {
    const tamano = parseInt(cantidadIntegrantes);
    
    if (!tamano || tamano <= 0) {
      setAlertConfig({ open: true, title: 'Error', message: 'Por favor, ingresa una cantidad válida de integrantes.' });
      return;
    }
    if (alumnosGrupo.length === 0) {
      setAlertConfig({ open: true, title: 'Grupo vacío', message: 'No hay alumnos en este grupo para formar equipos.' });
      return;
    }
    if (tamano > alumnosGrupo.length) {
      setAlertConfig({ open: true, title: 'Error', message: 'La cantidad de integrantes por equipo no puede ser mayor al total de alumnos en el grupo.' });
      return;
    }

    const numeroEquipos = Math.ceil(alumnosGrupo.length / tamano);

    setConfirmConfig({
      open: true,
      title: 'Crear Equipos Aleatorios',
      message: `Se crearán aproximadamente ${numeroEquipos} equipo(s). ¿Deseas continuar?`,
      action: () => generarEquiposAleatorios(tamano)
    });
  };

  const generarEquiposAleatorios = async (tamano: number) => {
    if (!token || !data?.id_grupo) return;

    try {
      setIsSubmitting(true);
      
      const alumnosMezclados = mezclarArreglo(alumnosGrupo);
      const chunks = [];
      
      // Partimos el arreglo en pedacitos (chunks) del tamaño especificado
      for (let i = 0; i < alumnosMezclados.length; i += tamano) {
        chunks.push(alumnosMezclados.slice(i, i + tamano));
      }

      // Creamos un array de promesas para mandar todos los equipos al backend
      const promesas = chunks.map((chunk, index) => {
        // Generamos un ID corto aleatorio para evitar nombres duplicados
        const randomId = Math.floor(1000 + Math.random() * 9000);
        return createEquipoService({
          id_grupo: data.id_grupo,
          equipo: `Equipo ${randomId}`,
          alumnos: chunk.map((a: any) => a.id_usuario)
        }, token);
      });

      await Promise.all(promesas);

      setAlertConfig({ open: true, title: 'Éxito', message: 'Equipos aleatorios generados correctamente.' });
      if (onSuccess) onSuccess();
      onClose();

    } catch (error: any) {
      setAlertConfig({ open: true, title: 'Error', message: error.message || 'Hubo un problema al crear los equipos aleatorios.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- FUNCIONES MANUALES ---

  const handleAñadirPersonalizado = () => {
    if (!noControlInput) return;
    
    const alumnoEncontrado = alumnosGrupo.find(a => a.num_ctrl === noControlInput);

    if (alumnoEncontrado) {
      if (!integrantesManuales.some(int => int.num_ctrl === noControlInput)) {
        setIntegrantesManuales([...integrantesManuales, alumnoEncontrado]);
      } else {
        setAlertConfig({ open: true, title: 'Atención', message: 'Este alumno ya está en la lista de integrantes.' });
      }
    } else {
      setAlertConfig({ open: true, title: 'No encontrado', message: 'No se encontró un alumno con ese número de control en este grupo.' });
    }
    setNoControlInput('');
  };

  const handleEliminarManual = (id_usuario: number) => {
    setIntegrantesManuales(integrantesManuales.filter(int => int.id_usuario !== id_usuario));
  };

  const handleCrearEquipoPersonalizado = async () => {
    if (!nombreEquipoManual) {
      setAlertConfig({ open: true, title: 'Campos incompletos', message: 'Por favor, ingresa un nombre para el equipo.' });
      return;
    }

    if (!token || !data?.id_grupo) return;

    try {
      setIsSubmitting(true);
      
      const payload = {
        id_grupo: data.id_grupo,
        equipo: nombreEquipoManual,
        alumnos: integrantesManuales.map(int => int.id_usuario) 
      };

      await createEquipoService(payload, token);
      
      if (onSuccess) onSuccess(); 
      setAlertConfig({ open: true, title: 'Éxito', message: 'Equipo creado correctamente.' });
      onClose(); 

    } catch (error: any) {
      setAlertConfig({ open: true, title: 'Error', message: error.message || "Error al crear el equipo" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl max-h-[90vh] flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-4 flex justify-between items-center border-b border-neutral-200">
            <h3 className="text-2xl font-bold text-black text-center w-full">
              {data?.nombre || data?.grupo || 'Administrar Grupo'}
            </h3>
            <button onClick={onClose} className="absolute right-6 text-neutral-400 hover:text-black font-bold text-xl">
              &times;
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="px-6 py-6 overflow-y-auto space-y-6">
            
            {/* Info Grupo */}
            <div className="space-y-1 text-lg text-black font-medium">
              <p>{data?.materia?.materia || 'Materia'}</p>
              <p>Cantidad alumnos: {alumnosGrupo.length}</p>
            </div>

            {/* Tabla de Alumnos API */}
            <div className="text-sm">
              <div className="flex font-bold text-black mb-2 px-2 border-b border-neutral-200 pb-2">
                <div className="flex-1">Nombre</div>
                <div className="w-28 text-center">No control</div>
              </div>
              
              {loadingAlumnos ? (
                <div className="py-6 text-center text-black font-bold animate-pulse">Cargando alumnos...</div>
              ) : (
                <div className="space-y-1 max-h-40 overflow-y-auto py-2">
                  {alumnosGrupo.length === 0 ? (
                    <p className="text-center text-black font-medium py-2 italic">Sin alumnos inscritos.</p>
                  ) : (
                    alumnosGrupo.map(alumno => (
                      <div key={alumno.id_usuario} className="flex px-2 py-1.5 hover:bg-neutral-50 rounded text-black font-medium">
                        <div className="flex-1 truncate pr-2 leading-tight">{alumno.usuario?.nombre || 'Sin nombre'}</div>
                        <div className="w-28 text-center">{alumno.num_ctrl}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Sección Aleatoria */}
            <div className="space-y-4 flex flex-col items-center pt-4 border-t border-dashed border-neutral-300">
              <div className="flex items-center justify-center gap-3 w-full">
                <label className="text-sm text-black whitespace-nowrap font-bold">Cantidad de integrantes:</label>
                <input 
                  type="number" 
                  value={cantidadIntegrantes}
                  onChange={(e) => setCantidadIntegrantes(e.target.value)}
                  disabled={loadingAlumnos || isSubmitting}
                  className="w-32 bg-white border border-neutral-300 rounded-md px-3 py-1.5 text-black outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <button 
                onClick={handlePreCrearAleatorios} 
                disabled={loadingAlumnos || isSubmitting || !cantidadIntegrantes}
                className="px-6 py-2 bg-black text-white rounded-full text-sm font-bold hover:bg-neutral-800 transition-all disabled:opacity-50"
              >
                Crear equipos aleatorios
              </button>
            </div>

            <hr className="border-dashed border-neutral-300" />

            {/* Sección Personalizada */}
            <div className="space-y-5">
              <h4 className="text-center font-bold text-black">Crear equipo personalizado</h4>
              
              <div className="flex items-center justify-center gap-3">
                <label className="text-sm text-black whitespace-nowrap font-bold w-20 text-right">Nombre:</label>
                <input 
                  type="text" 
                  value={nombreEquipoManual}
                  onChange={(e) => setNombreEquipoManual(e.target.value)}
                  placeholder="Ej. Equipo Dinamita"
                  disabled={loadingAlumnos || isSubmitting}
                  className="flex-1 max-w-[200px] bg-white border border-neutral-300 text-black rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-black"
                />
                <div className="w-[84px]"></div> 
              </div>

              <div className="flex items-center justify-center gap-3">
                <label className="text-sm text-black whitespace-nowrap font-bold w-20 text-right">No Control:</label>
                <input 
                  type="text" 
                  value={noControlInput}
                  onChange={(e) => setNoControlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAñadirPersonalizado()}
                  placeholder="Ej. 22030575"
                  disabled={loadingAlumnos || isSubmitting}
                  className="flex-1 max-w-[200px] bg-white border border-neutral-300 text-black rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-black"
                />
                <button 
                  onClick={handleAñadirPersonalizado} 
                  disabled={loadingAlumnos || isSubmitting}
                  className="px-5 py-1.5 bg-black text-white rounded-full text-sm font-bold hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  Añadir
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 text-sm bg-white border border-neutral-300 rounded-lg overflow-hidden">
                  <div className="flex font-bold text-black mb-1 px-3 py-2 bg-neutral-100 border-b border-neutral-300">
                    <div className="flex-1">Nombre integrantes</div>
                    <div className="w-24 text-center">No control</div>
                    <div className="w-8"></div>
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto p-1">
                    {integrantesManuales.length === 0 ? (
                      <p className="text-center text-black font-medium py-2 italic text-xs">Sin integrantes</p>
                    ) : (
                      integrantesManuales.map(int => (
                        <div key={int.id_usuario} className="flex items-center px-2 py-1.5 hover:bg-neutral-50 rounded text-black font-medium">
                          <div className="flex-1 leading-tight truncate pr-2">{int.usuario?.nombre}</div>
                          <div className="w-24 text-center">{int.num_ctrl}</div>
                          <button 
                            onClick={() => handleEliminarManual(int.id_usuario)}
                            disabled={isSubmitting}
                            className="w-8 text-red-600 hover:text-red-800 font-bold flex justify-center p-1 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                            title="Eliminar"
                          >
                            &times;
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
                    className="px-6 py-2 bg-black text-white rounded-full text-sm font-bold hover:bg-neutral-800 transition-colors whitespace-nowrap disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creando...' : 'Crear equipo'}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* MODALES CUSTOM */}
      <AlertModal 
        isOpen={alertConfig.open}
        onClose={() => setAlertConfig({ ...alertConfig, open: false })}
        title={alertConfig.title}
        message={alertConfig.message}
      />

      <ConfirmationModal 
        isOpen={confirmConfig.open}
        onClose={() => setConfirmConfig({ ...confirmConfig, open: false })}
        onConfirm={() => {
          if (confirmConfig.action) confirmConfig.action();
        }}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText="Sí, crear"
      />
    </>
  );
}