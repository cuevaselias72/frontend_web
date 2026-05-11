import { API_URL } from '../api';
import type {
  CreateExposicionPayload,
  UpdateExposicionPayload,
  ExposicionesResponse,
  ExposicionResponse,
  CreateExposicionResponse,
  DeleteExposicionResponse,
} from '@/types/exposiciones';

export async function getExposicionesService(
  token: string
): Promise<ExposicionesResponse> {
  const response = await fetch(`${API_URL}/exposiciones`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener las exposiciones');
  }

  return data;
}

export async function getExposicionService(
  id: number,
  token: string
): Promise<ExposicionResponse> {
  const response = await fetch(`${API_URL}/exposiciones/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener los detalles de la exposición');
  }

  return data;
}

export async function createExposicionService(
  payload: CreateExposicionPayload,
  token: string
): Promise<CreateExposicionResponse> {
  const response = await fetch(`${API_URL}/exposiciones`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al programar la exposición');
  }

  return data;
}

export async function updateExposicionService(
  id: number,
  payload: UpdateExposicionPayload,
  token: string
): Promise<ExposicionResponse> {
  const response = await fetch(`${API_URL}/exposiciones/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al actualizar la exposición');
  }

  return data;
}

export async function deleteExposicionService(
  id: number,
  token: string
): Promise<DeleteExposicionResponse> {
  const response = await fetch(`${API_URL}/exposiciones/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al eliminar la exposición');
  }

  return data;
}