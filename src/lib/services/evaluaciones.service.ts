import { API_URL } from '../api';
import type {
  EvaluacionesResponse,
  EvaluacionResponse,
  CreateEvaluacionPayload,
  CreateEvaluacionResponse,
  DeleteEvaluacionResponse,
} from '@/types/evaluaciones';

export async function getEvaluacionesService(
  token: string
): Promise<EvaluacionesResponse> {
  const response = await fetch(`${API_URL}/evaluaciones`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al obtener evaluaciones');
  return data;
}

export async function getEvaluacionService(
  id: number,
  token: string
): Promise<EvaluacionResponse> {
  const response = await fetch(`${API_URL}/evaluaciones/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al obtener la evaluación');
  return data;
}

export async function createEvaluacionService(
  payload: CreateEvaluacionPayload,
  token: string
): Promise<CreateEvaluacionResponse> {
  const response = await fetch(`${API_URL}/evaluaciones`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al registrar la evaluación');
  return data;
}

export async function deleteEvaluacionService(
  id: number,
  token: string
): Promise<DeleteEvaluacionResponse> {
  const response = await fetch(`${API_URL}/evaluaciones/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al eliminar la evaluación');
  return data;
}