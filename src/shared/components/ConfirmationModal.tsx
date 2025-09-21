import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonColor?: 'red' | 'blue' | 'green' | 'orange';
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  confirmButtonColor = 'red'
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const getConfirmButtonStyles = () => {
    switch (confirmButtonColor) {
      case 'red':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'orange':
        return 'bg-[#FA8D28] hover:bg-[#D97C20] text-[#101010]';
      case 'blue':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'green':
        return 'bg-green-500 hover:bg-green-600 text-white';
      default:
        return 'bg-red-500 hover:bg-red-600 text-white';
    }
  };

  return (
    <div className="fixed inset-0 bg-[#10101080] flex items-center justify-center z-50">
      <div className="bg-white rounded-xl border border-[#C3C3C3] h-[152px] w-[266px]">
        <div className="pt-10 ">
          <h3 className="pl-8 font-karla font-medium text-[16px] leading-[100%] tracking-[0%] text-[#101010]">
            {title}
          </h3>
          {message && (
            <p className="text-sm text-gray-600 mb-6">
              {message}
            </p>
          )}
          <div className="flex justify-center gap-6 mt-[33px]">
            <button
              onClick={onCancel}
              className="h-5 w-16 px-2 border border-[#C3C3C3] rounded-sm text-[12px] font-karla text-[#101010] bg-[#0000000D] hover:bg-gray-300 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`h-5 w-auto px-2 border border-[#C3C3C3] rounded-sm text-[12px] font-karla text-[#101010] transition-colors ${getConfirmButtonStyles()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}