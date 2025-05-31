
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useShopifyCart } from '@/hooks/useShopifyCart';

const CartButton = () => {
  const { cart, proceedToCheckout, getCartItemCount } = useShopifyCart();
  const itemCount = getCartItemCount();

  const handleCartClick = () => {
    if (cart && cart.checkoutUrl) {
      proceedToCheckout();
    } else {
      // Fallback a la página de carrito de Shopify
      window.open('/cart', '_blank');
    }
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm" 
        className="relative hover:bg-gray-100"
        onClick={handleCartClick}
        title={`Carrito (${itemCount} productos)`}
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-electric-blue text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
            {itemCount}
          </Badge>
        )}
      </Button>
    </div>
  );
};

export default CartButton;
