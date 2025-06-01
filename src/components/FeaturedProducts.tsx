
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';

const FeaturedProducts = () => {
  const [activeCategory, setActiveCategory] = useState('todos');
  const navigate = useNavigate();

  const categories = [
    { id: 'todos', name: 'Todos', productType: '' },
    { id: 'pantallas', name: 'Pantallas', productType: 'Pantallas' },
    { id: 'baterias', name: 'Baterías', productType: 'Baterías' },
    { id: 'carcasas', name: 'Carcasas', productType: 'Carcasas' },
    { id: 'camaras', name: 'Cámaras', productType: 'Cámaras' }
  ];

  const selectedCategory = categories.find(cat => cat.id === activeCategory);
  const productType = selectedCategory?.productType || undefined;

  const { products, isLoading, error } = useShopifyProducts(
    undefined, 
    productType === '' ? undefined : productType
  );

  // Get featured products (limit to 6 for featured section)
  const featuredProducts = products.slice(0, 6);

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
          <p className="text-gray-600">Error al cargar productos. Intenta de nuevo más tarde.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Productos Destacados
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra selección premium de piezas y accesorios para iPhone con la mejor calidad garantizada
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 ${
                activeCategory === category.id 
                  ? 'bg-electric-blue hover:bg-blue-600 text-white' 
                  : 'border-gray-300 text-gray-700 hover:border-electric-blue hover:text-electric-blue'
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Cargando productos destacados..." />
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && featuredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* No Products Found */}
        {!isLoading && featuredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No hay productos disponibles en esta categoría.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline"
            className="px-8 py-3 border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white"
            onClick={() => navigate('/catalog')}
          >
            Ver Todos los Productos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
