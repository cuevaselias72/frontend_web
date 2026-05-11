import { ApiResponse } from "./shared";

export interface Materia {
  id_materia: number;
  materia: string;
}

export interface CreatedMateria extends Materia {
  created_at: string;
  updated_at: string;
}

export interface CreateMateriaPayload {
  materia: string;
}

export interface UpdateMateriaPayload {
  materia: string;
}

export type MateriasResponse = ApiResponse<Materia[]>;

export type MateriaResponse = ApiResponse<Materia>;

export type CreateMateriaResponse = ApiResponse<CreatedMateria>;

export type DeleteMateriaResponse = ApiResponse<[]>;
