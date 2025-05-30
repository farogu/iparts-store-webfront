
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart, Star, Shield, Truck, Award } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  model: string;
  price: number;
  originalPrice?: number;
  image: string;
  stock: number;
  rating: number;
  reviews: number;
  description: string;
  technicalSpecs: {
    material: string;
    warranty: string;
    type: string;
    compatibility: string[];
  };
  features: string[];
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data - replace with actual API call
  useEffect(() => {
    const mockProduct: Product = {
      id: Number(id) || 1,
      name: 'Batería iPhone 16 Pro Max Original',
      category: 'baterias',
      model: 'iPhone 16 Pro Max',
      price: 299.99,
      originalPrice: 399.99,
      image: 'https://images.unsplash.com/photo-1609592306974-5487e8ad2dbb?w=600&q=80',
      stock: 15,
      rating: 4.9,
      reviews: 128,
      description: 'Batería original de alta calidad para iPhone 16 Pro Max. Fabricada con la más alta tecnología de iones de litio, garantiza un rendimiento óptimo y una vida útil prolongada. Incluye herramientas de instalación profesional.',
      technicalSpecs: {
        material: 'Iones de Litio',
        warranty: '12 meses',
        type: 'Batería Original OEM',
        compatibility: ['iPhone 16 Pro Max']
      },
      features: [
        'Capacidad de 4422 mAh',
        'Tecnología de carga rápida',
        'Protección contra sobrecarga',
        'Certificación CE y RoHS',
        'Herramientas incluidas'
      ]
    };
    setProduct(mockProduct);
  }, [id]);

  const handleAddToCart = () => {
    console.log('Agregando al carrito:', product);
    // WooCommerce Integration: Add to cart API call
    // Example: addToCart(product.id, quantity)
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-electric-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  const productImages = [product.image, product.image, product.image]; // Mock multiple images

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Regresar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <img 
                src={productImages[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex gap-2 overflow-x-auto">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-electric-blue' : 'border-gray-200'
                  }`}
                >
                  <img src={image} alt={`Vista ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                {product.originalPrice && product.originalPrice > product.price && (
                  <Badge variant="destructive">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews} reseñas)
                  </span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {product.stock} en stock
                </Badge>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-electric-blue">
                ${product.price.toFixed(2)} MXN
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)} MXN
                </span>
              )}
            </div>

            {/* Compatibility */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Compatibilidad</h3>
                <div className="flex flex-wrap gap-2">
                  {product.technicalSpecs.compatibility.map((model, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {model}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-electric-blue hover:bg-blue-600 text-white text-lg py-6 flex items-center justify-center gap-2"
                size="lg"
              >
                <ShoppingCart className="h-6 w-6" />
                Agregar al Carrito
              </Button>
              
              <div className="grid grid-cols-3 gap-2 text-center text-sm text-gray-600">
                <div className="flex items-center justify-center gap-1">
                  <Truck className="h-4 w-4" />
                  <span>Envío gratis +$1000</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Shield className="h-4 w-4" />
                  <span>12 meses garantía</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Award className="h-4 w-4" />
                  <span>Calidad premium</span>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Especificaciones Técnicas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Material:</span>
                    <span className="font-medium">{product.technicalSpecs.material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="font-medium">{product.technicalSpecs.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Garantía:</span>
                    <span className="font-medium">{product.technicalSpecs.warranty}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Características</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-electric-blue rounded-full"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Descripción</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
