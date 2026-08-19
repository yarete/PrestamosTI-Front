import React, { useState } from 'react';
import { FileText, Person, Calendar, Search, Dash, Plus, X, ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import { Modal } from '../ui/Modal';
import { Stepper } from '../ui/Stepper';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { DatePickerPopover } from '../ui/DatePickerPopover';
import { formatDate } from '../../utils/date';
import { useToast } from '../../contexts/ToastContext';

interface CreateLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { id: 1, label: 'Datos del Préstamo' },
  { id: 2, label: 'Elegir Productos' },
  { id: 3, label: 'Confirmar' }
];

const MOCK_PRODUCTS = [
  { id: 1, name: 'Laptop Lenovo ThinkPad', available: 20 },
  { id: 2, name: 'Laptop Lenovo ThinkPad', available: 3 },
  { id: 3, name: 'Laptop Lenovo ThinkPad', available: 3 },
  { id: 4, name: 'Laptop Lenovo ThinkPad', available: 3 },
];

export const CreateLoanModal: React.FC<CreateLoanModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [loanData, setLoanData] = useState({
    usuario: '',
    fechaInicio: null as Date | null,
    fechaLimite: null as Date | null
  });
  const { showToast } = useToast();
  
  // Stores quantity for each selected product ID
  const [selectedProducts, setSelectedProducts] = useState<Record<number, number>>({});

  const validateStepOne = () => {
    if (!loanData.usuario.trim()) {
      showToast('El nombre del usuario es obligatorio.', 'error');
      return false;
    }

    if (!loanData.fechaInicio) {
      showToast('La fecha de inicio es obligatoria.', 'error');
      return false;
    }

    if (!loanData.fechaLimite) {
      showToast('La fecha límite es obligatoria.', 'error');
      return false;
    }

    if (loanData.fechaLimite < loanData.fechaInicio) {
      showToast('La fecha límite no puede ser anterior a la fecha de inicio.', 'error');
      return false;
    }

    return true;
  };

  const validateSelection = () => {
    if (Object.keys(selectedProducts).length === 0) {
      showToast('Debes seleccionar al menos un producto para crear el préstamo.', 'error');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStepOne()) {
      return;
    }

    if (step === 2 && !validateSelection()) {
      return;
    }

    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSaveLoan = () => {
    if (!validateStepOne() || !validateSelection()) {
      return;
    }

    showToast('Préstamo creado correctamente.', 'success');
    handleClose();
  };

  const toggleProduct = (productId: number) => {
    setSelectedProducts(prev => {
      const next = { ...prev };
      if (next[productId]) {
        delete next[productId];
      } else {
        next[productId] = 1;
      }
      return next;
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setSelectedProducts(prev => {
      const current = prev[productId] || 0;
      const nextVal = Math.max(1, current + delta);
      return { ...prev, [productId]: nextVal };
    });
  };

  const handleClose = () => {
    setStep(1);
    setLoanData({ usuario: '', fechaInicio: null, fechaLimite: null });
    setSelectedProducts({});
    onClose();
  };

  const renderStep1 = () => (
    <div className="flex flex-col gap-4 px-8 pb-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Nombre del Usuario:</label>
        <Input 
          placeholder="Ingrese el nombre del usuario" 
          value={loanData.usuario}
          onChange={(e) => setLoanData({...loanData, usuario: e.target.value})}
          icon={Person} 
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <DatePickerPopover 
          align="left"
          position="bottom"
          initialDate={loanData.fechaInicio}
          onApply={(date) => setLoanData({...loanData, fechaInicio: date})}
        >
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Fecha de Inicio:</label>
            <Input 
              readOnly
              placeholder="Seleccionar..." 
              value={formatDate(loanData.fechaInicio)}
              icon={Calendar} 
            />
          </div>
        </DatePickerPopover>
        <DatePickerPopover 
          align="right"
          position="bottom"
          initialDate={loanData.fechaLimite}
          onApply={(date) => setLoanData({...loanData, fechaLimite: date})}
        >
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Fecha de Límite:</label>
            <Input 
              readOnly
              placeholder="Seleccionar..." 
              value={formatDate(loanData.fechaLimite)}
              icon={Calendar} 
            />
          </div>
        </DatePickerPopover>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex flex-col gap-4 px-8 pb-4">
      <Input placeholder="Buscar..." icon={Search} className="mb-2" />
      
      <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
        {MOCK_PRODUCTS.map((prod) => {
          const isSelected = !!selectedProducts[prod.id];
          
          return (
            <div 
              key={prod.id} 
              className={`border rounded-xl overflow-hidden flex flex-col hover:border-blue-300 transition-all bg-white
                ${isSelected ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'border-gray-200'}
              `}
            >
              <div className="relative h-28 bg-gray-100">
                <img 
                  src="/computadora.jfif" 
                  alt={prod.name}
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => toggleProduct(prod.id)}
                  className={`absolute top-2 right-2 w-5 h-5 rounded flex items-center justify-center border-2 transition-colors
                    ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}
                  `}
                >
                  {isSelected && <span className="w-2.5 h-2.5 bg-white rounded-sm" />}
                </button>
              </div>
              <div className="p-3 flex flex-col gap-1">
                <h3 className="font-bold text-sm text-gray-800 leading-tight">{prod.name}</h3>
                <span className="text-xs font-semibold text-[#0a2a5e]">{prod.available} disponibles</span>
                
                {isSelected && (
                  <div className="flex items-center gap-3 mt-1 bg-gray-100 rounded-full px-2 py-0.5 w-max">
                    <button onClick={() => updateQuantity(prod.id, -1)} className="text-gray-400 hover:text-gray-700 p-0.5">
                      <Dash className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-gray-700 w-3 text-center">{selectedProducts[prod.id]}</span>
                    <button onClick={() => updateQuantity(prod.id, 1)} className="text-gray-400 hover:text-gray-700 p-0.5">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {!isSelected && (
                  <div className="h-6 mt-1" /> // placeholder to keep height consistent
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center px-2 mt-2">
        <span className="text-sm text-gray-500 font-medium">Mostrando 4 de 10</span>
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

  const renderStep3 = () => (
    <div className="flex flex-col gap-4 px-8 pb-4">
      {/* Read-only summary of Step 1 */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Nombre del Usuario:</label>
        <Input value={loanData.usuario} readOnly icon={Person} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Fecha de Inicio:</label>
          <Input value={formatDate(loanData.fechaInicio)} readOnly icon={Calendar} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Fecha de Límite:</label>
          <Input value={formatDate(loanData.fechaLimite)} readOnly icon={Calendar} />
        </div>
      </div>

      <div className="mt-2">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Productos</h3>
        <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-2">
          {Object.entries(selectedProducts).map(([idStr, quantity]) => {
            const prod = MOCK_PRODUCTS.find(p => p.id === parseInt(idStr));
            if (!prod) return null;
            return (
              <div key={prod.id} className="bg-gray-100 rounded-xl px-4 py-3 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800">{prod.name}</span>
                  <span className="text-[10px] text-gray-500 font-medium mt-0.5">Cantidad: {quantity}</span>
                </div>
                <button 
                  onClick={() => toggleProduct(prod.id)}
                  className="text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
          {Object.keys(selectedProducts).length === 0 && (
            <p className="text-xs text-gray-500 italic">No hay productos seleccionados.</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title="Préstamo"
      subtitle="Creación y gestión de préstamo"
      icon={<FileText className="w-6 h-6" />}
    >
      <div className="flex flex-col h-full w-full">
        <Stepper steps={STEPS} currentStep={step} />
        
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        <div className="flex justify-between items-center px-8 py-6 mt-auto border-t border-gray-100">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <div className="flex gap-3">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack}>
                Atrás
              </Button>
            )}
            <Button variant="primary" onClick={step === 3 ? handleSaveLoan : handleNext}>
              {step === 1 ? 'Siguiente' : step === 2 ? 'Confirmar Selección' : 'Guardar Préstamo'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
