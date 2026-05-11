import { API_URL } from "../api";
import type {
  CreateMateriaPayload,
  UpdateMateriaPayload,
  MateriasResponse,
  MateriaResponse,
  CreateMateriaResponse,
  DeleteMateriaResponse,
} from "@/types/materias";

export async function getMateriasService(
  token: string,
): Promise<MateriasResponse> {
  const response = await fetch(`${API_URL}/materias`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener las materias");
  }

  return data;
}

export async function getMateriaService(
  id: number,
  token: string,
): Promise<MateriaResponse> {
  const response = await fetch(`${API_URL}/materias/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Error al obtener los detalles de la materia",
    );
  }

  return data;
}

export async function createMateriaService(
  payload: CreateMateriaPayload,
  token: string,
): Promise<CreateMateriaResponse> {
  const response = await fetch(`${API_URL}/materias`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al crear la materia");
  }

  return data;
}

export async function updateMateriaService(
  id: number,
  payload: UpdateMateriaPayload,
  token: string,
): Promise<MateriaResponse> {
  const response = await fetch(`${API_URL}/materias/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar la materia");
  }

  return data;
}

export async function deleteMateriaService(
  id: number,
  token: string,
): Promise<DeleteMateriaResponse> {
  const response = await fetch(`${API_URL}/materias/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al eliminar la materia");
  }

  return data;
}
