
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

    // Enhanced logging for debugging
    console.log('🔍 GraphQL Request Details:', {
      endpoint: SHOPIFY_GRAPHQL_URL,
      domain: shopifyConfig.domain,
      hasToken: !!accessToken,
      tokenPreview: accessToken ? `${accessToken.substring(0, 8)}...` : 'NO TOKEN',
      queryType: query.trimStart().split(' ')[0],
      variables: sanitizedVariables
    });

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

      console.log('📡 Response Status:', response.status, response.statusText);

      // Enhanced error handling
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No response body');
        console.error('🚨 HTTP Error Details:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText
        });

        switch (response.status) {
          case 401:
            shopifyAuth.clearSession();
            throw new Error('Error de autenticación. Verifica tu token de Shopify y recarga la página.');
          case 403:
            throw new Error('Acceso denegado. El token no tiene los permisos necesarios.');
          case 429:
            const retryAfter = response.headers.get('Retry-After');
            const message = retryAfter 
              ? `Demasiadas solicitudes. Intenta de nuevo en ${retryAfter} segundos.`
              : 'Demasiadas solicitudes. Intenta de nuevo en unos momentos.';
            throw new Error(message);
          case 422:
            throw new Error('Datos de solicitud inválidos. Verifica la configuración de Shopify.');
          case 500:
          case 502:
          case 503:
          case 504:
            throw new Error('Servicio temporalmente no disponible. Intenta más tarde.');
          case 404:
            throw new Error('Tienda de Shopify no encontrada. Verifica el dominio.');
          default:
            throw new Error(`Error de conexión (${response.status}): ${response.statusText}`);
        }
      }

      const result = await response.json();
      
      console.log('✅ GraphQL Response:', {
        hasData: !!result.data,
        hasErrors: !!result.errors,
        dataKeys: result.data ? Object.keys(result.data) : []
      });
      
      if (result.errors) {
        console.error('🚨 GraphQL errors:', result.errors);
        
        const firstError = result.errors[0];
        if (firstError?.extensions?.code === 'ACCESS_DENIED') {
          shopifyAuth.clearSession();
          throw new Error('Token de acceso inválido. Verifica la configuración en Shopify.');
        }
        
        throw new Error(`Error de GraphQL: ${firstError?.message || 'Error desconocido'}`);
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
      console.error('🚨 GraphQL Client Error:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Error de red. Verifica tu conexión a internet y la configuración de Shopify.');
      }
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Tiempo de espera agotado. Verifica la conexión con Shopify.');
      }
      throw error;
    }
  }
}

export const graphqlClient = new GraphQLClient();
