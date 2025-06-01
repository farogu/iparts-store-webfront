import { SHOPIFY_GRAPHQL_URL, shopifyConfig } from '@/config/shopify';
import { ShopifyProduct, ShopifyCart, CartItem } from '@/types/shopify';

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

class ShopifyAPI {
  private async graphqlRequest(query: string, variables: any = {}) {
    const cacheKey = `${query}-${JSON.stringify(variables)}`;
    const now = Date.now();
    
    // Check cache for GET-like operations (products)
    if (query.includes('query') && cache.has(cacheKey)) {
      const cached = cache.get(cacheKey)!;
      if (now - cached.timestamp < cached.ttl) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(SHOPIFY_GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': shopifyConfig.storefrontAccessToken,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token de acceso inválido. Verifica tu configuración de Shopify.');
        } else if (response.status === 429) {
          throw new Error('Demasiadas solicitudes. Intenta de nuevo en unos momentos.');
        } else if (response.status >= 500) {
          throw new Error('Error del servidor de Shopify. Intenta de nuevo más tarde.');
        }
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.errors) {
        const errorMessage = result.errors.map((e: any) => e.message).join(', ');
        throw new Error(`Error de GraphQL: ${errorMessage}`);
      }

      // Cache successful responses for queries
      if (query.includes('query')) {
        cache.set(cacheKey, {
          data: result.data,
          timestamp: now,
          ttl: 5 * 60 * 1000 // 5 minutes
        });
      }

      return result.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Error de conexión. Verifica tu internet y intenta de nuevo.');
      }
      throw error;
    }
  }

  async getProducts(first = 20, query?: string) {
    try {
      const graphqlQuery = `
        query getProducts($first: Int!, $query: String) {
          products(first: $first, query: $query) {
            edges {
              node {
                id
                title
                description
                handle
                productType
                tags
                images(first: 5) {
                  edges {
                    node {
                      id
                      url
                      altText
                    }
                  }
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      availableForSale
                      quantityAvailable
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const data = await this.graphqlRequest(graphqlQuery, { first, query });
      
      if (!data.products || !data.products.edges) {
        console.warn('No products found in response');
        return [];
      }

      return data.products.edges.map((edge: any) => edge.node) as ShopifyProduct[];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductByHandle(handle: string) {
    try {
      const graphqlQuery = `
        query getProductByHandle($handle: String!) {
          productByHandle(handle: $handle) {
            id
            title
            description
            handle
            productType
            tags
            images(first: 10) {
              edges {
                node {
                  id
                  url
                  altText
                }
              }
            }
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  availableForSale
                  quantityAvailable
                }
              }
            }
          }
        }
      `;

      const data = await this.graphqlRequest(graphqlQuery, { handle });
      
      if (!data.productByHandle) {
        throw new Error(`Producto con handle "${handle}" no encontrado`);
      }

      return data.productByHandle as ShopifyProduct;
    } catch (error) {
      console.error('Error fetching product by handle:', error);
      throw error;
    }
  }

  async createCart() {
    try {
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

      const data = await this.graphqlRequest(graphqlQuery);
      
      if (data.cartCreate.userErrors.length > 0) {
        const errorMessage = data.cartCreate.userErrors.map((e: any) => e.message).join(', ');
        throw new Error(`Error al crear carrito: ${errorMessage}`);
      }

      return data.cartCreate.cart as ShopifyCart;
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  }

  async addToCart(cartId: string, items: CartItem[]) {
    try {
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

      const data = await this.graphqlRequest(graphqlQuery, { cartId, lines });
      
      if (data.cartLinesAdd.userErrors.length > 0) {
        const errorMessage = data.cartLinesAdd.userErrors.map((e: any) => e.message).join(', ');
        throw new Error(`Error al agregar al carrito: ${errorMessage}`);
      }

      return data.cartLinesAdd.cart as ShopifyCart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async getCart(cartId: string) {
    try {
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

      const data = await this.graphqlRequest(graphqlQuery, { cartId });
      
      if (!data.cart) {
        throw new Error('Carrito no encontrado o expirado');
      }

      return data.cart as ShopifyCart;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }

  async updateCartLines(cartId: string, lines: Array<{ id: string; quantity: number }>) {
    try {
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

      const data = await this.graphqlRequest(graphqlQuery, { cartId, lines });
      
      if (data.cartLinesUpdate.userErrors.length > 0) {
        const errorMessage = data.cartLinesUpdate.userErrors.map((e: any) => e.message).join(', ');
        throw new Error(`Error al actualizar carrito: ${errorMessage}`);
      }

      return data.cartLinesUpdate.cart as ShopifyCart;
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  }
}

export const shopifyApi = new ShopifyAPI();
