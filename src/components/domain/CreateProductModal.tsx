import React, { useState, useEffect } from 'react';
import Barcode from 'react-barcode';
import { Plus, ArrowRepeat, PcDisplayHorizontal } from 'react-bootstrap-icons';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { generateSKU } from '../../utils/sku';
import { type IProduct } from '../../types/product.types';
import { useToast } from '../../contexts/ToastContext';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: IProduct | null;
  onSave?: (product: IProduct) => void;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({ isOpen, onClose, product, onSave }) => {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setSku(product.sku);
        setName(product.name);
      } else {
        setSku(generateSKU());
        setName('');
      }
    }
  }, [isOpen, product]);

  const handleGenerateSKU = () => {
    setSku(generateSKU());
  };

  const handleSave = () => {
    showToast(product ? 'Se ha actualizado con éxito' : 'Se ha añadido con éxito', 'success');
    if (onSave) {
      // Mock save
      onSave({ id: product?.id || Math.random().toString(), name: name || 'Nuevo Producto', sku, imageUrl: product?.imageUrl || '' });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? "Editar producto" : "Productos"}
      subtitle={product ? "Modifica los detalles de tu producto" : "Agrega imagen, nombre y SKU a tu nuevo producto"}
      icon={<PcDisplayHorizontal className="w-6 h-6" />}
    >
      <div className="flex flex-col h-full w-full">
        {/* Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Adjunte su imagen</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer bg-white h-48 relative overflow-hidden group">
                {product?.imageUrl ? (
                  <>
                    <img src={product.imageUrl} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white font-medium text-sm flex flex-col items-center gap-1">
                        <ArrowRepeat className="w-6 h-6" />
                        Cambiar foto
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Imagen .jpg, .png</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Nombre del producto</label>
              <Input 
                placeholder="Ej. Laptop Lenovo Thinkpad" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white border border-gray-200 shadow-sm"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-[#0a2a5e] rounded-xl p-6 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <span className="text-white font-semibold text-sm">Escanear código de barras</span>
              <span className="bg-yellow-400 text-[#0a2a5e] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Único</span>
            </div>
            
            <div className="bg-white rounded-xl p-4 flex items-center justify-center flex-1 shadow-inner h-32 w-full overflow-hidden">
              {sku ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                   <Barcode 
                    value={sku} 
                    width={1.6} 
                    height={55} 
                    fontSize={14} 
                    margin={0} 
                    displayValue={true}
                    background="transparent"
                  />
                </div>
              ) : (
                <span className="text-gray-400 text-sm">No SKU</span>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button 
                variant="outline" 
                className="flex-1 bg-white text-[#0a2a5e] border-none shadow-md font-semibold text-sm hover:bg-gray-50"
                icon={ArrowRepeat}
                onClick={handleGenerateSKU}
              >
                Generar SKU
              </Button>
              <div className="flex-1 bg-white/10 rounded-md flex items-center justify-center text-white font-mono text-sm border border-white/20 px-2 py-2 overflow-hidden truncate">
                {sku}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 flex justify-between items-center bg-gray-50/50 mt-auto border-t border-gray-100">
          <Button variant="outline" onClick={onClose} className="px-6 border-gray-200 text-gray-600 bg-white hover:bg-gray-50">
            Cancelar
          </Button>
          <Button variant="primary" className="px-6 bg-[#0a2a5e]" onClick={handleSave}>
            {product ? "Guardar Cambios" : "Guardar Producto"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
