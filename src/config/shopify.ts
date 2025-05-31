
// Configuración de Shopify Storefront API
export const SHOPIFY_CONFIG = {
  // Reemplaza con tu dominio de Shopify (sin https://)
  domain: 'tu-tienda.myshopify.com',
  // Token de acceso de Storefront API
  storefrontAccessToken: 'tu-storefront-access-token',
  // Versión de la API
  apiVersion: '2023-10'
};

export const SHOPIFY_GRAPHQL_URL = `https://${SHOPIFY_CONFIG.domain}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`;
