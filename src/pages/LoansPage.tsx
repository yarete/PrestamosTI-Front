import { useState } from 'react';
import { Search, UpcScan, FileEarmarkText, Plus, Calendar, ChevronDown } from 'react-bootstrap-icons';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoansTable } from '../components/domain/LoansTable';
import { CreateLoanModal } from '../components/domain/CreateLoanModal';
import { DatePickerPopover } from '../components/ui/DatePickerPopover';
import { formatDate } from '../utils/date';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { type ILoan } from '../types/loan.types';

const mockLoans: ILoan[] = Array(8).fill(null).map((_, index) => ({
  id: `loan-${index}`,
  usuario: 'Yaret Gómez Carballo',
  producto: index === 0 ? 'Laptop Lenovo ThinkPad · 4' : 'Ver todos',
  fechaInicio: '17 Dic 2024',
  fechaLimite: '17 Dic 2024',
  estado: 'Activo',
}));

interface LoansPageProps {
  onViewChange: (v: string) => void;
}

export const LoansPage: React.FC<LoansPageProps> = ({ onViewChange }) => {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<Date | null>(null);

  return (
    <DashboardLayout currentView="loans" onViewChange={onViewChange}>
      <div className="flex flex-col gap-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-1 items-center gap-4 w-full sm:max-w-xl">
            <Input 
              icon={Search} 
              placeholder="Buscar..." 
              containerClassName="flex-1"
            />
            <Input 
              icon={UpcScan} 
              placeholder="Escanee el SKU aquí..." 
              containerClassName="flex-1"
            />
          </div>
          
          <div className="flex gap-4">
            <Button variant="outline" icon={FileEarmarkText} onClick={() => setIsSelectionMode(!isSelectionMode)}>
              Generar Reporte
            </Button>
            <Button variant="primary" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
              Añadir Préstamo
            </Button>
          </div>
        </div>

        {/* Tabs and Filters */}
        <div className="flex flex-col gap-2 mt-4">
          {/* Filter Tabs & Selects */}
          <div className="flex gap-4 mb-4 justify-between w-full">
            <div className="flex">
              <button className="px-4 py-2 text-sm font-semibold text-[#0a2a5e] border-b-2 border-[#0a2a5e]">
                Todos
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                Activos
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                Vencidos
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                Cancelados
              </button>
            </div>
            
            <div className="flex gap-2">
              <DatePickerPopover 
                initialDate={dateFilter}
                onApply={(date) => setDateFilter(date)}
              >
                <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-md text-gray-600 flex items-center gap-2 hover:bg-gray-50">
                  {dateFilter 
                    ? formatDate(dateFilter)
                    : 'Fecha'}
                  <Calendar className="w-3.5 h-3.5" />
                </button>
              </DatePickerPopover>

              <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-md text-gray-600 flex items-center gap-2 hover:bg-gray-50">
                Estado
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Table Header */}
          <div className={`grid gap-4 bg-gray-100/80 px-4 py-3 rounded-t-2xl text-xs font-semibold text-gray-500 mt-2 ${
            isSelectionMode ? 'grid-cols-[40px_2fr_1.5fr_1fr_1fr_1fr]' : 'grid-cols-[2fr_1.5fr_1fr_1fr_1fr]'
          }`}>
            {isSelectionMode && (
              <div className="flex items-center justify-center sm:justify-start">
                <input type="checkbox" className="rounded border-gray-300 text-[#0a2a5e] focus:ring-[#0a2a5e]" />
              </div>
            )}
            <div>Usuario</div>
            <div>Producto</div>
            <div>Fecha de inicio</div>
            <div>Fecha Límite</div>
            <div>Estado</div>
          </div>

          {/* Table Content */}
          <div className="min-h-[400px] flex flex-col">
            <LoansTable loans={mockLoans} isSelectionMode={isSelectionMode} />
          </div>
        </div>
      </div>
      
      <CreateLoanModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </DashboardLayout>
  );
};
