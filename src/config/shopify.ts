
// Environment variable validation
const validateEnvVar = (name: string, value: string | undefined): string => {
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
};

export const shopifyConfig = {
  domain: validateEnvVar('VITE_SHOPIFY_DOMAIN', import.meta.env.VITE_SHOPIFY_DOMAIN || 'r2qsad-18.myshopify.com'),
  storefrontAccessToken: validateEnvVar('VITE_SHOPIFY_TOKEN', import.meta.env.VITE_SHOPIFY_TOKEN || '2dccc961d3058108376a21e6a51c61e6'),
  apiVersion: '2023-10'
};

// Validate domain format
if (!shopifyConfig.domain.includes('.myshopify.com')) {
  throw new Error('Invalid Shopify domain format');
}

export const SHOPIFY_GRAPHQL_URL = `https://${shopifyConfig.domain}/api/${shopifyConfig.apiVersion}/graphql.json`;
