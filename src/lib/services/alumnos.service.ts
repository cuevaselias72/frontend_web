import { API_URL } from "../api";
import type {
  CreateAlumnoPayload,
  UpdateAlumnoPayload,
  AlumnosResponse,
  AlumnoResponse,
  CreateAlumnoResponse,
  DeleteAlumnoResponse,
} from "@/types/alumnos";

export async function getAlumnosService(
  token: string,
): Promise<AlumnosResponse> {
  const response = await fetch(`${API_URL}/alumnos`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener las alumnos");
  }

  return data;
}

export async function getAlumnoService(
  id: number,
  token: string,
): Promise<AlumnoResponse> {
  const response = await fetch(`${API_URL}/alumnos/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Error al obtener los detalles de la alumno",
    );
  }

  return data;
}

export async function createAlumnoService(
  payload: CreateAlumnoPayload,
  token: string,
): Promise<CreateAlumnoResponse> {
  const response = await fetch(`${API_URL}/alumnos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al crear la alumno");
  }

  return data;
}

export async function updateAlumnoService(
  id: number,
  payload: UpdateAlumnoPayload,
  token: string,
): Promise<AlumnoResponse> {
  const response = await fetch(`${API_URL}/alumnos/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar la alumno");
  }

  return data;
}

export async function deleteAlumnoService(
  id: number,
  token: string,
): Promise<DeleteAlumnoResponse> {
  const response = await fetch(`${API_URL}/alumnos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al eliminar la alumno");
  }

  return data;
}
