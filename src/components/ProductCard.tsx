
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye } from 'lucide-react';
import { ShopifyProduct } from '@/types/shopify';
import { useShopifyCart } from '@/hooks/useShopifyCart';

interface ProductCardProps {
  product: ShopifyProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart, isLoading } = useShopifyCart();
  const [imageError, setImageError] = useState(false);

  const firstVariant = product.variants.edges[0]?.node;
  const price = firstVariant ? parseFloat(firstVariant.price.amount) : 0;
  const compareAtPrice = firstVariant?.compareAtPrice ? parseFloat(firstVariant.compareAtPrice.amount) : null;
  const mainImage = product.images.edges[0]?.node.url || '/placeholder.svg';

  const handleViewProduct = () => {
    navigate(`/product/${product.handle}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!firstVariant) return;

    await addToCart([{
      merchandiseId: firstVariant.id,
      quantity: 1
    }]);
  };

  const discountPercentage = compareAtPrice && compareAtPrice > price 
    ? Math.round((1 - price / compareAtPrice) * 100) 
    : null;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
      <div className="relative overflow-hidden rounded-t-lg">
        {discountPercentage && (
          <Badge className="absolute top-2 left-2 z-10 bg-red-500 text-white">
            -{discountPercentage}%
          </Badge>
        )}
        <div 
          className="aspect-square bg-gray-100 overflow-hidden"
          onClick={handleViewProduct}
        >
          <img
            src={imageError ? '/placeholder.svg' : mainImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          {product.productType && (
            <Badge variant="secondary" className="mb-2 text-xs">
              {product.productType}
            </Badge>
          )}
          
          <h3 
            className="font-semibold text-gray-900 line-clamp-2 mb-2 cursor-pointer hover:text-electric-blue transition-colors"
            onClick={handleViewProduct}
          >
            {product.title}
          </h3>
          
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {product.description.replace(/<[^>]*>/g, '').substring(0, 100)}...
            </p>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-electric-blue">
                ${price.toFixed(2)} MXN
              </span>
              {compareAtPrice && compareAtPrice > price && (
                <span className="text-sm text-gray-500 line-through">
                  ${compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {firstVariant?.availableForSale ? 'En stock' : 'Agotado'}
              </span>
              {product.variants.edges.length > 1 && (
                <span>{product.variants.edges.length} variantes</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewProduct}
            className="flex-1 flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            Ver más
          </Button>
          
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={!firstVariant?.availableForSale || isLoading}
            className="flex-1 bg-electric-blue hover:bg-blue-600 text-white flex items-center gap-1"
          >
            <ShoppingCart className="h-4 w-4" />
            {isLoading ? 'Agregando...' : 'Agregar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
