import React, { useState, useRef, useEffect } from 'react';
import Barcode from 'react-barcode';
import { Eye, ThreeDots, Pencil, Trash } from 'react-bootstrap-icons';
import { Button } from '../ui/Button';
import { type IProduct } from '../../types/product.types';

interface ProductCardProps {
  product: IProduct;
  onViewDetail?: (product: IProduct) => void;
  onEdit?: (product: IProduct) => void;
  onDelete?: (product: IProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetail, onEdit, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_0_rgb(0,0,0,0.05)] border border-gray-100 flex flex-col">
      <div className="h-36 w-full bg-gray-100 relative flex items-center justify-center shrink-0">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-400 text-sm font-medium">No image</div>
        )}
      </div>
      <div className="flex flex-col p-3 flex-1 justify-between gap-3 relative">
        <div className="flex justify-between items-start gap-3">
          <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2 max-w-[55%]">
            {product.name}
          </h3>
          <div className="flex-1 flex justify-end">
            <div className="w-28 bg-white flex flex-col items-end">
              <Barcode 
                value={product.sku} 
                width={1.1} 
                height={28} 
                margin={0} 
                displayValue={false} 
                background="transparent"
              />
              <span className="text-[9px] font-bold text-[#0a2a5e] tracking-widest mt-1">
                {product.sku}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center gap-2 mt-1">
          <Button 
            variant="outline" 
            className="flex-1 justify-center py-1.5 text-xs text-gray-600 font-semibold border-gray-200" 
            icon={Eye}
            onClick={() => onViewDetail && onViewDetail(product)}
          >
            Ver detalle
          </Button>
          
          <div className="relative" ref={menuRef}>
            <Button 
              variant="outline" 
              className="px-2 py-1.5 text-gray-600 border-gray-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <ThreeDots className="w-4 h-4" />
            </Button>
            
            {isMenuOpen && (
              <div className="absolute right-0 bottom-full mb-2 bg-white rounded-lg shadow-xl border border-gray-100 w-36 overflow-hidden z-20 animate-in zoom-in-95 duration-100">
                <button 
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onEdit && onEdit(product);
                  }}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Editar
                </button>
                <button 
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors border-t border-gray-50"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDelete && onDelete(product);
                  }}
                >
                  <Trash className="w-3.5 h-3.5" />
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
