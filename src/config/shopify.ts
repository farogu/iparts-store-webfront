
// Configuración de Shopify Storefront API
export const SHOPIFY_CONFIG = {
  // Reemplaza con tu dominio de Shopify (sin https://)
  // Ejemplo: 'tu-tienda.myshopify.com'
  domain: 'tu-tienda.myshopify.com',
  
  // Token de acceso de Storefront API
  // Para obtenerlo:
  // 1. Ve a tu admin de Shopify
  // 2. Apps > Desarrollar apps > Crear una app
  // 3. Configurar > Storefront API
  // 4. Habilita los scopes necesarios y genera el token
  storefrontAccessToken: 'tu-storefront-access-token',
  
  // Versión de la API (recomendado usar la más reciente)
  apiVersion: '2023-10'
};

export const SHOPIFY_GRAPHQL_URL = `https://${SHOPIFY_CONFIG.domain}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`;

// Instrucciones para configurar:
// 1. Reemplaza 'tu-tienda.myshopify.com' con tu dominio real
// 2. Reemplaza 'tu-storefront-access-token' con tu token real
// 3. Los productos se cargarán automáticamente desde tu tienda Shopify
// 4. El carrito se sincronizará con Shopify para checkout

console.log('🛍️ Shopify Config:', {
  domain: SHOPIFY_CONFIG.domain,
  hasToken: !!SHOPIFY_CONFIG.storefrontAccessToken && SHOPIFY_CONFIG.storefrontAccessToken !== 'tu-storefront-access-token',
  apiVersion: SHOPIFY_CONFIG.apiVersion
});
