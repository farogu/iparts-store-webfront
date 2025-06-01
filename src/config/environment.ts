
/**
 * Environment Configuration Guide
 * 
 * Required Environment Variables for Production:
 * 
 * VITE_SHOPIFY_DOMAIN=your-store.myshopify.com
 * VITE_SHOPIFY_STOREFRONT_TOKEN=your_storefront_access_token
 * VITE_APP_URL=https://your-app-domain.com
 * VITE_SHOPIFY_WEBHOOK_SECRET=your_webhook_secret
 * 
 * Optional Environment Variables:
 * VITE_ENVIRONMENT=production|development|staging
 * VITE_API_TIMEOUT=30000
 * VITE_ENABLE_ANALYTICS=true|false
 */

export const environment = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
  
  // API Configuration
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  
  // Feature Flags
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enableDebugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
  
  // Security Settings
  enforceHttps: import.meta.env.VITE_ENFORCE_HTTPS !== 'false',
  
  // App Configuration
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  appName: import.meta.env.VITE_APP_NAME || 'Shopify Store App',
};

// Validation for production environment
if (environment.isProduction) {
  const requiredVars = [
    'VITE_SHOPIFY_DOMAIN',
    'VITE_SHOPIFY_STOREFRONT_TOKEN',
    'VITE_APP_URL'
  ];
  
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables for production: ${missing.join(', ')}\n` +
      'Please check your deployment configuration.'
    );
  }
  
  // Validate HTTPS in production
  if (environment.enforceHttps && !import.meta.env.VITE_APP_URL?.startsWith('https://')) {
    console.warn('Warning: HTTPS is recommended for production deployments');
  }
}

export default environment;
