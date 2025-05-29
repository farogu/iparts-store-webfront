
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedModel, setSelectedModel] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const products = [
    {
      id: 1,
      name: 'Pantalla iPhone 14 Pro Max OLED',
      category: 'pantallas',
      model: 'iPhone 14 Pro Max',
      price: 349.99,
      originalPrice: 449.99,
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      stock: 12,
      rating: 4.9,
      reviews: 156
    },
    {
      id: 2,
      name: 'Batería iPhone 13 Pro',
      category: 'baterias',
      model: 'iPhone 13 Pro',
      price: 89.99,
      originalPrice: 119.99,
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      stock: 28,
      rating: 4.8,
      reviews: 203
    },
    {
      id: 3,
      name: 'Carcasa iPhone 15 Pro Transparente',
      category: 'carcasas',
      model: 'iPhone 15 Pro',
      price: 49.99,
      originalPrice: 69.99,
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      stock: 42,
      rating: 4.7,
      reviews: 89
    },
    {
      id: 4,
      name: 'Cámara Frontal iPhone 14',
      category: 'camaras',
      model: 'iPhone 14',
      price: 159.99,
      originalPrice: 199.99,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      stock: 8,
      rating: 4.9,
      reviews: 67
    },
    {
      id: 5,
      name: 'Pantalla iPhone 12 Retina',
      category: 'pantallas',
      model: 'iPhone 12',
      price: 189.99,
      originalPrice: 249.99,
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      stock: 22,
      rating: 4.6,
      reviews: 134
    },
    {
      id: 6,
      name: 'Batería iPhone 15 Pro Max',
      category: 'baterias',
      model: 'iPhone 15 Pro Max',
      price: 99.99,
      originalPrice: 129.99,
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      stock: 18,
      rating: 4.8,
      reviews: 91
    }
  ];

  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'pantallas', label: 'Pantallas' },
    { value: 'baterias', label: 'Baterías' },
    { value: 'carcasas', label: 'Carcasas' },
    { value: 'camaras', label: 'Cámaras' }
  ];

  const models = [
    { value: 'all', label: 'Todos los modelos' },
    { value: 'iPhone 15 Pro Max', label: 'iPhone 15 Pro Max' },
    { value: 'iPhone 15 Pro', label: 'iPhone 15 Pro' },
    { value: 'iPhone 14 Pro Max', label: 'iPhone 14 Pro Max' },
    { value: 'iPhone 14 Pro', label: 'iPhone 14 Pro' },
    { value: 'iPhone 14', label: 'iPhone 14' },
    { value: 'iPhone 13 Pro', label: 'iPhone 13 Pro' },
    { value: 'iPhone 12', label: 'iPhone 12' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesModel = selectedModel === 'all' || product.model === selectedModel;
    
    return matchesSearch && matchesCategory && matchesModel;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Catálogo de Productos</h1>
          <p className="text-xl text-gray-300">Encuentra la pieza perfecta para tu iPhone</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Model Filter */}
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder="Modelo" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {models.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Filter */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="name">Nombre</SelectItem>
                <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                <SelectItem value="rating">Mejor Valorados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredProducts.length} productos encontrados
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 hover-lift bg-white">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {product.originalPrice > product.price && (
                      <Badge variant="destructive">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white text-gray-700">
                      Stock: {product.stock}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-electric-blue transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{product.model}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex">{renderStars(product.rating)}</div>
                    <span className="ml-2 text-sm text-gray-600">
                      {product.rating} ({product.reviews} reseñas)
                    </span>
                  </div>

                  {/* Price */}
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
              <CardFooter className="p-4 pt-0">
                <div className="flex gap-2 w-full">
                  <Button className="flex-1 bg-electric-blue hover:bg-blue-600 text-white">
                    Agregar al Carrito
                  </Button>
                  <Button variant="outline" className="px-4">
                    Ver
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No se encontraron productos que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Catalog;
