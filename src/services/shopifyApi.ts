import { SHOPIFY_GRAPHQL_URL, shopifyConfig } from '@/config/shopify';
import { ShopifyProduct, ShopifyCart, CartItem } from '@/types/shopify';
import { shopifyAuth } from './shopifyAuth';
import { InputValidator } from '@/utils/inputValidator';
import { environment } from '@/config/environment';

// Enhanced rate limiting with per-endpoint limits
const rateLimiter = {
  requests: new Map<string, number[]>(),
  limits: {
    default: { maxRequests: 100, windowMs: 60 * 1000 },
    products: { maxRequests: 200, windowMs: 60 * 1000 },
    cart: { maxRequests: 50, windowMs: 60 * 1000 },
  },
  
  canMakeRequest(endpoint: string = 'default'): boolean {
    const limit = this.limits[endpoint as keyof typeof this.limits] || this.limits.default;
    const now = Date.now();
    const requests = this.requests.get(endpoint) || [];
    
    const validRequests = requests.filter(time => now - time < limit.windowMs);
    
    if (validRequests.length >= limit.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(endpoint, validRequests);
    return true;
  }
};

// Enhanced cache with TTL and size limits
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
const MAX_CACHE_SIZE = 1000;

const manageCache = () => {
  if (cache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(cache.entries());
    const sorted = entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toDelete = sorted.slice(0, Math.floor(MAX_CACHE_SIZE * 0.2));
    toDelete.forEach(([key]) => cache.delete(key));
  }
};

class ShopifyAPI {
  private async graphqlRequest(query: string, variables: any = {}, endpoint: string = 'default') {
    // Rate limiting check
    if (!rateLimiter.canMakeRequest(endpoint)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Enhanced input validation
    const sanitizedVariables = InputValidator.validateApiInput(variables);
    
    // Validate query structure
    if (!query || typeof query !== 'string' || query.length > 10000) {
      throw new Error('Invalid GraphQL query');
    }

    const cacheKey = `${query.substring(0, 100)}-${JSON.stringify(sanitizedVariables)}`;
    const now = Date.now();
    
    // Check cache for read operations
    if (query.trimStart().startsWith('query') && cache.has(cacheKey)) {
      const cached = cache.get(cacheKey)!;
      if (now - cached.timestamp < cached.ttl) {
        return cached.data;
      }
    }

    // Get authentication - no client-side session storage
    const accessToken = shopifyConfig.storefrontAccessToken;

    // Security headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': accessToken,
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
    };

    // Add CSRF protection in production
    if (environment.isProduction) {
      headers['X-Requested-With'] = 'XMLHttpRequest';
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), environment.apiTimeout);

      const response = await fetch(SHOPIFY_GRAPHQL_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query,
          variables: sanitizedVariables,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Enhanced error handling
      if (!response.ok) {
        switch (response.status) {
          case 401:
            shopifyAuth.clearSession();
            throw new Error('Error de autenticación. Por favor, recarga la página.');
          case 403:
            throw new Error('Acceso denegado. Verifica la configuración.');
          case 429:
            const retryAfter = response.headers.get('Retry-After');
            const message = retryAfter 
              ? `Demasiadas solicitudes. Intenta de nuevo en ${retryAfter} segundos.`
              : 'Demasiadas solicitudes. Intenta de nuevo en unos momentos.';
            throw new Error(message);
          case 422:
            throw new Error('Datos de solicitud inválidos.');
          case 500:
          case 502:
          case 503:
          case 504:
            throw new Error('Servicio temporalmente no disponible. Intenta más tarde.');
          case 404:
            throw new Error('Recurso no encontrado.');
          default:
            throw new Error('Error de conexión con el servicio.');
        }
      }

      const result = await response.json();
      
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        
        const firstError = result.errors[0];
        if (firstError?.extensions?.code === 'ACCESS_DENIED') {
          shopifyAuth.clearSession();
          throw new Error('Sesión expirada. Por favor, recarga la página.');
        }
        
        throw new Error('Error procesando la solicitud.');
      }

      // Validate response structure
      if (!result.data || typeof result.data !== 'object') {
        throw new Error('Respuesta inválida del servidor.');
      }

      // Cache successful read operations
      if (query.trimStart().startsWith('query')) {
        cache.set(cacheKey, {
          data: result.data,
          timestamp: now,
          ttl: 5 * 60 * 1000 // 5 minutes
        });
        manageCache();
      }

      return result.data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Error de conexión. Verifica tu internet y intenta de nuevo.');
      }
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Tiempo de espera agotado. Intenta de nuevo.');
      }
      throw error;
    }
  }

  async getProducts(first = 20, query?: string) {
    // Enhanced input validation
    if (!Number.isInteger(first) || first < 1 || first > 250) {
      throw new Error('Invalid product count requested');
    }
    
    if (query && !InputValidator.validateSearchQuery(query)) {
      throw new Error('Invalid search query');
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

    const data = await this.graphqlRequest(graphqlQuery, { first, query }, 'products');
    
    if (!data.products || !data.products.edges) {
      return [];
    }

    return data.products.edges.map((edge: any) => edge.node) as ShopifyProduct[];
  }

  async getProductByHandle(handle: string) {
    if (!InputValidator.validateProductHandle(handle)) {
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

    const data = await this.graphqlRequest(graphqlQuery, { handle }, 'products');
    
    if (!data.productByHandle) {
      throw new Error(`Producto no encontrado`);
    }

    return data.productByHandle as ShopifyProduct;
  }

  async createCart() {
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

    const data = await this.graphqlRequest(graphqlQuery, {}, 'cart');
    
    if (data.cartCreate.userErrors.length > 0) {
      throw new Error('No se pudo crear el carrito');
    }

    return data.cartCreate.cart as ShopifyCart;
  }

  async addToCart(cartId: string, items: CartItem[]) {
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

    const data = await this.graphqlRequest(graphqlQuery, { cartId, lines }, 'cart');
    
    if (data.cartLinesAdd.userErrors.length > 0) {
      throw new Error('No se pudo agregar al carrito');
    }

    return data.cartLinesAdd.cart as ShopifyCart;
  }

  async getCart(cartId: string) {
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

    const data = await this.graphqlRequest(graphqlQuery, { cartId }, 'cart');
    
    if (!data.cart) {
      throw new Error('Carrito no encontrado o expirado');
    }

    return data.cart as ShopifyCart;
  }

  async updateCartLines(cartId: string, lines: Array<{ id: string; quantity: number }>) {
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

    const data = await this.graphqlRequest(graphqlQuery, { cartId, lines }, 'cart');
    
    if (data.cartLinesUpdate.userErrors.length > 0) {
      throw new Error('No se pudo actualizar el carrito');
    }

    return data.cartLinesUpdate.cart as ShopifyCart;
  }
}

export const shopifyApi = new ShopifyAPI();
