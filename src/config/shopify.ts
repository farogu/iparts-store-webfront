
// Environment variable validation
const validateEnvVar = (name: string, value: string | undefined): string => {
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}. Please set ${name} in your environment.`);
  }
  return value.trim();
};

// Production-ready Shopify configuration
export const shopifyConfig = {
  domain: validateEnvVar('VITE_SHOPIFY_DOMAIN', import.meta.env.VITE_SHOPIFY_DOMAIN),
  storefrontAccessToken: validateEnvVar('VITE_SHOPIFY_STOREFRONT_TOKEN', import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN),
  apiVersion: '2024-01', // Updated to latest stable version
  // App-specific configuration for Shopify App Bridge
  appUrl: import.meta.env.VITE_APP_URL || 'https://your-app.com',
  webhookSecret: import.meta.env.VITE_SHOPIFY_WEBHOOK_SECRET,
};

// Validate domain format
if (!shopifyConfig.domain.includes('.myshopify.com')) {
  throw new Error(`Invalid Shopify domain format: ${shopifyConfig.domain}. Domain must include '.myshopify.com'`);
}

// Security headers configuration
export const securityConfig = {
  contentSecurityPolicy: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "https://cdn.shopify.com"],
    'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    'img-src': ["'self'", "data:", "https:", "*.shopify.com"],
    'connect-src': ["'self'", `https://${shopifyConfig.domain}`, "https://api.shopify.com"],
    'font-src': ["'self'", "https://fonts.gstatic.com"],
    'frame-src': ["'self'", "https://checkout.shopify.com"],
  }
};

export const SHOPIFY_GRAPHQL_URL = `https://${shopifyConfig.domain}/api/${shopifyConfig.apiVersion}/graphql.json`;
export const SHOPIFY_ADMIN_URL = `https://${shopifyConfig.domain}/admin/api/${shopifyConfig.apiVersion}`;
