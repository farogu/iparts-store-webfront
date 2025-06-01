
import { useState, useEffect } from 'react';
import { shopifyApi } from '@/services/shopifyApi';
import { ShopifyCart, CartItem } from '@/types/shopify';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useToast } from '@/hooks/use-toast';

const CART_STORAGE_KEY = 'shopify-cart-id';
const CART_EXPIRY_KEY = 'shopify-cart-expiry';
const CART_EXPIRY_HOURS = 24; // 24 hours

export const useShopifyCart = () => {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useErrorHandler();
  const { toast } = useToast();

  // Check if cart is expired
  const isCartExpired = () => {
    const expiry = localStorage.getItem(CART_EXPIRY_KEY);
    if (!expiry) return true;
    return Date.now() > parseInt(expiry);
  };

  // Set cart expiry
  const setCartExpiry = () => {
    const expiry = Date.now() + (CART_EXPIRY_HOURS * 60 * 60 * 1000);
    localStorage.setItem(CART_EXPIRY_KEY, expiry.toString());
  };

  // Clear cart data
  const clearCartData = () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(CART_EXPIRY_KEY);
    setCart(null);
  };

  useEffect(() => {
    initializeCart();
  }, []);

  const initializeCart = async () => {
    try {
      setIsLoading(true);
      
      const existingCartId = localStorage.getItem(CART_STORAGE_KEY);
      
      // Check if we have a cart ID and it's not expired
      if (existingCartId && !isCartExpired()) {
        try {
          const existingCart = await shopifyApi.getCart(existingCartId);
          setCart(existingCart);
          console.log('Carrito existente cargado:', existingCart.id);
          return;
        } catch (error) {
          console.log('Carrito existente no válido, creando uno nuevo');
          clearCartData();
        }
      } else if (existingCartId && isCartExpired()) {
        console.log('Carrito expirado, creando uno nuevo');
        clearCartData();
      }

      // Create new cart
      const newCart = await shopifyApi.createCart();
      setCart(newCart);
      localStorage.setItem(CART_STORAGE_KEY, newCart.id);
      setCartExpiry();
      console.log('Nuevo carrito creado:', newCart.id);
      
    } catch (error) {
      handleError(error, 'No se pudo inicializar el carrito');
      clearCartData();
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
      setCartExpiry(); // Extend expiry when cart is updated
      
      toast({
        title: 'Producto agregado',
        description: `${items.length} producto(s) agregado(s) al carrito`,
      });
      
    } catch (error) {
      handleError(error, 'No se pudo agregar el producto al carrito');
      
      // If cart is invalid, try to reinitialize
      if (error instanceof Error && error.message.includes('no encontrado')) {
        clearCartData();
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
        // Remove item if quantity is 0 or less
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
        setCartExpiry(); // Extend expiry when cart is updated
      }
      
    } catch (error) {
      handleError(error, 'No se pudo actualizar la cantidad');
      
      // If cart is invalid, try to reinitialize
      if (error instanceof Error && error.message.includes('no encontrado')) {
        clearCartData();
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
