import React, { useMemo } from 'react';
import {
  Clock,
  Trash,
  Pencil,
  Eye,
  ArrowUpRight,
  Download,
} from 'react-bootstrap-icons';
import { type ITemplate } from '../../types/template.types';

interface TemplateCardProps {
  template: ITemplate;
  /** Opens PDF viewer in Preview tab */
  onPreview?: (template: ITemplate) => void;
  /** Opens PDF viewer in Edit mode */
  onPersonalize?: (template: ITemplate) => void;
  /** Opens create/edit form pre-filled with template data */
  onEdit?: (template: ITemplate) => void;
  /** Triggers delete confirmation */
  onDelete?: (template: ITemplate) => void;
  onDownload?: (template: ITemplate) => void;
}

/** Returns a human-readable relative timestamp like "Hace 3 días" */
function useRelativeTime(date: Date): string {
  return useMemo(() => {
    const now = Date.now();
    const diffMs = now - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays >= 1) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    if (diffHours >= 1) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffMins >= 1) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    return 'Hace un momento';
  }, [date]);
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onPreview,
  onPersonalize,
  onEdit,
  onDelete,
  onDownload,
}) => {
  const relativeTime = useRelativeTime(template.createdAt);

  return (
    <article
      className="
        bg-white rounded-xl overflow-hidden flex flex-col
        border border-gray-100
        shadow-[0_2px_12px_0_rgba(0,0,0,0.07)]
        hover:shadow-[0_6px_24px_0_rgba(10,42,94,0.13)]
        transition-shadow duration-300
      "
    >
      {/* ── Preview image area — click opens viewer in EDIT mode ── */}
      <div
        className="group relative w-full overflow-hidden bg-gray-100 cursor-pointer aspect-[4/3] shrink-0"
        onClick={() => onPersonalize?.(template)}
      >
        <img
          src={template.previewImageUrl}
          alt={`Vista previa de ${template.title}`}
          className="
            absolute inset-0 w-full h-full object-cover object-top
            transition-all duration-400
            group-hover:scale-105 group-hover:blur-[2px] group-hover:brightness-75
          "
          loading="lazy"
          draggable={false}
        />

        {/* Hover overlay */}
        <div className="
          absolute inset-0 flex flex-col items-center justify-center gap-2
          bg-[#0a2a5e]/40 backdrop-blur-[1px]
          opacity-0 group-hover:opacity-100
          transition-all duration-300
          pointer-events-none
        ">
          <div className="
            flex items-center justify-center
            w-14 h-14 rounded-full bg-white/20 border-2 border-white/60 shadow-lg
            scale-75 group-hover:scale-100
            transition-transform duration-300
          ">
            <Pencil className="w-6 h-6 text-white drop-shadow-md ml-1" />
          </div>
          <span className="
            text-white text-xs font-semibold tracking-wide drop-shadow-md
            translate-y-2 group-hover:translate-y-0
            opacity-0 group-hover:opacity-100
            transition-all duration-300 delay-75
          ">
            Personalizar
          </span>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-1">
          {template.title}
        </h3>

        <div className="flex items-center gap-1.5 text-gray-400">
          <Clock className="w-3 h-3 shrink-0" />
          <span className="text-xs">{relativeTime}</span>
        </div>

        {/* ── Action: Ver Más (View mode only) ── */}
        <button
          type="button"
          onClick={() => onPreview?.(template)}
          className="
            flex items-center gap-0.5 text-xs font-semibold w-fit
            text-[#0a2a5e] hover:text-blue-700
            cursor-pointer transition-colors
          "
        >
          Ver más
          <Eye className="w-3.5 h-3.5 ml-1" />
        </button>

        {/* ── Action bar ── */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">

            {/* Delete */}
            <button
              type="button"
              aria-label="Eliminar plantilla"
              title="Eliminar"
              onClick={() => onDelete?.(template)}
              className="
                group/btn flex items-center justify-center
                cursor-pointer w-8 h-8 rounded-md
                text-gray-400 hover:text-red-500 hover:bg-red-50
                active:scale-90
                transition-colors duration-200
              "
            >
              <Trash className="w-4 h-4 group-hover/btn:scale-[1.15] group-hover/btn:-rotate-6 transition-all duration-200" />
            </button>

            {/* Edit */}
            <button
              type="button"
              aria-label="Editar plantilla"
              title="Editar"
              onClick={() => onEdit?.(template)}
              className="
                group/btn flex items-center justify-center
                cursor-pointer w-8 h-8 rounded-md
                text-gray-400 hover:text-[#0a2a5e] hover:bg-blue-50
                active:scale-90
                transition-colors duration-200
              "
            >
              <Pencil className="w-4 h-4 group-hover/btn:scale-[1.15] group-hover/btn:-rotate-12 transition-all duration-200" />
            </button>
          </div>

          {/* Download */}
          <button
            type="button"
            aria-label="Descargar plantilla"
            onClick={() => onDownload?.(template)}
            className="
              flex items-center gap-1.5 px-3 py-1.5 rounded-md
              bg-[#0a2a5e] text-white text-xs font-semibold
              cursor-pointer
              hover:bg-[#1a3d75] active:scale-[0.97]
              transition-all duration-150 shadow-sm hover:shadow-md
            "
          >
            <Download className="w-3 h-3" />
            Descargar
          </button>
        </div>
      </div>
    </article>
  );
};
