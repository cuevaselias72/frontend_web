import { API_URL } from "../api";
import type {
  CreateGrupoPayload,
  InscribirAlumnosPayload,
  GruposResponse,
  GrupoResponse,
  CreateGrupoResponse,
  DeleteGrupoResponse,
  InscribirAlumnosResponse,
} from "@/types/grupos";

export async function getGruposService(token: string): Promise<GruposResponse> {
  const response = await fetch(`${API_URL}/grupos`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener los grupos");
  }

  return data;
}

export async function createGrupoService(
  payload: CreateGrupoPayload,
  token: string,
): Promise<CreateGrupoResponse> {
  const response = await fetch(`${API_URL}/grupos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al crear el grupo");
  }

  return data;
}

export async function getGrupoService(
  id: number,
  token: string,
): Promise<GrupoResponse> {
  const response = await fetch(`${API_URL}/grupos/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener los detalles del grupo");
  }

  return data;
}

export async function deleteGrupoService(
  id: number,
  token: string,
): Promise<DeleteGrupoResponse> {
  const response = await fetch(`${API_URL}/grupos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al eliminar el grupo");
  }

  return data;
}

export async function inscribirAlumnosService(
  id: number,
  payload: InscribirAlumnosPayload,
  token: string,
): Promise<InscribirAlumnosResponse> {
  const response = await fetch(`${API_URL}/grupos/${id}/inscribir`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al inscribir alumnos al grupo");
  }

  return data;
}
