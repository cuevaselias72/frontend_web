import { ApiResponse } from './shared';

export interface Criterio {
  id_criterios?: number;
  descripcion: string;
  porcentaje: number;
}

export interface Rubrica {
  id_rubrica: number;
  rubrica: string;
  criterios: Criterio[];
}

export interface CreateRubricaPayload {
  rubrica: string;
  criterios: {
    descripcion: string;
    porcentaje: number;
  }[];
}

export type RubricasResponse = ApiResponse<Rubrica[]>;

export type RubricaResponse = ApiResponse<Rubrica>;

export type DeleteRubricaResponse = ApiResponse<[]>;