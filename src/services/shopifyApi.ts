import { SHOPIFY_GRAPHQL_URL, shopifyConfig } from '@/config/shopify';
import { ShopifyProduct, ShopifyCart, CartItem } from '@/types/shopify';

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Rate limiting
const rateLimiter = {
  requests: new Map<string, number[]>(),
  maxRequests: 100, // Max requests per minute
  windowMs: 60 * 1000, // 1 minute window
  
  canMakeRequest(key: string = 'default'): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
};

// Input validation and sanitization
const validateAndSanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    // Remove potentially dangerous characters
    return input.replace(/[<>'"&]/g, '');
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = validateAndSanitizeInput(value);
    }
    return sanitized;
  }
  return input;
};

class ShopifyAPI {
  private async graphqlRequest(query: string, variables: any = {}) {
    // Rate limiting check
    if (!rateLimiter.canMakeRequest()) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Sanitize input variables
    const sanitizedVariables = validateAndSanitizeInput(variables);
    
    const cacheKey = `${query}-${JSON.stringify(sanitizedVariables)}`;
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
          'User-Agent': 'Shopify-Store-App/1.0',
        },
        body: JSON.stringify({
          query,
          variables: sanitizedVariables,
        }),
      });

      if (!response.ok) {
        // Don't expose internal server details
        if (response.status === 401) {
          throw new Error('Error de autenticación con Shopify.');
        } else if (response.status === 429) {
          throw new Error('Demasiadas solicitudes. Intenta de nuevo en unos momentos.');
        } else if (response.status >= 500) {
          throw new Error('Servicio temporalmente no disponible.');
        } else if (response.status === 404) {
          throw new Error('Recurso no encontrado.');
        }
        throw new Error('Error de conexión con el servicio.');
      }

      const result = await response.json();
      
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        // Don't expose GraphQL errors to users
        throw new Error('Error procesando la solicitud.');
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
      // Validate input parameters
      if (first < 1 || first > 250) {
        throw new Error('Invalid product count requested');
      }
      
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
      // Validate handle
      if (!handle || typeof handle !== 'string' || handle.length > 255) {
        throw new Error('Invalid product handle');
      }

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
        throw new Error(`Producto no encontrado`);
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
        console.error('Cart creation errors:', data.cartCreate.userErrors);
        throw new Error('No se pudo crear el carrito');
      }

      return data.cartCreate.cart as ShopifyCart;
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  }

  async addToCart(cartId: string, items: CartItem[]) {
    try {
      // Validate inputs
      if (!cartId || typeof cartId !== 'string') {
        throw new Error('Invalid cart ID');
      }
      
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Invalid items array');
      }

      // Validate each item
      for (const item of items) {
        if (!item.merchandiseId || typeof item.merchandiseId !== 'string') {
          throw new Error('Invalid merchandise ID');
        }
        if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) {
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

      const data = await this.graphqlRequest(graphqlQuery, { cartId, lines });
      
      if (data.cartLinesAdd.userErrors.length > 0) {
        console.error('Add to cart errors:', data.cartLinesAdd.userErrors);
        throw new Error('No se pudo agregar al carrito');
      }

      return data.cartLinesAdd.cart as ShopifyCart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async getCart(cartId: string) {
    try {
      if (!cartId || typeof cartId !== 'string') {
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
      if (!cartId || typeof cartId !== 'string') {
        throw new Error('Invalid cart ID');
      }

      if (!Array.isArray(lines) || lines.length === 0) {
        throw new Error('Invalid lines array');
      }

      // Validate each line
      for (const line of lines) {
        if (!line.id || typeof line.id !== 'string') {
          throw new Error('Invalid line ID');
        }
        if (!Number.isInteger(line.quantity) || line.quantity < 0 || line.quantity > 100) {
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

      const data = await this.graphqlRequest(graphqlQuery, { cartId, lines });
      
      if (data.cartLinesUpdate.userErrors.length > 0) {
        console.error('Update cart errors:', data.cartLinesUpdate.userErrors);
        throw new Error('No se pudo actualizar el carrito');
      }

      return data.cartLinesUpdate.cart as ShopifyCart;
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  }
}

export const shopifyApi = new ShopifyAPI();
