import React from 'react';
import { Trash } from 'react-bootstrap-icons';
import Barcode from 'react-barcode';
import { Button } from '../ui/Button';
import { type IProduct } from '../../types/product.types';

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: IProduct;
}

export const DeleteProductModal: React.FC<DeleteProductModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  product
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-[500px] animate-in zoom-in-95 duration-200 flex flex-col items-center">
        <div className="flex items-center gap-3 w-full mb-8">
          <Trash className="w-8 h-8 text-[#dc2626]" />
          <h2 className="text-2xl font-bold text-[#0a2a5e]">Eliminar producto</h2>
        </div>
        
        <div className="w-full text-left mb-6">
          <p className="text-gray-800 font-bold text-[15px]">¿Desea eliminar este producto?</p>
        </div>

        <div className="w-full bg-white border border-gray-100 shadow-[0_2px_10px_0_rgb(0,0,0,0.05)] rounded-2xl p-4 flex gap-4 items-center mb-8">
          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-xs">No image</span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2 line-clamp-2">
              {product.name}
            </h3>
            <div className="flex items-center gap-6">
              <div>
                <Barcode 
                  value={product.sku} 
                  width={1} 
                  height={20} 
                  margin={0} 
                  displayValue={false} 
                  background="transparent"
                />
                <p className="text-[8px] font-bold text-gray-500 tracking-widest mt-0.5 text-center">
                  {product.sku}
                </p>
              </div>
              
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">TIPO</p>
                <p className="text-xs font-bold text-gray-900">Laptop</p>
              </div>
              
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">ESTADO</p>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">
                  Disponible
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full flex justify-end gap-3">
          <Button 
            variant="outline" 
            className="px-6 py-2.5 text-sm font-semibold rounded-lg text-gray-600 border-gray-200"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            className="px-8 py-2.5 text-sm font-semibold rounded-lg bg-[#0a2a5e] hover:bg-[#071d42]"
            onClick={onConfirm}
          >
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
};
