import React from 'react';
import { Button } from './Button';
import { Save } from 'react-bootstrap-icons';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Guardar cambios",
  subtitle = "¿Desea guardar los cambios?",
  icon = <Save className="w-8 h-8 text-[#0a2a5e]" />,
  confirmText = "Aceptar",
  cancelText = "Cancelar"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="shrink-0 pt-1">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0a2a5e] mb-1">
              {title}
            </h3>
            <p className="text-sm font-semibold text-gray-600">
              {subtitle}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="text-gray-600 border-gray-200 hover:bg-gray-50 min-w-[100px] justify-center font-bold text-sm py-2 px-4 rounded-lg">
            {cancelText}
          </Button>
          <Button variant="primary" onClick={onConfirm} className="bg-[#0a2a5e] hover:bg-[#071d42] min-w-[100px] justify-center font-bold text-sm py-2 px-4 rounded-lg">
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
