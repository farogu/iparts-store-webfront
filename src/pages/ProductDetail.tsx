
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart, Star, Shield, Truck, Award } from 'lucide-react';
import { useShopifyProduct } from '@/hooks/useShopifyProducts';
import { useShopifyCart } from '@/hooks/useShopifyCart';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);

  const { product, isLoading, error } = useShopifyProduct(id || '');
  const { addToCart, isLoading: cartLoading } = useShopifyCart();

  const handleAddToCart = async () => {
    if (!product || !product.variants.edges[selectedVariant]) return;

    const variant = product.variants.edges[selectedVariant].node;
    await addToCart([{
      merchandiseId: variant.id,
      quantity: 1
    }]);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const renderStars = (rating: number = 4.5) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-electric-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Producto no encontrado</h1>
            <Button onClick={handleBack} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Regresar
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const productImages = product.images.edges.map(edge => edge.node.url);
  const selectedVariantNode = product.variants.edges[selectedVariant]?.node;
  const price = selectedVariantNode ? parseFloat(selectedVariantNode.price.amount) : 0;
  const compareAtPrice = selectedVariantNode?.compareAtPrice ? parseFloat(selectedVariantNode.compareAtPrice.amount) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                src={productImages[selectedImage] || '/placeholder.svg'} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {productImages.length > 1 && (
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
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.productType || 'Producto'}</Badge>
                {compareAtPrice && compareAtPrice > price && (
                  <Badge variant="destructive">
                    -{Math.round((1 - price / compareAtPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {renderStars(4.5)}
                  <span className="ml-2 text-sm text-gray-600">
                    4.5 (128 reseñas)
                  </span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {selectedVariantNode?.availableForSale ? 'En stock' : 'Agotado'}
                </Badge>
              </div>
            </div>

            {/* Variants */}
            {product.variants.edges.length > 1 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Variantes</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.edges.map((variant, index) => (
                      <Button
                        key={variant.node.id}
                        variant={selectedVariant === index ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedVariant(index)}
                        className="text-sm"
                      >
                        {variant.node.title}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-electric-blue">
                ${price.toFixed(2)} MXN
              </span>
              {compareAtPrice && compareAtPrice > price && (
                <span className="text-xl text-gray-500 line-through">
                  ${compareAtPrice.toFixed(2)} MXN
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleAddToCart}
                disabled={!selectedVariantNode?.availableForSale || cartLoading}
                className="w-full bg-electric-blue hover:bg-blue-600 text-white text-lg py-6 flex items-center justify-center gap-2"
                size="lg"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartLoading ? 'Agregando...' : 'Agregar al Carrito'}
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

            {/* Description */}
            {product.description && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Descripción</h3>
                  <div 
                    className="text-gray-700 leading-relaxed prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Etiquetas</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
