export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface ValidationErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}

export interface Timestamps {
  created_at: string | null;
  updated_at: string | null;
}

export interface BasicUser {
  id_usuario?: number;
  nombre: string;
  email?: string;
  id_rol?: number;
}