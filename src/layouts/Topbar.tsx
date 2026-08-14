import React, { useState, type ReactNode } from 'react';
import { Bell } from 'react-bootstrap-icons';
import { ProfileModal } from '../components/domain/ProfileModal';
import { ChangePasswordModal } from '../components/domain/ChangePasswordModal';
import { useToast } from '../contexts/ToastContext';

interface TopbarProps {
  title?: string;
  subtitle?: string;
  rightContent?: ReactNode;
}

export const Topbar: React.FC<TopbarProps> = ({ 
  title = "Prestamos", 
  subtitle = "Gestiona y monitorea tus préstamos de IT",
  rightContent
}) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const { showToast } = useToast();

  const handleChangePasswordClick = () => {
    setIsProfileModalOpen(false);
    setIsChangePasswordModalOpen(true);
  };

  const handleSavePassword = () => {
    setIsChangePasswordModalOpen(false);
    showToast('Contraseña actualizada correctamente', 'success');
  };

  const handleLogout = () => {
    setIsProfileModalOpen(false);
    showToast('Sesión cerrada correctamente', 'info');
  };

  const userName = "Admin User";
  const userRole = "IT Coordinator";
  const avatarUrl = `https://ui-avatars.com/api/?name=Admin+User&background=bfdbfe&color=1e3a8a`;

  return (
    <>
      <header className="flex justify-between items-center py-6 px-8 bg-white">
        <div>
          <h1 className="text-3xl font-bold text-[#0a2a5e]">{title}</h1>
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        </div>

        <div className="flex items-center gap-6">
          {rightContent}
          <button className="relative text-gray-500 hover:text-[#0a2a5e] transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="relative flex items-center">
            <button 
              className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity cursor-pointer"
              onClick={() => setIsProfileModalOpen(true)}
            >
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-none">{userName}</p>
                <p className="text-xs text-gray-500 mt-1">{userRole}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-gray-200">
                <img 
                  src={avatarUrl} 
                  alt="User Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
            
            <ProfileModal 
              isOpen={isProfileModalOpen}
              onClose={() => setIsProfileModalOpen(false)}
              onChangePassword={handleChangePasswordClick}
              onLogout={handleLogout}
              userName={userName}
              userRole={userRole}
              avatarUrl={avatarUrl}
            />

            <ChangePasswordModal
              isOpen={isChangePasswordModalOpen}
              onClose={() => setIsChangePasswordModalOpen(false)}
              onSave={handleSavePassword}
              userName={userName}
              userRole={userRole}
              avatarUrl={avatarUrl}
            />
          </div>
        </div>
      </header>
    </>
  );
};
