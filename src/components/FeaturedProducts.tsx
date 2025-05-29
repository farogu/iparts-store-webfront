
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FeaturedProducts = () => {
  const [activeCategory, setActiveCategory] = useState('todos');

  const categories = [
    { id: 'todos', name: 'Todos' },
    { id: 'pantallas', name: 'Pantallas' },
    { id: 'baterias', name: 'Baterías' },
    { id: 'carcasas', name: 'Carcasas' },
    { id: 'camaras', name: 'Cámaras' }
  ];

  const products = [
    {
      id: 1,
      name: 'Pantalla iPhone 14 Pro',
      category: 'pantallas',
      price: 299.99,
      originalPrice: 399.99,
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      stock: 15,
      isPopular: true
    },
    {
      id: 2,
      name: 'Batería iPhone 13',
      category: 'baterias',
      price: 89.99,
      originalPrice: 119.99,
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      stock: 28,
      isPopular: false
    },
    {
      id: 3,
      name: 'Carcasa iPhone 15 Pro Max',
      category: 'carcasas',
      price: 49.99,
      originalPrice: 69.99,
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      stock: 42,
      isPopular: true
    },
    {
      id: 4,
      name: 'Cámara iPhone 14',
      category: 'camaras',
      price: 159.99,
      originalPrice: 199.99,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      stock: 8,
      isPopular: false
    },
    {
      id: 5,
      name: 'Pantalla iPhone 12',
      category: 'pantallas',
      price: 189.99,
      originalPrice: 249.99,
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      stock: 22,
      isPopular: true
    },
    {
      id: 6,
      name: 'Batería iPhone 15',
      category: 'baterias',
      price: 99.99,
      originalPrice: 129.99,
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      stock: 18,
      isPopular: false
    }
  ];

  const filteredProducts = activeCategory === 'todos' 
    ? products 
    : products.filter(product => product.category === activeCategory);

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

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 hover-lift bg-white border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {product.isPopular && (
                      <Badge className="bg-electric-blue text-white">Popular</Badge>
                    )}
                    {product.originalPrice > product.price && (
                      <Badge variant="destructive">Oferta</Badge>
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white text-gray-700">
                      Stock: {product.stock}
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-electric-blue transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-electric-blue">
                        ${product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-lg text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <div className="flex gap-2 w-full">
                  <Button className="flex-1 bg-electric-blue hover:bg-blue-600 text-white">
                    Agregar al Carrito
                  </Button>
                  <Button variant="outline" className="px-4 border-gray-300 hover:border-electric-blue hover:text-electric-blue">
                    Ver
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline"
            className="px-8 py-3 border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white"
          >
            Ver Todos los Productos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
