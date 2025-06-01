
import { SHOPIFY_GRAPHQL_URL, shopifyConfig } from '@/config/shopify';
import { shopifyAuth } from '@/services/shopifyAuth';
import { InputValidator } from '@/utils/inputValidator';
import { environment } from '@/config/environment';
import { rateLimiter } from './rateLimiter';
import { apiCache } from './apiCache';

export class GraphQLClient {
  async request(query: string, variables: any = {}, endpoint: string = 'default') {
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
    
    // Check cache for read operations
    if (query.trimStart().startsWith('query') && apiCache.has(cacheKey)) {
      return apiCache.get(cacheKey);
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
        apiCache.set(cacheKey, result.data);
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
}

export const graphqlClient = new GraphQLClient();
