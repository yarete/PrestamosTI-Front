import React, { useEffect, useRef } from 'react';
import { X } from 'react-bootstrap-icons';

type ModalMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

const maxWidthClass: Record<ModalMaxWidth, string> = {
  sm:    'max-w-sm',
  md:    'max-w-md',
  lg:    'max-w-lg',
  xl:    'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  maxWidth?: ModalMaxWidth;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
  icon,
  maxWidth = '3xl',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    /*
     * Backdrop
     * – On mobile  : items-end  → sheet slides up from the bottom, full width, no side padding
     * – On sm+      : items-center → centered with horizontal padding
     * – On md+      : items-start + top padding → classic dialog position
     */
    <div
      className="
        fixed inset-0 z-50 flex
        items-end sm:items-center md:items-start
        justify-center
        bg-black/50 backdrop-blur-sm
        px-0 sm:px-4
        pt-0 md:pt-[8vh]
        animate-in fade-in duration-200
      "
      onClick={(e) => {
        // Close when clicking the backdrop (not the card itself)
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className={`
          bg-white flex flex-col
          w-full ${maxWidthClass[maxWidth]}
          shadow-2xl animate-in zoom-in-95 duration-200
          /* Mobile: bottom sheet – rounded only on top, nearly full height */
          rounded-t-2xl max-h-[92dvh]
          /* sm+: standard rounded card */
          sm:rounded-2xl sm:max-h-[88vh]
          /* md+: shrink vertical real estate a bit so title bar shows */
          md:max-h-[85vh]
        `}
      >
        {/* ── Header ── */}
        <div className="flex justify-between items-start p-4 sm:p-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {icon && (
              <div className="flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 bg-[#0a2a5e] text-white rounded-xl shadow-sm shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold text-[#0a2a5e] leading-tight truncate">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 line-clamp-2">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="ml-2 shrink-0 text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
};
