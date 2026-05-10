'use client';

import { ModalWrapper } from './ModalWrapper';
import { ModalDefaultBtn, ModalCloseBtn } from './ModalButtons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmationModal({
  isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar'
}: ConfirmationModalProps) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={title}>
      <div className="p-6">
        <p className="text-neutral-600">{message}</p>
      </div>
      <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex justify-end gap-3">
        <ModalCloseBtn onClick={onClose}>{cancelText}</ModalCloseBtn>
        <ModalDefaultBtn onClick={() => { onConfirm(); onClose(); }} className="bg-red-600 hover:bg-red-700">
          {confirmText}
        </ModalDefaultBtn>
      </div>
    </ModalWrapper>
  );
}

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  btnText?: string;
}

export function AlertModal({ isOpen, onClose, title, message, btnText = 'Entendido' }: AlertModalProps) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={title}>
      <div className="p-6">
        <p className="text-neutral-600">{message}</p>
      </div>
      <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex justify-end">
        <ModalDefaultBtn onClick={onClose}>{btnText}</ModalDefaultBtn>
      </div>
    </ModalWrapper>
  );
}