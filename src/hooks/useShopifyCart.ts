import { useState, useEffect } from 'react';
import { shopifyApi } from '@/services/shopifyApi';
import { ShopifyCart, CartItem } from '@/types/shopify';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useToast } from '@/hooks/use-toast';
import { secureStorage } from '@/utils/secureStorage';

const CART_STORAGE_KEY = 'shopify-cart-id';
const CART_EXPIRY_HOURS = 24;

export const useShopifyCart = () => {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useErrorHandler();
  const { toast } = useToast();

  // Clear cart data securely
  const clearCartData = async () => {
    await secureStorage.removeItem(CART_STORAGE_KEY);
    setCart(null);
  };

  useEffect(() => {
    initializeCart();
  }, []);

  const initializeCart = async () => {
    try {
      setIsLoading(true);
      
      const existingCartId = await secureStorage.getItem(CART_STORAGE_KEY);
      
      // Check if we have a valid cart ID
      if (existingCartId) {
        try {
          const existingCart = await shopifyApi.getCart(existingCartId);
          setCart(existingCart);
          console.log('Carrito existente cargado:', existingCart.id);
          return;
        } catch (error) {
          console.log('Carrito existente no válido, creando uno nuevo');
          await clearCartData();
        }
      }

      // Create new cart
      const newCart = await shopifyApi.createCart();
      setCart(newCart);
      
      // Store with TTL
      await secureStorage.setItem(
        CART_STORAGE_KEY, 
        newCart.id, 
        CART_EXPIRY_HOURS * 60 * 60 * 1000
      );
      
      console.log('Nuevo carrito creado:', newCart.id);
      
    } catch (error) {
      handleError(error, 'No se pudo inicializar el carrito');
      await clearCartData();
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
      
      // Extend expiry when cart is updated
      await secureStorage.setItem(
        CART_STORAGE_KEY, 
        updatedCart.id, 
        CART_EXPIRY_HOURS * 60 * 60 * 1000
      );
      
      toast({
        title: 'Producto agregado',
        description: `${items.length} producto(s) agregado(s) al carrito`,
      });
      
    } catch (error) {
      handleError(error, 'No se pudo agregar el producto al carrito');
      
      // If cart is invalid, try to reinitialize
      if (error instanceof Error && error.message.includes('no encontrado')) {
        await clearCartData();
        await initializeCart();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!cart) return;

    try {
      setIsLoading(true);
      
      if (quantity <= 0) {
        const updatedCart = await shopifyApi.updateCartLines(cart.id, [
          { id: lineId, quantity: 0 }
        ]);
        setCart(updatedCart);
        toast({
          title: 'Producto eliminado',
          description: 'El producto fue eliminado del carrito',
        });
      } else {
        const updatedCart = await shopifyApi.updateCartLines(cart.id, [
          { id: lineId, quantity }
        ]);
        setCart(updatedCart);
        
        // Extend expiry when cart is updated
        await secureStorage.setItem(
          CART_STORAGE_KEY, 
          updatedCart.id, 
          CART_EXPIRY_HOURS * 60 * 60 * 1000
        );
      }
      
    } catch (error) {
      handleError(error, 'No se pudo actualizar la cantidad');
      
      if (error instanceof Error && error.message.includes('no encontrado')) {
        await clearCartData();
        await initializeCart();
      }
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
    } else {
      toast({
        title: 'Error',
        description: 'No se pudo acceder al checkout',
        variant: 'destructive',
      });
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
    clearCart: clearCartData,
  };
};
