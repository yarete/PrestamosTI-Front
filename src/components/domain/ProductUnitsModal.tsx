import React, { useState, useEffect } from 'react';
import { Basket3, Dash, Plus, Trash, ChevronDown } from 'react-bootstrap-icons';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ConfirmModal } from '../ui/ConfirmModal';
import { useToast } from '../../contexts/ToastContext';

interface Unit {
  id: string;
  serial: string;
  status: 'Disponible' | 'Prestado' | 'Mantenimiento';
}

interface ProductUnitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

const STATUS_COLORS = {
  Disponible: 'bg-white text-[#0a2a5e] border-gray-200 hover:bg-gray-50',
  Prestado: 'bg-white text-[#0a2a5e] border-gray-200 hover:bg-gray-50',
  Mantenimiento: 'bg-white text-[#0a2a5e] border-gray-200 hover:bg-gray-50'
};

export const ProductUnitsModal: React.FC<ProductUnitsModalProps> = ({ isOpen, onClose, productName }) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { showToast } = useToast();

  // Initialize with some units for demonstration when opened
  useEffect(() => {
    if (isOpen && units.length === 0) {
      setUnits([
        { id: '1', serial: 'SRE-001', status: 'Disponible' },
        { id: '2', serial: 'SRE-002', status: 'Prestado' },
        { id: '3', serial: 'SRE-003', status: 'Mantenimiento' },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClick = () => setOpenDropdownId(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const updateQuantity = (delta: number) => {
    setUnits(prev => {
      if (delta > 0) {
        const newId = (prev.length > 0 ? Math.max(...prev.map(u => parseInt(u.id))) + 1 : 1).toString();
        return [...prev, { id: newId, serial: `SRE-00${newId}`, status: 'Disponible' }];
      } else {
        if (prev.length > 0) {
          return prev.slice(0, -1);
        }
        return prev;
      }
    });
  };

  const clearSerials = () => {
    setUnits(prev => prev.map(u => ({ ...u, serial: '' })));
  };

  const updateSerial = (id: string, newSerial: string) => {
    setUnits(prev => prev.map(u => u.id === id ? { ...u, serial: newSerial } : u));
  };

  const updateStatus = (id: string, newStatus: Unit['status']) => {
    setUnits(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
    setOpenDropdownId(null);
  };

  const toggleDropdown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenDropdownId(prev => prev === id ? null : id);
  };

  const handleSave = () => {
    setIsConfirmOpen(false);
    // Simulate API call
    setTimeout(() => {
      showToast('Se ha actualizado correctamente', 'success');
      onClose();
    }, 300);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Unidades Físicas"
        subtitle={`Gestiona y monitorea los seriales y estados de ${productName}`}
        icon={<Basket3 className="w-6 h-6" />}
      >
        <div className="flex flex-col h-full">
          {/* Top Controls */}
          <div className="px-8 py-5 flex justify-between items-center border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-700">Cantidad:</span>
              <div className="flex items-center bg-white border border-gray-200 rounded-md p-0.5 shadow-sm">
                <button 
                  onClick={() => updateQuantity(-1)}
                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                  disabled={units.length === 0}
                >
                  <Dash className="w-3 h-3" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-[#0a2a5e]">
                  {units.length}
                </span>
                <button 
                  onClick={() => updateQuantity(1)}
                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <Button variant="outline" icon={Trash} onClick={clearSerials} className="text-gray-500 hover:bg-gray-100 hover:text-gray-700 border-gray-200 shadow-sm py-1.5 px-3 text-xs">
              Limpiar seriales
            </Button>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[1fr_2fr_1.5fr] gap-4 px-8 py-3 bg-gray-100/80 text-xs font-semibold text-gray-500 uppercase tracking-wider mx-4 mt-4 rounded-t-xl">
            <div>Unidad</div>
            <div>Número Serial</div>
            <div>Estado</div>
          </div>

          {/* Table Body */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 max-h-[40vh]">
            <div className="flex flex-col border border-gray-100 rounded-b-xl border-t-0 bg-white mb-32">
              {units.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm font-medium">
                  No hay unidades registradas. Aumenta la cantidad para comenzar.
                </div>
              ) : (
                units.map((unit, index) => {
                  return (
                    <div 
                      key={unit.id} 
                      className={`grid grid-cols-[1fr_2fr_1.5fr] gap-4 px-4 py-3 items-center group transition-colors hover:bg-gray-50 ${
                        index !== units.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <div className="text-sm font-semibold text-gray-700">
                        Unidad #{unit.id}
                      </div>
                      
                      <div className="relative">
                        <input
                          type="text"
                          value={unit.serial}
                          onChange={(e) => updateSerial(unit.id, e.target.value)}
                          placeholder="Ingrese serial..."
                          className="w-full px-3 py-2 text-sm text-gray-800 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all outline-none font-mono placeholder:font-sans group-hover:border-gray-200"
                        />
                      </div>
                      
                      <div className="relative flex items-center justify-start">
                        <button
                          onClick={(e) => toggleDropdown(e, unit.id)}
                          className={`flex items-center justify-between w-full max-w-[140px] px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-sm ${STATUS_COLORS[unit.status]}`}
                        >
                          <span>{unit.status}</span>
                          <ChevronDown className="w-3 h-3 ml-2 opacity-70" />
                        </button>

                        {openDropdownId === unit.id && (
                          <div className="absolute top-full left-0 mt-1.5 w-full max-w-[160px] bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                            {(['Disponible', 'Prestado', 'Mantenimiento'] as const).map(status => (
                              <button
                                key={status}
                                onClick={() => updateStatus(unit.id, status)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                                  unit.status === status 
                                    ? 'bg-gray-100 text-gray-900' 
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                {status}
                                {unit.status === status && <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-gray-100 mt-auto flex justify-between items-center bg-white">
            <Button variant="outline" onClick={onClose} className="hover:bg-gray-50 text-gray-600 border-gray-200">
              Cerrar
            </Button>
            <Button variant="primary" onClick={() => setIsConfirmOpen(true)}>
              Guardar Cambios
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleSave}
      />
    </>
  );
};
