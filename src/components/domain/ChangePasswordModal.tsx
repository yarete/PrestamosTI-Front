import React, { useState, useEffect, useRef } from 'react';
import { X, Eye, EyeSlash } from 'react-bootstrap-icons';
import { Button } from '../ui/Button';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  userName: string;
  userRole: string;
  avatarUrl: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  userName,
  userRole,
  avatarUrl
}) => {
  const [showNew, setShowNew] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef}
      className="absolute top-full right-0 mt-4 bg-white rounded-3xl shadow-2xl p-8 w-[320px] z-50 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center border border-gray-100"
    >
      <button 
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
        
        <h2 className="text-xl font-bold text-gray-900 mb-6">Cambiar Contraseña</h2>
        
        <div className="w-16 h-16 bg-blue-100 border-[3px] border-[#0a2a5e] rounded-full flex items-center justify-center overflow-hidden mb-4 shadow-sm">
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-1">{userName}</h3>
        <p className="text-[10px] font-medium text-gray-400 mb-6 pb-6 border-b border-gray-100 w-full text-center">
          {userRole}
        </p>
        
        <div className="w-full flex flex-col gap-4 mb-8">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">
              Nueva Contraseña
            </label>
            <div className="relative">
              <input 
                type={showNew ? 'text' : 'password'}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium focus:border-gray-400 focus:ring-0 outline-none transition-all pr-10"
                placeholder="Escribe tu nueva contraseña"
              />
              <button 
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showNew ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">
              Repita Contraseña
            </label>
            <div className="relative">
              <input 
                type={showRepeat ? 'text' : 'password'}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium focus:border-gray-400 focus:ring-0 outline-none transition-all pr-10"
                placeholder="Repite tu nueva contraseña"
              />
              <button 
                type="button"
                onClick={() => setShowRepeat(!showRepeat)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showRepeat ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
        
        <Button 
          variant="primary" 
          className="w-full justify-center bg-[#0a2a5e] hover:bg-[#071d42] text-sm py-3 rounded-lg font-bold"
          onClick={(e) => { e.stopPropagation(); onSave(); }}
        >
          Editar Perfil
        </Button>
    </div>
  );
};
