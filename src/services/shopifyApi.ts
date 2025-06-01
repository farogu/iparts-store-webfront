
import { productService } from './productService';
import { cartService } from './cartService';

class ShopifyAPI {
  // Product methods
  async getProducts(first = 20, query?: string) {
    return productService.getProducts(first, query);
  }

  async getProductByHandle(handle: string) {
    return productService.getProductByHandle(handle);
  }

  // Cart methods
  async createCart() {
    return cartService.createCart();
  }

  async addToCart(cartId: string, items: any[]) {
    return cartService.addToCart(cartId, items);
  }

  async getCart(cartId: string) {
    return cartService.getCart(cartId);
  }

  async updateCartLines(cartId: string, lines: Array<{ id: string; quantity: number }>) {
    return cartService.updateCartLines(cartId, lines);
  }
}

export const shopifyApi = new ShopifyAPI();
