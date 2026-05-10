import { ApiResponse, BasicUser, Timestamps } from './shared';

export interface Maestro extends Timestamps {
  id_usuario: number;
  usuario: BasicUser;
}

export interface MaestroGrupo {
  id_grupo: number;
  materia: {
    nombre_materia: string;
  };
}

export interface MaestroDetails {
  id_usuario: number;
  usuario: BasicUser;
  grupos: MaestroGrupo[];
}

export interface CreateMaestroPayload {
  nombre: string;
  email: string;
  password: string;
  id_rol: number;
}

export interface UpdateMaestroPayload {
  nombre?: string;
  email?: string;
}

export type MaestrosResponse = ApiResponse<Maestro[]>;

export type MaestroResponse = ApiResponse<MaestroDetails>;

export type CreateMaestroResponse = ApiResponse<Maestro>;

export type DeleteMaestroResponse = ApiResponse<[]>;