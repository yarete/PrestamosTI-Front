import React, { useState, useEffect, useRef } from 'react';
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
  const [imagePreview, setImagePreview] = useState('');
  const [formError, setFormError] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setSku(product.sku);
        setName(product.name);
        setImagePreview(product.imageUrl || '');
      } else {
        setSku(generateSKU());
        setName('');
        setImagePreview('');
      }
      setFormError('');
      setIsConfirmOpen(false);
    }
  }, [isOpen, product]);

  const handleGenerateSKU = () => {
    setSku(generateSKU());
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isValidType = file.type.startsWith('image/');
    if (!isValidType) {
      showToast('Solo se permiten imágenes válidas (.png, .jpg, .jpeg, .webp).', 'error');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const validateProduct = () => {
    if (!name.trim()) {
      return 'El nombre del producto es obligatorio.';
    }
    if (!sku.trim()) {
      return 'El SKU es obligatorio.';
    }
    return '';
  };

  const handleSave = () => {
    const error = validateProduct();
    if (error) {
      setFormError(error);
      showToast(error, 'error');
      return;
    }

    setFormError('');
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    const error = validateProduct();
    if (error) {
      setFormError(error);
      showToast(error, 'error');
      setIsConfirmOpen(false);
      return;
    }

    showToast(product ? 'Se ha actualizado con éxito' : 'Se ha añadido con éxito', 'success');
    if (onSave) {
      onSave({
        id: product?.id || Math.random().toString(),
        name: name.trim(),
        sku: sku.trim(),
        imageUrl: imagePreview || product?.imageUrl || '',
      });
    }
    setIsConfirmOpen(false);
    onClose();
  };

  const handleClose = () => {
    setFormError('');
    setImagePreview(product?.imageUrl || '');
    setIsConfirmOpen(false);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={product ? 'Editar producto' : 'Productos'}
        subtitle={product ? 'Modifica los detalles de tu producto' : 'Agrega imagen, nombre y SKU a tu nuevo producto'}
        icon={<PcDisplayHorizontal className="w-6 h-6" />}
      >
        <div className="flex flex-col h-full w-full">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Adjunte su imagen</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div
                  onClick={handleImageClick}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer bg-white h-48 relative overflow-hidden group"
                >
                  {imagePreview ? (
                   <>
                     <img src={imagePreview} alt={name || 'Imagen del producto'} className="absolute inset-0 w-full h-full object-cover" />
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
                  onChange={(e) => {
                   setName(e.target.value);
                   if (formError) setFormError('');
                  }}
                  className="bg-white border border-gray-200 shadow-sm"
                />
                {formError && <p className="mt-2 text-xs font-medium text-red-600">{formError}</p>}
              </div>
            </div>

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

          <div className="p-6 flex justify-between items-center bg-gray-50/50 mt-auto border-t border-gray-100">
            <Button variant="outline" onClick={handleClose} className="px-6 border-gray-200 text-gray-600 bg-white hover:bg-gray-50">
              Cancelar
            </Button>
            <Button variant="primary" className="px-6 bg-[#0a2a5e]" onClick={handleSave}>
              {product ? 'Guardar Cambios' : 'Guardar Producto'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} title={product ? 'Confirmar cambios' : 'Confirmar creación'} maxWidth="sm">
        <div className="p-6">
          <p className="mb-6 text-sm leading-6 text-gray-700">
            {product ? '¿Deseas guardar los cambios realizados en este producto?' : '¿Deseas crear este producto con la información ingresada?'}
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)} className="border-gray-200 text-gray-600 hover:bg-gray-50">
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleConfirmSave} className="bg-[#0a2a5e] hover:bg-[#123a7a]">
              {product ? 'Guardar cambios' : 'Crear producto'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
