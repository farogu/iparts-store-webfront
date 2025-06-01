
import { Badge } from '@/components/ui/badge';

interface ProductsMenuProps {
  onProductsClick: () => void;
  currentStep?: 'models' | 'parts' | 'products';
  categories: string[];
}

const ProductsMenu = ({ onProductsClick, currentStep, categories }: ProductsMenuProps) => {
  return (
    <div className="relative group">
      <button 
        className="text-gray-900 hover:text-electric-blue px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
        onClick={onProductsClick}
      >
        Productos
        {currentStep && (
          <Badge variant="secondary" className="ml-2 text-xs">
            {currentStep === 'models' && 'Seleccionar modelo'}
            {currentStep === 'parts' && 'Seleccionar pieza'}
            {currentStep === 'products' && 'Productos'}
          </Badge>
        )}
      </button>
      <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
        <button
          onClick={onProductsClick}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-electric-blue"
        >
          Buscar por modelo
        </button>
        {categories.map((category) => (
          <a
            key={category}
            href={`/catalog?category=${category.toLowerCase()}`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-electric-blue"
          >
            {category}
          </a>
        ))}
      </div>
    </div>
  );
};

export default ProductsMenu;
