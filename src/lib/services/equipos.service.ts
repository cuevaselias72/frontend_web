import { API_URL } from '../api';
import type {
  CreateEquipoPayload,
  EquiposResponse,
  EquipoResponse,
  CreateEquipoResponse,
  DeleteEquipoResponse,
} from '@/types/equipos';

export async function getEquiposService(
  token: string
): Promise<EquiposResponse> {
  const response = await fetch(`${API_URL}/equipos`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener los equipos');
  }

  return data;
}

export async function getEquipoService(
  id: number,
  token: string
): Promise<EquipoResponse> {
  const response = await fetch(`${API_URL}/equipos/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener los detalles del equipo');
  }

  return data;
}

export async function createEquipoService(
  payload: CreateEquipoPayload,
  token: string
): Promise<CreateEquipoResponse> {
  const response = await fetch(`${API_URL}/equipos`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al crear el equipo');
  }

  return data;
}

export async function deleteEquipoService(
  id: number,
  token: string
): Promise<DeleteEquipoResponse> {
  const response = await fetch(`${API_URL}/equipos/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al eliminar el equipo');
  }

  return data;
}

export async function updateIntegrantesService(id: number, payload: any, token: string) {
  const response = await fetch(`${API_URL}/equipos/${id}/integrantes`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al actualizar los integrantes');
  return data;
}