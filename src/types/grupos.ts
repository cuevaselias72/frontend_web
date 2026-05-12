import { ApiResponse, BasicUser } from "./shared";
import { Materia } from "./materias";

export interface GrupoMaestro {
  id_usuario: number;
  usuario: Pick<BasicUser, "nombre">;
}

export interface Grupo {
  id_grupo: number;
  id_materia: number;
  id_maestro: number;
  grupo: string;

  materia?: Materia;
  maestro?: GrupoMaestro;
}

export interface GrupoAlumno {
  id_usuario: number;
  usuario: Pick<BasicUser, "nombre">;
}

export interface GrupoDetails extends Grupo {
  alumnos: GrupoAlumno[];
}

export interface CreateGrupoPayload {
  id_materia: number;
  id_maestro: number;
  grupo: string;
}

export interface InscribirAlumnosPayload {
  alumnos: number[];
}

export type GruposResponse = ApiResponse<Grupo[]>;

export type GrupoResponse = ApiResponse<GrupoDetails>;

export type DeleteGrupoResponse = ApiResponse<[]>;

export type CreateGrupoResponse = ApiResponse<Grupo>;

export type InscribirAlumnosResponse = ApiResponse<GrupoDetails>;
