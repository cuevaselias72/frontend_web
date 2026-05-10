import { ApiResponse, BasicUser } from './shared';
import { Grupo } from './grupos';

export interface Alumno {
  id_usuario: number;
  num_ctrl: string;
  usuario: BasicUser;
}

export interface AlumnoDetails extends Alumno {
  grupos?: Grupo[];
  equipos?: unknown[];
}

export interface CreateAlumnoPayload {
  nombre: string;
  email: string;
  password: string;
  num_ctrl: string;
  id_rol: number;
}

export interface UpdateAlumnoPayload {
  nombre?: string;
  email?: string;
  num_ctrl?: string;
}

export type AlumnosResponse = ApiResponse<Alumno[]>;

export type AlumnoResponse = ApiResponse<AlumnoDetails>;

export type CreateAlumnoResponse = ApiResponse<Alumno>;

export type UpdateAlumnoResponse = ApiResponse<Alumno>;

export type DeleteAlumnoResponse = ApiResponse<[]>;