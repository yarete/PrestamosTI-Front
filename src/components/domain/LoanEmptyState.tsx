import React from 'react';
import { ClipboardX } from 'react-bootstrap-icons';

export const LoanEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-[#c0cbe1] mb-6">
        <ClipboardX strokeWidth={1} className="w-24 h-24" />
      </div>
      <h3 className="text-2xl font-bold text-[#0a2a5e] mb-3">
        No hay préstamos registrados
      </h3>
      <p className="text-gray-500 max-w-sm">
        Crea el primer préstamo asignando un equipo a un usuario
      </p>
    </div>
  );
};
