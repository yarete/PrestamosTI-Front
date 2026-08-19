import { useState, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Pencil, Eye, FileEarmarkText, Trash } from 'react-bootstrap-icons';
import { type ILoan } from '../../types/loan.types';
import { Badge } from '../ui/Badge';

interface LoansTableProps {
  loans: ILoan[];
  isSelectionMode: boolean;
  selectedLoans?: string[];
  onToggleLoan?: (id: string) => void;
  onToggleAll?: () => void;
}

export const LoansTable = ({ loans, isSelectionMode, selectedLoans = [], onToggleLoan, onToggleAll }: LoansTableProps) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => {
      setLocalSelectedId(null);
      setOpenDropdownId(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleRowClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (isSelectionMode && onToggleLoan) {
      onToggleLoan(id);
    } else {
      setLocalSelectedId(localSelectedId === id ? null : id);
    }
    setOpenDropdownId(null);
  };

  return (
    <div className="flex flex-col w-full h-full justify-between bg-white border-x border-b border-gray-100 rounded-b-md relative pb-12">
      <div className="w-full">
        {loans.map((loan, index) => {
          const isSelected = isSelectionMode ? selectedLoans.includes(loan.id) : localSelectedId === loan.id;
          return (
          <div 
            key={loan.id} 
            onClick={(e) => handleRowClick(e, loan.id)}
            className={`grid gap-4 px-4 py-4 text-sm text-gray-700 items-center cursor-pointer transition-colors ${
              isSelected ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-slate-50'
            } ${index !== loans.length - 1 ? 'border-b border-gray-100' : ''} ${
              isSelectionMode ? 'grid-cols-[40px_2fr_1.5fr_1fr_1fr_1fr]' : 'grid-cols-[2fr_1.5fr_1fr_1fr_1fr]'
            }`}
          >
            {isSelectionMode && (
              <div className="flex items-center justify-center sm:justify-start" onClick={(e) => e.stopPropagation()}>
                <input 
                  type="checkbox" 
                  checked={isSelected}
                  onChange={() => onToggleLoan && onToggleLoan(loan.id)} 
                  className="rounded border-gray-300 text-[#0a2a5e] focus:ring-[#0a2a5e] w-4 h-4 cursor-pointer" 
                />
              </div>
            )}
            <div className="font-medium">{loan.usuario}</div>
            
            <div className="relative">
              {loan.producto === 'Ver todos' ? (
                <button 
                  onClick={(e) => toggleDropdown(e, loan.id)}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1.5 rounded-md text-xs font-medium text-gray-700"
                >
                  Ver todos
                  <ChevronDown className="w-3 h-3" />
                </button>
              ) : (
                <div className="inline-flex items-center bg-gray-100 px-3 py-1.5 rounded-md text-[10px] font-bold text-gray-800">
                  {loan.producto}
                </div>
              )}
              
              {/* Tooltip/Modal for "Ver todos" */}
              {openDropdownId === loan.id && (
                <div onClick={(e) => e.stopPropagation()} className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-10 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-[#0a2a5e]">Productos</span>
                    <button 
                      onClick={() => setOpenDropdownId(null)}
                      className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="bg-gray-100 rounded-lg p-2.5">
                        <div className="text-xs font-bold text-gray-800">Laptop Lenovo ThinkPad</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">Cantidad: 1</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-gray-500">{loan.fechaInicio}</div>
            <div className="text-gray-500">{loan.fechaLimite}</div>
            <div>
              <Badge variant={loan.estado === 'Activo' ? 'success' : loan.estado === 'Atrasado' ? 'danger' : 'default'}>
                {loan.estado}
              </Badge>
            </div>
          </div>
        )})}
      </div>

      {/* Floating Action Panel */}
      {selectedLoanId && (
        <div onClick={(e) => e.stopPropagation()} className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.15)] border border-gray-100 px-8 py-3.5 flex items-center gap-4 z-20 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#0a2a5e] hover:bg-gray-100 px-4 py-2 rounded-full transition-colors">
            <Pencil className="w-4 h-4" />
            Editar
          </button>
          <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#0a2a5e] hover:bg-gray-100 px-4 py-2 rounded-full transition-colors">
            <Eye className="w-4 h-4" />
            Ver Detalles
          </button>
          <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#0a2a5e] hover:bg-gray-100 px-4 py-2 rounded-full transition-colors">
            <FileEarmarkText className="w-4 h-4" />
            Reporte
          </button>
          <button className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-full transition-colors">
            <Trash className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex justify-between items-center p-6 border-t border-gray-100 mt-auto">
        <span className="text-sm text-gray-500 font-medium">Mostrando 5 de 5</span>
        <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
          <button className="p-1 text-gray-400 hover:text-gray-700 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>1 de 20</span>
          <button className="p-1 text-gray-400 hover:text-gray-700 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
