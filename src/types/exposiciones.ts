import { ApiResponse } from './shared';
import { Equipo } from './equipos';
import { Rubrica } from './rubricas';

export interface Exposicion {
  id_expo: number;
  tema: string;
  fecha: string;

  equipo?: Equipo;
  rubrica?: Rubrica;
}

export interface ExposicionEvaluacion {
  usuario?: {
    nombre: string;
  };

  observaciones?: string;
}

export interface ExposicionDetails extends Exposicion {
  evaluaciones?: ExposicionEvaluacion[];
}

export interface CreateExposicionPayload {
  id_equipo: number;
  id_rubrica: number;
  tema: string;
  fecha: string;
}

export interface UpdateExposicionPayload {
  tema?: string;
  fecha?: string;
  id_rubrica?: number;
}

export type ExposicionesResponse = ApiResponse<Exposicion[]>;

export type ExposicionResponse = ApiResponse<ExposicionDetails>;

export type CreateExposicionResponse = ApiResponse<Exposicion>;

export type DeleteExposicionResponse = ApiResponse<[]>;
