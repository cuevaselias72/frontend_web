import { API_URL } from '../api';

export async function getMisCalificacionesService(token: string) {
  const response = await fetch(`${API_URL}/mis-calificaciones`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al obtener calificaciones');
  return data;
}

export async function getEquipoDetalleService(id: number, token: string) {
  const response = await fetch(`${API_URL}/equipos/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al obtener detalle del equipo');
  return data; 
}