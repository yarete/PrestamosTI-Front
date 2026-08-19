import { useState } from 'react';
import { Search, UpcScan, FileEarmarkText, Plus, Calendar } from 'react-bootstrap-icons';
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
  usuario: index % 2 === 0 ? 'Yaret Gómez Carballo' : 'Juan Perez',
  producto: index === 0 ? 'Laptop Lenovo ThinkPad · 4' : 'Ver todos',
  fechaInicio: new Date(2024, 11, 10 + index).toISOString(),
  fechaLimite: new Date(2024, 11, 17 + index).toISOString(),
  estado: index % 3 === 0 ? 'Activo' : index % 3 === 1 ? 'Vencido' : 'Cancelado',
}));

interface LoansPageProps {
  onViewChange: (v: string) => void;
}

export const LoansPage: React.FC<LoansPageProps> = ({ onViewChange }) => {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Filters
  const [activeTab, setActiveTab] = useState<'Todos' | 'Activos' | 'Vencidos' | 'Cancelados'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  // Selection
  const [selectedLoans, setSelectedLoans] = useState<string[]>([]);

  const handleToggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedLoans([]); // Clear selection when exiting mode
    }
  };

  // Filtered Loans
  const filteredLoans = mockLoans.filter(loan => {
    // Tab Filter
    if (activeTab === 'Activos' && loan.estado !== 'Activo') return false;
    if (activeTab === 'Vencidos' && loan.estado !== 'Vencido' && loan.estado !== 'Atrasado') return false;
    if (activeTab === 'Cancelados' && loan.estado !== 'Cancelado' && loan.estado !== 'Devuelto') return false;

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!loan.usuario.toLowerCase().includes(q) && !loan.producto.toLowerCase().includes(q)) {
        return false;
      }
    }

    // Date Filters (Filtering by fechaInicio for "From" and fechaLimite for "To", or just generally overlapping)
    // The user requested: "fecha de inicio: y ahi se elige el rango" "fecha de finalización y ahí se elige el rango"
    // Let's implement DateFrom as (loans starting on or after) and DateTo as (loans ending on or before)
    if (dateFrom) {
      const start = new Date(loan.fechaInicio);
      if (start < dateFrom) return false;
    }
    if (dateTo) {
      const end = new Date(loan.fechaLimite);
      if (end > dateTo) return false;
    }

    return true;
  });

  const handleToggleLoan = (id: string) => {
    setSelectedLoans(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    if (selectedLoans.length === filteredLoans.length) {
      setSelectedLoans([]);
    } else {
      setSelectedLoans(filteredLoans.map(l => l.id));
    }
  };

  return (
    <DashboardLayout currentView="loans" onViewChange={onViewChange}>
      <div className="flex flex-col gap-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-1 items-center gap-4 w-full sm:max-w-xl">
            <Input 
              icon={Search} 
              placeholder="Buscar por usuario o producto..." 
              containerClassName="flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Input 
              icon={UpcScan} 
              placeholder="Escanee el SKU aquí..." 
              containerClassName="flex-1"
            />
          </div>
          
          <div className="flex gap-4">
            <Button variant={isSelectionMode ? "primary" : "outline"} icon={FileEarmarkText} onClick={handleToggleSelectionMode}>
              Generar Reporte {selectedLoans.length > 0 && `(${selectedLoans.length})`}
            </Button>
            <Button variant="primary" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
              Añadir Préstamo
            </Button>
          </div>
        </div>

        {/* Tabs and Filters */}
        <div className="flex flex-col gap-2 mt-4">
          {/* Filter Tabs & Selects */}
          <div className="flex gap-4 mb-4 justify-between w-full flex-wrap">
            <div className="flex overflow-x-auto hide-scrollbar">
              {['Todos', 'Activos', 'Vencidos', 'Cancelados'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab 
                      ? 'font-semibold text-[#0a2a5e] border-b-2 border-[#0a2a5e]' 
                      : 'font-medium text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <DatePickerPopover 
                initialDate={dateFrom}
                onApply={(date) => setDateFrom(date)}
              >
                <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-md text-gray-600 flex items-center gap-2 hover:bg-gray-50">
                  <span className="text-gray-400">Inicio desde:</span>
                  {dateFrom ? formatDate(dateFrom) : 'Cualquiera'}
                  <Calendar className="w-3.5 h-3.5" />
                </button>
              </DatePickerPopover>

              <DatePickerPopover 
                initialDate={dateTo}
                onApply={(date) => setDateTo(date)}
              >
                <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-md text-gray-600 flex items-center gap-2 hover:bg-gray-50">
                  <span className="text-gray-400">Fin hasta:</span>
                  {dateTo ? formatDate(dateTo) : 'Cualquiera'}
                  <Calendar className="w-3.5 h-3.5" />
                </button>
              </DatePickerPopover>
            </div>
          </div>

          {/* Table Header */}
          <div className={`grid gap-4 bg-gray-100/80 px-4 py-3 rounded-t-2xl text-xs font-semibold text-gray-500 mt-2 ${
            isSelectionMode ? 'grid-cols-[40px_2fr_1.5fr_1fr_1fr_1fr]' : 'grid-cols-[2fr_1.5fr_1fr_1fr_1fr]'
          }`}>
            {isSelectionMode && (
              <div className="flex items-center justify-center sm:justify-start">
                <input 
                  type="checkbox" 
                  checked={filteredLoans.length > 0 && selectedLoans.length === filteredLoans.length}
                  onChange={handleToggleAll}
                  className="rounded border-gray-300 text-[#0a2a5e] focus:ring-[#0a2a5e] w-4 h-4 cursor-pointer" 
                />
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
            {filteredLoans.length > 0 ? (
              <LoansTable 
                loans={filteredLoans} 
                isSelectionMode={isSelectionMode} 
                selectedLoans={selectedLoans}
                onToggleLoan={handleToggleLoan}
                onToggleAll={handleToggleAll}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-white border-x border-b border-gray-100 rounded-b-md text-gray-500 p-8">
                <p>No se encontraron préstamos que coincidan con los filtros.</p>
              </div>
            )}
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
