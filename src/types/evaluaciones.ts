import { ApiResponse } from './shared';
import { Exposicion } from './exposiciones';

export interface EvaluacionCriterio {
  id_criterios?: number;
  nombre_criterio?: string;
}

export interface EvaluacionDetalle {
  id_detalle?: number;
  id_criterios?: number;

  calificacion: number;

  criterio?: EvaluacionCriterio;
}

export interface EvaluacionUsuario {
  id_usuario: number;
  nombre: string;
}

export interface Evaluacion {
  id_evaluacion: number;
  id_expo?: number;
  id_usuario?: number;

  observaciones?: string;
  fecha?: string;

  exposicion?: Exposicion;
  usuario?: EvaluacionUsuario;

  detalles?: EvaluacionDetalle[];
}

export interface CreateEvaluacionPayload {
  id_expo: number;
  id_usuario: number;
  observaciones?: string;

  calificaciones: {
    id_criterio: number;
    nota: number;
  }[];
}

export type EvaluacionesResponse = ApiResponse<Evaluacion[]>;

export type EvaluacionResponse = ApiResponse<Evaluacion>;

export type CreateEvaluacionResponse = ApiResponse<Evaluacion>;

export type DeleteEvaluacionResponse = ApiResponse<[]>;