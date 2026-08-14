import React, { useEffect, useRef } from 'react';
import { X } from 'react-bootstrap-icons';
import { Button } from '../ui/Button';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
  userName: string;
  userRole: string;
  avatarUrl: string;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  onChangePassword, 
  onLogout,
  userName,
  userRole,
  avatarUrl 
}) => {
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
      className="absolute top-full right-0 mt-4 bg-white rounded-3xl shadow-2xl p-6 w-[280px] z-50 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center border border-gray-100"
    >
      <button 
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      
      <h2 className="text-lg font-bold text-gray-900 mb-6">Perfil</h2>
      
      <div className="w-20 h-20 bg-blue-100 border-[3px] border-[#0a2a5e] rounded-full flex items-center justify-center overflow-hidden mb-4 shadow-sm">
        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-1">{userName}</h3>
      <p className="text-xs font-medium text-gray-400 mb-8">{userRole}</p>
      
      <div className="w-full flex flex-col gap-3">
        <Button 
          variant="primary" 
          className="w-full justify-center bg-[#0a2a5e] hover:bg-[#071d42] text-sm py-2.5 rounded-lg font-bold"
          onClick={(e) => { e.stopPropagation(); onLogout(); }}
        >
          Cerrar Sesión
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-center text-gray-600 border-gray-200 hover:bg-gray-50 text-sm py-2.5 rounded-lg font-bold"
          onClick={(e) => { e.stopPropagation(); onChangePassword(); }}
        >
          Cambiar Contraseña
        </Button>
      </div>
    </div>
  );
};
