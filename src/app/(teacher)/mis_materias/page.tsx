'use client';

import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/shared/SearchBar';
import { OutlineButton } from '@/components/shared/FormElements';
import GroupForm from '@/components/features/mis_grupos/GroupForm';
import TeamForm from '@/components/features/mis_grupos/TeamForm';
import PresentationForm from '@/components/features/mis_grupos/PresentationForm';

import { useAuth } from '@/context/AuthContext';
import { getGruposService, getGrupoService } from '@/lib/services/grupos.service'; 
import { getEquiposService } from '@/lib/services/equipos.service'; 

export default function MateriasProfesorPage() {
  const { token, user } = useAuth(); 

  const [searchTerm, setSearchTerm] = useState('');
  const [materiaExpandida, setMateriaExpandida] = useState<number | null>(null);

  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);
  const [isTeamFormOpen, setIsTeamFormOpen] = useState(false);
  const [isPresentationFormOpen, setIsPresentationFormOpen] = useState(false);
  const [seleccionActual, setSeleccionActual] = useState<any>(null);

  const [materias, setMaterias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterias = async (isBackgroundRefresh = false) => {
    if (!token) return;
    
    try {
      if (!isBackgroundRefresh) setLoading(true);
      
      const [responseGrupos, responseEquipos] = await Promise.all([
        getGruposService(token),
        getEquiposService(token)
      ]);

      const todosLosGrupos = responseGrupos.data || [];
      const todosLosEquipos = responseEquipos.data || [];

      const userId = user?.id_usuario;
      const misGrupos = todosLosGrupos.filter((g: any) => 
        g.id_maestro === userId || g.maestro?.id_usuario === userId
      );

      const materiasAgrupadas: Record<number, any> = {};

      misGrupos.forEach((grupo: any) => {
        if (!grupo.materia) return; 

        const idMateria = grupo.materia.id_materia;

        if (!materiasAgrupadas[idMateria]) {
          materiasAgrupadas[idMateria] = {
            id_materia: idMateria,
            nombre: grupo.materia.materia,
            grupos_count: 0,
            alumnos_count: 0, 
            detallesCargados: false,
            grupos: []
          };
        }

        const equiposDelGrupo = todosLosEquipos.filter((eq: any) => eq.id_grupo === grupo.id_grupo);

        materiasAgrupadas[idMateria].grupos.push({
          id_grupo: grupo.id_grupo,
          nombre: grupo.grupo,
          alumnos_count: 0, 
          equipos: equiposDelGrupo 
        });

        materiasAgrupadas[idMateria].grupos_count += 1;
      });

      const nuevasMaterias = Object.values(materiasAgrupadas);

      setMaterias(prevMaterias => {
        return nuevasMaterias.map(nuevaMateria => {
          const materiaVieja = prevMaterias.find(m => m.id_materia === nuevaMateria.id_materia);

          if (materiaVieja && materiaVieja.detallesCargados) {
            const gruposConAlumnosGuardados = nuevaMateria.grupos.map((nuevoGrupo: any) => {
              const grupoViejo = materiaVieja.grupos.find((g: any) => g.id_grupo === nuevoGrupo.id_grupo);
              return {
                ...nuevoGrupo,
                alumnos_count: grupoViejo ? grupoViejo.alumnos_count : 0
              };
            });

            return {
              ...nuevaMateria,
              detallesCargados: true, 
              alumnos_count: materiaVieja.alumnos_count,
              grupos: gruposConAlumnosGuardados
            };
          }

          return nuevaMateria;
        });
      });

    } catch (err: any) {
      setError(err.message || 'Error al cargar las materias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterias(false); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  const materiasFiltradas = materias.filter(m => 
    m.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpandir = async (id_materia: number) => {
    if (materiaExpandida === id_materia) {
      setMateriaExpandida(null);
      return;
    }

    setMateriaExpandida(id_materia);

    const materiaActual = materias.find(m => m.id_materia === id_materia);
    
    if (!materiaActual || materiaActual.detallesCargados || !token) return;

    try {
      const promesas = materiaActual.grupos.map((g: any) => getGrupoService(g.id_grupo, token));
      const respuestas = await Promise.all(promesas);

      setMaterias(prevMaterias => prevMaterias.map(materia => {
        if (materia.id_materia !== id_materia) return materia;

        let totalAlumnos = 0;

        const gruposActualizados = materia.grupos.map((g: any, i: number) => {
          const grupoDetalle = respuestas[i].data || respuestas[i];
          const cantidad = grupoDetalle.alumnos ? grupoDetalle.alumnos.length : 0;
          totalAlumnos += cantidad;

          return {
            ...g,
            alumnos_count: cantidad,
          };
        });

        return {
          ...materia,
          grupos: gruposActualizados,
          alumnos_count: totalAlumnos,
          detallesCargados: true 
        };
      }));

    } catch (error) {
      console.error("Error al obtener detalles de los grupos", error);
    }
  };

  const handleAbrirModal = (tipo: 'grupo' | 'integrantes' | 'exposicion', data: any) => {
    setSeleccionActual(data);
    if (tipo === 'grupo') setIsGroupFormOpen(true);
    if (tipo === 'integrantes') setIsTeamFormOpen(true);
    if (tipo === 'exposicion') setIsPresentationFormOpen(true);
  };

  const handleSuccessModal = () => {
    fetchMaterias(true); 
  };

  if (loading) {
    return (
      <div className="p-6 flex flex-col space-y-4">
        <div className="w-10 h-10 border-4 border-neutral-200 border-t-black rounded-full animate-spin"></div>
        <p className="text-black font-bold">Cargando tus materias...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500 font-bold">Error: {error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-black tracking-tight">Materias</h2>
      </div>

      <div className="w-full md:w-1/2">
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar..." />
      </div>

      <div className="space-y-4">
        {materiasFiltradas.length === 0 ? (
           <p className="text-black font-medium p-4">No se encontraron materias.</p>
        ) : (
          materiasFiltradas.map((materia) => (
            <div key={materia.id_materia} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm transition-all">
              <div className="p-5 flex justify-between items-center bg-neutral-50">
                <div>
                  <h3 className="text-xl font-bold text-black">{materia.nombre}</h3>
                  <p className="text-sm text-black font-medium mt-1">
                    Grupos: {materia.grupos_count ?? (materia.grupos?.length || 0)}
                  </p>
                </div>
                <OutlineButton onClick={() => toggleExpandir(materia.id_materia)}>
                  {materiaExpandida === materia.id_materia ? 'Ocultar' : 'Ver detalle'}
                </OutlineButton>
              </div>

              {materiaExpandida === materia.id_materia && (
                <div className="p-5 border-t border-neutral-200 space-y-8 bg-white">
                  {materia.grupos && materia.grupos.map((grupo: any) => (
                    <div key={grupo.id_grupo} className="space-y-3">
                      <div className="flex justify-between items-end border-b border-neutral-100 pb-2">
                        <h4 className="font-bold text-lg text-black">
                          {grupo.nombre || grupo.grupo} 
                          <span className="text-sm font-bold text-black ml-4">
                            Alumnos: {!materia.detallesCargados ? 'Cargando...' : grupo.alumnos_count}
                          </span>
                        </h4>
                        <OutlineButton onClick={() => handleAbrirModal('grupo', grupo)} className="text-xs py-1 px-3">
                          Administrar grupo
                        </OutlineButton>
                      </div>

                      <div className="overflow-x-auto rounded-lg border border-neutral-300">
                        <table className="w-full text-sm text-left text-black">
                          <thead className="bg-neutral-200">
                            <tr>
                              <th className="px-4 py-2 font-bold border-b border-neutral-300">Equipos</th>
                              <th className="px-4 py-2 font-bold border-b border-neutral-300">Integrantes</th>
                              <th className="px-4 py-2 font-bold border-b border-neutral-300">Exposiciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200">
                            {grupo.equipos && grupo.equipos.length > 0 ? (
                              grupo.equipos.map((equipo: any) => (
                                <tr key={equipo.id_equipo || equipo.id} className="hover:bg-neutral-50">
                                  <td className="px-4 py-2 font-medium">{equipo.nombre || equipo.equipo}</td>
                                  <td className="px-4 py-2">
                                    <button onClick={() => handleAbrirModal('integrantes', equipo)} className="text-blue-600 font-bold hover:underline border border-neutral-300 px-2 py-1 rounded-md text-xs bg-white transition-colors">
                                      Ver integrantes
                                    </button>
                                  </td>
                                  <td className="px-4 py-2">
                                    <button onClick={() => handleAbrirModal('exposicion', equipo)} className="text-blue-600 font-bold hover:underline border border-neutral-300 px-2 py-1 rounded-md text-xs bg-white transition-colors">
                                      Ver Exposiciones
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={3} className="px-4 py-4 text-center text-black font-medium italic">No hay equipos en este grupo.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                  
                  {(!materia.grupos || materia.grupos.length === 0) && (
                    <p className="text-black font-medium text-center py-4 text-sm">No hay grupos asignados a esta materia.</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {isGroupFormOpen && <GroupForm isOpen={isGroupFormOpen} onClose={() => setIsGroupFormOpen(false)} data={seleccionActual} onSuccess={handleSuccessModal} />}
      {isTeamFormOpen && <TeamForm isOpen={isTeamFormOpen} onClose={() => setIsTeamFormOpen(false)} data={seleccionActual} onSuccess={handleSuccessModal} />}
      {isPresentationFormOpen && <PresentationForm isOpen={isPresentationFormOpen} onClose={() => setIsPresentationFormOpen(false)} data={seleccionActual} onSuccess={handleSuccessModal} />}
    </div>
  );
}