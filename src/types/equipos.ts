import { ApiResponse, BasicUser, Timestamps } from './shared';
import { Grupo } from './grupos';

export interface EquipoIntegrante {
  id_usuario: number;
  nombre?: string;
  email?: string;
  usuario?: Pick<BasicUser, 'id_usuario' | 'nombre'>;
}

export interface Equipo extends Timestamps {
  id_equipo: number;
  id_grupo: number;
  equipo: string;
  active: boolean;

  grupo?: Grupo;
  integrantes?: EquipoIntegrante[];
}

export interface EquipoExposicion {
  id_expo: number;
  tema: string;
  fecha: string;
}

export interface EquipoDetails extends Equipo {
  exposiciones?: EquipoExposicion[];
}

export interface CreateEquipoPayload {
  id_grupo: number;
  equipo: string;
  alumnos: number[];
}

export interface UpdateEquipoIntegrantesPayload {
  alumnos: number[];
}

export type EquiposResponse = ApiResponse<Equipo[]>;

export type EquipoResponse = ApiResponse<EquipoDetails>;

export type CreateEquipoResponse = ApiResponse<Equipo>;

export type DeleteEquipoResponse = ApiResponse<[]>;