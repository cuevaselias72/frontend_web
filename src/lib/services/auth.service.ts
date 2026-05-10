import { API_URL } from '../api';
import type {
  LoginPayload,
  LoginResponse,
  LogoutResponse,
} from '@/types/auth';

export async function loginService(
  payload: LoginPayload
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al iniciar sesión');
  }

  return data;
}

export async function logoutService(
  token: string
): Promise<LogoutResponse> {
  const response = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al cerrar sesión');
  }

  return data;
}