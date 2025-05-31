
import { useState, useEffect } from 'react';
import { shopifyApi } from '@/services/shopifyApi';
import { ShopifyCart, CartItem } from '@/types/shopify';
import { useToast } from '@/hooks/use-toast';

export const useShopifyCart = () => {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Inicializar carrito al cargar
  useEffect(() => {
    initializeCart();
  }, []);

  const initializeCart = async () => {
    try {
      setIsLoading(true);
      
      // Verificar si existe un carrito en localStorage
      const existingCartId = localStorage.getItem('shopify-cart-id');
      
      if (existingCartId) {
        try {
          const existingCart = await shopifyApi.getCart(existingCartId);
          setCart(existingCart);
          return;
        } catch (error) {
          console.log('Carrito existente no válido, creando uno nuevo');
          localStorage.removeItem('shopify-cart-id');
        }
      }

      // Crear nuevo carrito si no existe uno válido
      const newCart = await shopifyApi.createCart();
      setCart(newCart);
      localStorage.setItem('shopify-cart-id', newCart.id);
      
    } catch (error) {
      console.error('Error al inicializar carrito:', error);
      toast({
        title: 'Error',
        description: 'No se pudo inicializar el carrito',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (items: CartItem[]) => {
    if (!cart) {
      await initializeCart();
      return;
    }

    try {
      setIsLoading(true);
      const updatedCart = await shopifyApi.addToCart(cart.id, items);
      setCart(updatedCart);
      
      toast({
        title: 'Producto agregado',
        description: 'El producto se agregó al carrito exitosamente',
      });
      
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      toast({
        title: 'Error',
        description: 'No se pudo agregar el producto al carrito',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!cart) return;

    try {
      setIsLoading(true);
      const updatedCart = await shopifyApi.updateCartLines(cart.id, [
        { id: lineId, quantity }
      ]);
      setCart(updatedCart);
      
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la cantidad',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCartItemCount = () => {
    return cart?.totalQuantity || 0;
  };

  const getCartTotal = () => {
    return cart?.cost.totalAmount.amount || '0';
  };

  const proceedToCheckout = () => {
    if (cart?.checkoutUrl) {
      window.open(cart.checkoutUrl, '_blank');
    }
  };

  return {
    cart,
    isLoading,
    addToCart,
    updateQuantity,
    getCartItemCount,
    getCartTotal,
    proceedToCheckout,
    initializeCart,
  };
};
