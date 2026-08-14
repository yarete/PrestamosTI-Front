import React from 'react';
import { Grid, Box, FileEarmarkText, FileText, BoxArrowRight } from 'react-bootstrap-icons';

export const Sidebar: React.FC<{ currentView: string; onViewChange: (v: string) => void }> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', icon: Grid, label: 'Inicio' },
    { id: 'loans', icon: FileText, label: 'Préstamos' },
    { id: 'catalog', icon: Box, label: 'Catálogo' },
    { id: 'templates', icon: FileEarmarkText, label: 'Plantillas' },
  ];

  return (
    <aside className="w-64 bg-[#0a2a5e] text-white flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 pb-2 flex flex-col items-center border-b border-[#1a3d75]">
        <img src="/covaoLOGO.png" alt="Covao Logo" className="w-32 mb-2" />
        <span className="text-xs font-semibold tracking-wider text-blue-200 mb-4">PRESTAMOS TI</span>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
              currentView === item.id 
                ? 'bg-[#1a3d75] border-l-4 border-blue-400' 
                : 'hover:bg-[#133369] text-gray-300 hover:text-white border-l-4 border-transparent'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4">
        <button className="flex items-center gap-3 px-6 py-3 w-full text-gray-300 hover:text-white hover:bg-[#133369] rounded transition-colors text-sm font-medium">
          <BoxArrowRight className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
