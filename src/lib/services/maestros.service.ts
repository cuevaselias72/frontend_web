import { API_URL } from "../api";
import type {
  CreateMaestroPayload,
  UpdateMaestroPayload,
  MaestrosResponse,
  MaestroResponse,
  CreateMaestroResponse,
  DeleteMaestroResponse,
} from "@/types/maestros";

export async function getMaestrosService(
  token: string,
): Promise<MaestrosResponse> {
  const response = await fetch(`${API_URL}/maestros`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener las Maestros");
  }

  return data;
}

export async function getMaestroservice(
  id: number,
  token: string,
): Promise<MaestroResponse> {
  const response = await fetch(`${API_URL}/maestros/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Error al obtener los detalles de la Maestro",
    );
  }

  return data;
}

export async function createMaestroservice(
  payload: CreateMaestroPayload,
  token: string,
): Promise<CreateMaestroResponse> {
  const response = await fetch(`${API_URL}/maestros`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al crear la Maestro");
  }

  return data;
}

export async function updateMaestroservice(
  id: number,
  payload: UpdateMaestroPayload,
  token: string,
): Promise<MaestroResponse> {
  const response = await fetch(`${API_URL}/maestros/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar la Maestro");
  }

  return data;
}

export async function deleteMaestroservice(
  id: number,
  token: string,
): Promise<DeleteMaestroResponse> {
  const response = await fetch(`${API_URL}/maestros/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al eliminar la Maestro");
  }

  return data;
}
