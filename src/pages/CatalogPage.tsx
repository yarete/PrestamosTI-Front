import React, { useState, useMemo } from 'react';
import { Search, UpcScan, Plus, ChevronLeft, ChevronRight, Inbox } from 'react-bootstrap-icons';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ProductCard } from '../components/domain/ProductCard';
import { CreateProductModal } from '../components/domain/CreateProductModal';
import { ProductUnitsModal } from '../components/domain/ProductUnitsModal';
import { DeleteProductModal } from '../components/domain/DeleteProductModal';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { type IProduct } from '../types/product.types';
import { useToast } from '../contexts/ToastContext';

// Temporarily set to empty to test empty state, or you can populate it.
// To test empty state vs not found, you can modify this array.
const mockProducts: IProduct[] = Array(8).fill(null).map((_, index) => ({
  id: `prod-${index}`,
  name: 'Laptop Lenovo ThinkPad',
  sku: `PRJ-200${index}`,
  imageUrl: '/computadora.jfif'
}));

interface CatalogPageProps {
  onViewChange: (v: string) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ onViewChange }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<IProduct | null>(null);
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);
  const [selectedProductForUnits, setSelectedProductForUnits] = useState<IProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [skuQuery, setSkuQuery] = useState('');
  const { showToast } = useToast();

  // Local state to simulate having products or not
  const [products] = useState<IProduct[]>(mockProducts);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSku = product.sku.toLowerCase().includes(skuQuery.toLowerCase());
      return matchesSearch && matchesSku;
    });
  }, [products, searchQuery, skuQuery]);

  const hasActiveSearch = searchQuery.length > 0 || skuQuery.length > 0;

  const handleEdit = (product: IProduct) => {
    setProductToEdit(product);
    setIsCreateModalOpen(true);
  };

  const handleDelete = (product: IProduct) => {
    setProductToDelete(product);
  };

  const confirmDelete = () => {
    showToast('Eliminado con éxito', 'delete');
    setProductToDelete(null);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setTimeout(() => setProductToEdit(null), 300); // delay to avoid UI jumping during close animation
  };

  return (
    <DashboardLayout 
      currentView="catalog" 
      onViewChange={onViewChange}
      topbarProps={{
        title: "Catalogo de productos",
        subtitle: "Gestiona y monitorea tus productos para prestar"
      }}
    >
      <div className="flex flex-col gap-6 h-full pb-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-1 items-center gap-4 w-full sm:max-w-xl">
            <Input 
              icon={Search} 
              placeholder="Buscar..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              containerClassName="flex-1"
            />
            <Input 
              icon={UpcScan} 
              placeholder="Escanee el SKU aquí..." 
              value={skuQuery}
              onChange={(e) => setSkuQuery(e.target.value)}
              containerClassName="flex-1"
            />
          </div>
          
          <div className="flex gap-4">
            <Button variant="primary" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
              Añadir producto
            </Button>
          </div>
        </div>

        {/* Content Area */}
        {filteredProducts.length > 0 ? (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onViewDetail={setSelectedProductForUnits}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-auto pt-8 border-t border-gray-100">
              <span className="text-sm text-[#0a2a5e] font-medium">
                Mostrando {filteredProducts.length} de {products.length}
              </span>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <button className="p-1 hover:text-[#0a2a5e] transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                <span className="font-medium px-2">1 de 1</span>
                <button className="p-1 hover:text-[#0a2a5e] transition-colors"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center mt-12 mb-12 animate-in fade-in duration-300">
            <div className="w-24 h-24 bg-blue-50/50 rounded-full flex items-center justify-center mb-6">
              {hasActiveSearch ? (
                <Search className="w-10 h-10 text-[#0a2a5e]" />
              ) : (
                <Inbox className="w-12 h-12 text-[#0a2a5e]" />
              )}
            </div>
            <h3 className="text-xl font-bold text-[#0a2a5e] mb-2">
              {hasActiveSearch 
                ? "No se encontraron productos" 
                : "No hay productos en el catálogo"}
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-8">
              {hasActiveSearch 
                ? "No pudimos encontrar ningún producto que coincida con los criterios de búsqueda. Intenta con otros términos o escanea un SKU diferente." 
                : "Aún no has registrado ningún producto. Comienza añadiendo el primero para empezar a gestionar tus préstamos de IT."}
            </p>
            {!hasActiveSearch && (
              <Button variant="primary" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
                Añadir tu primer producto
              </Button>
            )}
          </div>
        )}
      </div>
      
      <CreateProductModal 
        isOpen={isCreateModalOpen} 
        onClose={closeCreateModal} 
        product={productToEdit}
      />
      
      {selectedProductForUnits && (
        <ProductUnitsModal
          isOpen={true}
          onClose={() => setSelectedProductForUnits(null)}
          productName={selectedProductForUnits.name}
        />
      )}

      {productToDelete && (
        <DeleteProductModal
          isOpen={true}
          onClose={() => setProductToDelete(null)}
          onConfirm={confirmDelete}
          product={productToDelete}
        />
      )}
    </DashboardLayout>
  );
};

