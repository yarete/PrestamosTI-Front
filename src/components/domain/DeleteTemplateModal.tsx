import React from 'react';
import { Trash, FileEarmarkText, Clock } from 'react-bootstrap-icons';
import { Button } from '../ui/Button';
import { type ITemplate } from '../../types/template.types';

interface DeleteTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  template: ITemplate;
}

/** Formats a Date to a short locale string */
function formatDate(date: Date): string {
  return date.toLocaleDateString('es-CR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export const DeleteTemplateModal: React.FC<DeleteTemplateModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  template,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-[480px] animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Trash className="w-7 h-7 text-red-500 shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#0a2a5e]">
            Eliminar plantilla
          </h2>
        </div>

        <p className="text-gray-800 font-bold text-sm sm:text-[15px] mb-5">
          ¿Está seguro que desea eliminar esta plantilla?
        </p>

        {/* Template preview card */}
        <div className="w-full bg-white border border-gray-100 shadow-[0_2px_10px_0_rgb(0,0,0,0.05)] rounded-2xl p-4 flex gap-4 items-center mb-6">
          {/* Thumbnail */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={template.previewImageUrl}
              alt={template.title}
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <FileEarmarkText className="w-3.5 h-3.5 text-[#0a2a5e] shrink-0" />
              <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">
                {template.title}
              </h3>
            </div>

            {template.description && (
              <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                {template.description}
              </p>
            )}

            <div className="flex items-center gap-1 text-gray-400">
              <Clock className="w-3 h-3 shrink-0" />
              <span className="text-[11px]">{formatDate(template.createdAt)}</span>
            </div>
          </div>
        </div>


        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-5 text-gray-600 border-gray-200 font-semibold hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            className="px-6 bg-red-600 hover:bg-red-700 focus:ring-red-500 font-semibold"
          >
            Sí, eliminar
          </Button>
        </div>
      </div>
    </div>
  );
};
