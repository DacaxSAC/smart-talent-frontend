import React from 'react';
import { ReusableButton } from './ReusableButton';

/**
 * Interfaz para definir un campo de información del usuario
 */
interface UserField {
  label: string;
  value: string | undefined;
}

/**
 * Props del componente ConfirmationModal
 */
interface ConfirmationModalProps {
  /** Controla si el modal está abierto */
  isOpen: boolean;
  /** Función para cerrar el modal */
  onClose: () => void;
  /** Función que se ejecuta al confirmar */
  onConfirm: () => void;
  /** Título del modal */
  title?: string;
  /** Array de campos a mostrar en el modal */
  fields: UserField[];
  /** Texto del botón de cancelar */
  cancelText?: string;
  /** Texto del botón de confirmar */
  confirmText?: string;
}

/**
 * Modal de confirmación reutilizable para mostrar detalles del usuario antes de crear/actualizar
 * @param props - Props del componente
 * @returns Componente ConfirmationModal
 */
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Detalles del nuevo cliente",
  fields,
  cancelText = "Regresar",
  confirmText = "Confirmar"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black-opacity-50 flex items-center justify-center z-50">
      <div className="p-6 w-auto flex flex-col gap-5 bg-white dark:bg-black text-black dark:text-white  rounded-lg shadow-lg  border border-medium dark:border-black-1">
        <h3 className="text-[16px] pb-1 border-b border-white-1 dark:border-black-1">
          {title}
        </h3>
        <div className="w-full flex flex-col gap-4">
          {fields.map((field, index) => (
            <div key={index} className="flex">
              <p className="min-w-[120px]">{field.label}</p>
              <p className="flex-1 border border-white-1 dark:border-black-1 rounded-[5px] px-2 text-end">
                {field.value || ''}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-around gap-4">
          <ReusableButton
            handleClick={onClose}
            text={cancelText}
            variant="tertiary"
            justify="start"
          />
          <ReusableButton
            handleClick={onConfirm}
            text={confirmText}
            variant="secondary"
            justify="start"
          />
        </div>
      </div>
    </div>
  );
};