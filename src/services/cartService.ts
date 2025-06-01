
import { ShopifyCart, CartItem } from '@/types/shopify';
import { InputValidator } from '@/utils/inputValidator';
import { graphqlClient } from './graphqlClient';

export class CartService {
  async createCart(): Promise<ShopifyCart> {
    const graphqlQuery = `
      mutation cartCreate {
        cartCreate {
          cart {
            id
            checkoutUrl
            totalQuantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product {
                        title
                        handle
                      }
                      image {
                        url
                        altText
                      }
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await graphqlClient.request(graphqlQuery, {}, 'cart');
    
    if (data.cartCreate.userErrors.length > 0) {
      throw new Error('No se pudo crear el carrito');
    }

    return data.cartCreate.cart as ShopifyCart;
  }

  async addToCart(cartId: string, items: CartItem[]): Promise<ShopifyCart> {
    // Enhanced validation
    if (!InputValidator.validateCartId(cartId)) {
      throw new Error('Invalid cart ID');
    }
    
    if (!Array.isArray(items) || items.length === 0 || items.length > 100) {
      throw new Error('Invalid items array');
    }

    // Validate each item
    for (const item of items) {
      if (!InputValidator.validateVariantId(item.merchandiseId)) {
        throw new Error('Invalid merchandise ID');
      }
      if (!InputValidator.validateQuantity(item.quantity)) {
        throw new Error('Invalid quantity');
      }
    }

    const graphqlQuery = `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            totalQuantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product {
                        title
                        handle
                      }
                      image {
                        url
                        altText
                      }
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const lines = items.map(item => ({
      merchandiseId: item.merchandiseId,
      quantity: item.quantity,
    }));

    const data = await graphqlClient.request(graphqlQuery, { cartId, lines }, 'cart');
    
    if (data.cartLinesAdd.userErrors.length > 0) {
      throw new Error('No se pudo agregar al carrito');
    }

    return data.cartLinesAdd.cart as ShopifyCart;
  }

  async getCart(cartId: string): Promise<ShopifyCart> {
    if (!InputValidator.validateCartId(cartId)) {
      throw new Error('Invalid cart ID');
    }

    const graphqlQuery = `
      query getCart($cartId: ID!) {
        cart(id: $cartId) {
          id
          checkoutUrl
          totalQuantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                    image {
                      url
                      altText
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data = await graphqlClient.request(graphqlQuery, { cartId }, 'cart');
    
    if (!data.cart) {
      throw new Error('Carrito no encontrado o expirado');
    }

    return data.cart as ShopifyCart;
  }

  async updateCartLines(cartId: string, lines: Array<{ id: string; quantity: number }>): Promise<ShopifyCart> {
    if (!InputValidator.validateCartId(cartId)) {
      throw new Error('Invalid cart ID');
    }

    if (!Array.isArray(lines) || lines.length === 0 || lines.length > 100) {
      throw new Error('Invalid lines array');
    }

    // Validate each line
    for (const line of lines) {
      if (!InputValidator.validateLineId(line.id)) {
        throw new Error('Invalid line ID');
      }
      if (!InputValidator.validateQuantity(line.quantity)) {
        throw new Error('Invalid quantity');
      }
    }

    const graphqlQuery = `
      mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            totalQuantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product {
                        title
                        handle
                      }
                      image {
                        url
                        altText
                      }
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await graphqlClient.request(graphqlQuery, { cartId, lines }, 'cart');
    
    if (data.cartLinesUpdate.userErrors.length > 0) {
      throw new Error('No se pudo actualizar el carrito');
    }

    return data.cartLinesUpdate.cart as ShopifyCart;
  }
}

export const cartService = new CartService();
