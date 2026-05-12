'use client';

import { useState } from 'react';
import { ConfirmationModal, AlertModal } from '@/components/shared/DefaultModals';

export default function DashboardPage() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  function handleDelete() {
    console.log("Elemento eliminado exitosamente");
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">Dashboard de Pruebas</h2>
        <p className="text-neutral-500">Prueba los componentes de UI aquí antes de integrarlos.</p>
      </div>

      <div className="flex flex-wrap gap-4 p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm">
        <button 
          onClick={() => setIsConfirmOpen(true)}
          className="px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-xl transition-colors"
        >
          Probar Confirmación (Borrar)
        </button>

        <button 
          onClick={() => setIsAlertOpen(true)}
          className="px-5 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium rounded-xl transition-colors"
        >
          Probar Alerta (Información)
        </button>
      </div>

      <ConfirmationModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar Alumno"
        message="¿Estás seguro de que deseas eliminar a este alumno? Esta acción no se puede deshacer y borrará todas sus calificaciones."
        confirmText="Sí, eliminar"
      />

      <AlertModal 
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        title="Actualización Exitosa"
        message="Las calificaciones del grupo han sido publicadas correctamente en el sistema."
        btnText="Aceptar"
      />
    </div>
  );
}