import { ApiResponse } from './shared';

export interface Materia {
  id_materia: number;
  materia: string;
}

export interface CreateMateriaPayload {
  materia: string;
}

export type MateriasResponse = ApiResponse<Materia[]>;

export type MateriaResponse = ApiResponse<Materia>;

export type DeleteMateriaResponse = ApiResponse<[]>;