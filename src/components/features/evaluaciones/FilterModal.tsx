'use client';

import { useState } from 'react';
import { ModalWrapper } from '@/components/shared/ModalWrapper';
import { ModalDefaultBtn } from '@/components/shared/ModalButtons';

interface FiltrosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (materias: string[], estados: string[]) => void;
}

export function FiltrosModal({ isOpen, onClose, onApply }: FiltrosModalProps) {
  // Estados para guardar qué checkboxes están marcados
  const [materiasSeleccionadas, setMateriasSeleccionadas] = useState<string[]>([]);
  const [estadosSeleccionados, setEstadosSeleccionados] = useState<string[]>([]);

  // Opciones disponibles (luego podrían venir de tu API)
  const opcionesMaterias = ['Topicos web', 'Gestión de proyectos', 'Desarrollo movil', 'Ciberseguridad'];
  const opcionesEstados = ['Sin evaluar', 'Evaluado', 'En proceso'];

  // Función para marcar/desmarcar
  const toggleSelection = (item: string, listaActual: string[], setLista: (val: string[]) => void) => {
    if (listaActual.includes(item)) {
      setLista(listaActual.filter(i => i !== item));
    } else {
      setLista([...listaActual, item]);
    }
  };

  function handleApply() {
    onApply(materiasSeleccionadas, estadosSeleccionados);
    onClose();
  }

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Filtros">
      <div className="p-6 space-y-6">
        
        <div className="space-y-3">
          <h4 className="font-semibold text-lg text-neutral-800">Materia</h4>
          <div className="space-y-2">
            {opcionesMaterias.map((mat) => (
              <label key={mat} className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={materiasSeleccionadas.includes(mat)}
                  onChange={() => toggleSelection(mat, materiasSeleccionadas, setMateriasSeleccionadas)}
                  className="w-5 h-5 rounded border-neutral-300 text-neutral-800 focus:ring-neutral-800" 
                />
                <span className="text-neutral-700">{mat}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-lg text-neutral-800">Estado</h4>
          <div className="space-y-2">
            {opcionesEstados.map((estado) => (
              <label key={estado} className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={estadosSeleccionados.includes(estado)}
                  onChange={() => toggleSelection(estado, estadosSeleccionados, setEstadosSeleccionados)}
                  className="w-5 h-5 rounded border-neutral-300 text-neutral-800 focus:ring-neutral-800" 
                />
                <span className="text-neutral-700">{estado}</span>
              </label>
            ))}
          </div>
        </div>

      </div>

      <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex justify-end">
        <ModalDefaultBtn onClick={handleApply}>Aplicar Filtros</ModalDefaultBtn>
      </div>
    </ModalWrapper>
  );
}