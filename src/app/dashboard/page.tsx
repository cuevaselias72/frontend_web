"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getMateriasService } from "@/lib/services/materias.service";
import { getAlumnosService } from "@/lib/services/alumnos.service";
import {
  getGruposService,
  getGrupoService,
} from "@/lib/services/grupos.service";
import { getMaestrosService } from "@/lib/services/maestros.service";

import { KpiCard } from "@/components/shared/KpiCard";
import { LineChartCard } from "@/components/features/dashboard/lineChartCard";
import { BarChartCard } from "@/components/features/dashboard/barChartCard";
import { PieChartCard } from "@/components/features/dashboard/pieChartCard";

// Types
import type { Materia } from "@/types/materias";
import type { Alumno } from "@/types/alumnos";
import type { Grupo, GrupoDetails } from "@/types/grupos";
import type { Maestro } from "@/types/maestros";

export default function DashboardPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);

  const [materias, setMaterias] = useState<Materia[]>([]);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [maestros, setMaestros] = useState<Maestro[]>([]);
  const [gruposDetails, setGruposDetails] = useState<GrupoDetails[]>([]);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        // Cargamos las listas principales
        const [matsRes, alumsRes, groupsRes, maesRes] = await Promise.all([
          getMateriasService(token),
          getAlumnosService(token),
          getGruposService(token),
          getMaestrosService(token),
        ]);

        if (matsRes.success) setMaterias(matsRes.data);
        if (alumsRes.success) setAlumnos(alumsRes.data);
        if (maesRes.success) setMaestros(maesRes.data);

        if (groupsRes.success) {
          setGrupos(groupsRes.data);
          // Para obtener el conteo de alumnos por materia, necesitamos los detalles de cada grupo
          const detailsPromises = groupsRes.data.map((g) =>
            getGrupoService(g.id_grupo, token),
          );
          const detailsResults = await Promise.all(detailsPromises);
          setGruposDetails(
            detailsResults.filter((r) => r.success).map((r) => r.data),
          );
        }
      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // 1. Histórico de Materias (Line Chart)
  const historicoMaterias = useMemo(() => {
    const conteoPorHora: Record<string, number> = {};

    materias.forEach((m: any) => {
      if (!m.created_at) return;
      const hora = new Date(m.created_at).getHours() + ":00";
      conteoPorHora[hora] = (conteoPorHora[hora] || 0) + 1;
    });

    const horas = Object.keys(conteoPorHora).sort();
    let acumulado = 0;
    const serieAcumulada = horas.map((h) => {
      acumulado += conteoPorHora[h];
      return acumulado;
    });

    return { labels: horas, data: serieAcumulada };
  }, [materias]);

  // 2. Alumnos por Materia (Bar Chart)
  const alumnosPorMateria = useMemo(() => {
    const countMap: Record<string, number> = {};
    gruposDetails.forEach((gd) => {
      const key = gd.materia?.materia || `Materia ${gd.id_materia}`;
      countMap[key] = (countMap[key] || 0) + (gd.alumnos?.length || 0);
    });
    return {
      labels: Object.keys(countMap),
      data: Object.values(countMap),
    };
  }, [gruposDetails]);

  // 3. Carga por Maestro (Bar Chart Horizontal)
  const cargaMaestros = useMemo(() => {
    const countMap: Record<string, number> = {};
    grupos.forEach((g) => {
      const key = g.maestro?.usuario?.nombre || `Maestro ${g.id_maestro}`;
      countMap[key] = (countMap[key] || 0) + 1;
    });
    return {
      labels: Object.keys(countMap),
      data: Object.values(countMap),
    };
  }, [grupos]);

  // 4. Distribución (Pie Chart)
  const distribucionData = useMemo(
    () => [
      { id: 0, value: materias.length, label: "Materias" },
      { id: 1, value: alumnos.length, label: "Alumnos" },
      { id: 2, value: grupos.length, label: "Grupos" },
      { id: 3, value: maestros.length, label: "Maestros" },
    ],
    [materias, alumnos, grupos, maestros],
  );

  // KPI: Promedio de materias por alumno
  const promedioMaterias = useMemo(() => {
    if (alumnos.length === 0) return "0";
    const totalInscripciones = gruposDetails.reduce(
      (acc, gd) => acc + (gd.alumnos?.length || 0),
      0,
    );
    return (totalInscripciones / alumnos.length).toFixed(1);
  }, [alumnos, gruposDetails]);

  if (loading) {
    return (
      <div className="p-6 space-y-8 bg-neutral-50 min-h-screen">
        {/* Encabezado Skeleton */}
        <div className="animate-pulse">
          <h2 className="text-2xl font-bold text-neutral-500 mb-2 animate-pulse">
            Cargando Panel de Control Académico...
          </h2>
          <div className="h-4 bg-neutral-300 rounded w-96"></div>
        </div>

        {/* 1. Fila de KPIs Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm animate-pulse"
            >
              <div className="h-4 bg-neutral-300 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-neutral-300 rounded w-1/3"></div>
            </div>
          ))}
        </div>

        {/* 2. Cuadrícula de Gráficas Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm h-80 flex flex-col animate-pulse"
            >
              <div className="h-6 bg-neutral-300 rounded w-1/3 mb-6"></div>
              {/* Espacio que simula el área de la gráfica */}
              <div className="flex-1 bg-neutral-100 rounded-lg w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-neutral-50 min-h-screen">
      {/* Encabezado */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">
          Panel de Control Académico
        </h2>
        <p className="text-neutral-500">
          Visualización en tiempo real de materias, alumnos y carga docente.
        </p>
      </div>

      {/* 1. Fila de KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <KpiCard title="Total de materias" value={materias.length} />
        <KpiCard
          title="Promedio de materias por alumno"
          value={promedioMaterias}
        />
        <KpiCard title="Total de alumnos" value={alumnos.length} />
      </div>

      {/* 2. Cuadrícula de Gráficas (2x2 en pantallas grandes) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fila 1 */}
        <BarChartCard
          title="Alumnos Inscritos por Materia"
          xAxisData={
            alumnosPorMateria.labels.length > 0
              ? alumnosPorMateria.labels
              : ["Sin datos"]
          }
          seriesData={
            alumnosPorMateria.data.length > 0 ? alumnosPorMateria.data : [0]
          }
        />

        <LineChartCard
          title="Crecimiento Histórico de Materias (Hoy)"
          xAxisData={
            historicoMaterias.labels.length > 0
              ? historicoMaterias.labels
              : ["00:00"]
          }
          seriesData={
            historicoMaterias.data.length > 0 ? historicoMaterias.data : [0]
          }
        />

        {/* Fila 2 */}
        <PieChartCard title="Distribución General" data={distribucionData} />

        {/* NUEVA GRÁFICA: Carga de maestros */}
        <BarChartCard
          title="Carga de Grupos por Maestro"
          xAxisData={
            cargaMaestros.labels.length > 0
              ? cargaMaestros.labels
              : ["Sin datos"]
          }
          seriesData={cargaMaestros.data.length > 0 ? cargaMaestros.data : [0]}
          horizontal
        />
      </div>
    </div>
  );
}
