import { ApiResponse, Timestamps } from './shared';

export interface Role extends Timestamps {
  id_rol: number;
  nombre_rol: string;
}

export interface AuthUser extends Timestamps {
  id_usuario: number;
  nombre: string;
  email: string;
  id_rol: number;
  rol: Role;
}

export interface AuthData {
  token: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  nombre: string;
  email: string;
  password: string;
  password_confirmation: string;
  id_rol: number;
}

export type LoginResponse = ApiResponse<AuthData>;

export type RegisterResponse = ApiResponse<AuthData>;

export type LogoutResponse = ApiResponse<[]>;

export type MeResponse = ApiResponse<AuthUser>;