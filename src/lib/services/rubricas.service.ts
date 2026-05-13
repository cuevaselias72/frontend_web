import { API_URL } from "../api";
import type {
  CreateRubricaPayload,
  // ✨ Asegúrate de agregar UpdateRubricaPayload a tus types si no lo tienes
  RubricasResponse,
  RubricaResponse,
  DeleteRubricaResponse,
} from "@/types/rubricas";

// ... (getRubricas, getRubrica, createRubrica se quedan igual)

export async function getRubricasService(token: string): Promise<RubricasResponse> {
  const response = await fetch(`${API_URL}/rubricas`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener las rúbricas");
  }

  return data;
}

export async function getRubricaService(id: number, token: string): Promise<RubricaResponse> {
  const response = await fetch(`${API_URL}/rubricas/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener los detalles de la rúbrica");
  }

  return data;
}

export async function createRubricaService(
  payload: CreateRubricaPayload,
  token: string,
): Promise<RubricaResponse> {
  const response = await fetch(`${API_URL}/rubricas`, {
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
    throw new Error(data.message || "Error al crear la rúbrica");
  }

  return data;
}

// ✨ NUEVA FUNCIÓN: Update
export async function updateRubricaService(
  id: number,
  payload: any, // Puedes usar UpdateRubricaPayload si lo definiste
  token: string,
): Promise<RubricaResponse> {
  const response = await fetch(`${API_URL}/rubricas/${id}`, {
    method: "PUT", // O "PATCH", según prefieras (ambos funcionan según tu doc)
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar la rúbrica");
  }

  return data;
}

export async function deleteRubricaService(id: number, token: string): Promise<DeleteRubricaResponse> {
  const response = await fetch(`${API_URL}/rubricas/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al eliminar la rúbrica");
  }

  return data;
}