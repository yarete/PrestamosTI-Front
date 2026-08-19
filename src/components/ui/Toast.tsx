import React, { useEffect, useState } from 'react';
import { CheckLg, XCircle, InfoCircle, ExclamationTriangle, Trash } from 'react-bootstrap-icons';
import type { ToastType, ToastMessage } from '../../contexts/ToastContext';

export const Toast: React.FC<ToastMessage & { onRemove: (id: string) => void }> = ({
  id,
  type,
  message,
  onRemove,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to trigger animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const config: Record<ToastType, { icon: React.ReactNode; progressBg: string }> = {
    success: {
      icon: (
        <div className="w-8 h-8 rounded-full border-[2.5px] border-[#22c55e] flex items-center justify-center shrink-0">
          <CheckLg className="w-5 h-5 text-[#22c55e] stroke-[1]" />
        </div>
      ),
      progressBg: 'bg-[#15803d]',
    },
    delete: {
      icon: (
        <Trash className="w-8 h-8 text-[#dc2626] shrink-0" />
      ),
      progressBg: 'bg-[#b91c1c]',
    },
    error: {
      icon: <XCircle className="w-8 h-8 text-red-500 shrink-0" />,
      progressBg: 'bg-red-500',
    },
    warning: {
      icon: <ExclamationTriangle className="w-8 h-8 text-amber-500 shrink-0" />,
      progressBg: 'bg-amber-500',
    },
    info: {
      icon: <InfoCircle className="w-8 h-8 text-blue-500 shrink-0" />,
      progressBg: 'bg-blue-500',
    }
  };

  const { icon, progressBg } = config[type];

  return (
    <div 
      className={`pointer-events-auto bg-white rounded flex items-center gap-4 pl-4 pr-12 py-3.5 min-w-[280px] shadow-[0_4px_20px_0_rgb(0,0,0,0.1)] transition-all duration-300 transform overflow-hidden relative ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      {icon}
      <div className="flex-1 text-[15px] font-bold text-gray-800">
        {message}
      </div>
      <button 
        onClick={() => onRemove(id)}
        className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <span className="sr-only">Cerrar</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {/* Animated Progress Bar */}
      <div 
        className={`absolute bottom-0 right-0 h-[5px] ${progressBg} transition-all duration-[3000ms] ease-linear`}
        style={{ width: isVisible ? '0%' : '100%' }}
      />
    </div>
  );
};
