'use client';

import { useState } from 'react';

interface PresentationFormProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any; // Recibirá los datos del equipo
  onSuccess?: () => void;
}

export default function PresentationForm({ isOpen, onClose, data, onSuccess }: PresentationFormProps) {
  const [nombreExpo, setNombreExpo] = useState('');
  const [fechaExpo, setFechaExpo] = useState('');

  // Mock data para las exposiciones del equipo
  const [exposiciones, setExposiciones] = useState([
    { id: 1, nombre: 'Expo 1er parcial', calificaciones: '8.5, 9.3, 4.2', rubrica: 'Rúbrica base', final: 7.0 },
    { id: 2, nombre: 'Expo 2do parcial', calificaciones: '9.8, 8.8, 7.9', rubrica: 'Rúbrica avanzada', final: 8.4 },
  ]);

  if (!isOpen) return null;

  const handleAsignar = () => {
    if (!nombreExpo || !fechaExpo) return;
    setExposiciones([
      ...exposiciones, 
      { id: Date.now(), nombre: nombreExpo, calificaciones: '--', rubrica: 'Pendiente', final: 0 }
    ]);
    setNombreExpo('');
    setFechaExpo('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl max-h-[90vh] flex flex-col">
        
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
          <h3 className="text-xl font-bold text-neutral-800">Nombre equipo</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 font-bold text-xl">&times;</button>
        </div>

        {/* Cuerpo Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="space-y-1 text-sm text-neutral-600">
            <p><span className="font-semibold text-neutral-800">Nombre materia:</span> Tópicos Web</p>
            <p><span className="font-semibold text-neutral-800">Cantidad integrantes:</span> 4</p>
            <p><span className="font-semibold text-neutral-800">Cantidad exposiciones:</span> {exposiciones.length}</p>
          </div>

          {/* Tabla de exposiciones */}
          <div className="overflow-x-auto rounded-lg border border-neutral-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-100 text-neutral-600">
                <tr>
                  <th className="px-3 py-2 font-medium">Exposición</th>
                  <th className="px-3 py-2 font-medium">Calificaciones</th>
                  <th className="px-3 py-2 font-medium">Rúbrica</th>
                  <th className="px-3 py-2 font-medium">Final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {exposiciones.map((expo) => (
                  <tr key={expo.id} className="hover:bg-neutral-50">
                    <td className="px-3 py-2 font-medium text-neutral-800">{expo.nombre}</td>
                    <td className="px-3 py-2 text-xs text-neutral-500">{expo.calificaciones}</td>
                    <td className="px-3 py-2 text-xs">{expo.rubrica}</td>
                    <td className="px-3 py-2 font-bold">{expo.final > 0 ? expo.final : '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-right font-bold text-neutral-800">
            Promedio calificaciones: <span className="text-blue-600">7.7</span>
          </div>

          <hr className="border-dashed border-neutral-300" />

          {/* Formulario Asignar */}
          <div className="space-y-4">
            <h4 className="font-semibold text-neutral-800 text-center">Asignar nueva exposición</h4>
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-700">Nombre exposición:</label>
                <input 
                  type="text" 
                  value={nombreExpo} onChange={(e) => setNombreExpo(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black bg-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-700">Fecha:</label>
                <input 
                  type="date" 
                  value={fechaExpo} onChange={(e) => setFechaExpo(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black bg-white"
                />
              </div>
              <div className="flex justify-center pt-2">
                <button onClick={handleAsignar} className="px-4 py-2 border border-neutral-300 rounded-xl hover:bg-neutral-100 transition-colors text-sm font-medium">
                  Asignar exposición
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}