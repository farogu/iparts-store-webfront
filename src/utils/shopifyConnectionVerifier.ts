
import { shopifyConfig } from '@/config/shopify';

interface ConnectionStatus {
  isConnected: boolean;
  error?: string;
  shopInfo?: {
    name: string;
    domain: string;
  };
}

export class ShopifyConnectionVerifier {
  static async verifyConnection(): Promise<ConnectionStatus> {
    try {
      const query = `
        query getShopInfo {
          shop {
            name
            primaryDomain {
              host
            }
          }
        }
      `;

      const response = await fetch(`https://${shopifyConfig.domain}/api/${shopifyConfig.apiVersion}/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': shopifyConfig.storefrontAccessToken,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        return {
          isConnected: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const result = await response.json();
      
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        return {
          isConnected: false,
          error: `GraphQL Error: ${result.errors[0]?.message || 'Unknown error'}`,
        };
      }

      if (result.data?.shop) {
        return {
          isConnected: true,
          shopInfo: {
            name: result.data.shop.name,
            domain: result.data.shop.primaryDomain.host,
          },
        };
      }

      return {
        isConnected: false,
        error: 'No shop data received',
      };

    } catch (error) {
      console.error('Connection verification failed:', error);
      return {
        isConnected: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  static async testProductsQuery(): Promise<{ success: boolean; error?: string; productCount?: number }> {
    try {
      const query = `
        query testProducts {
          products(first: 1) {
            edges {
              node {
                id
                title
              }
            }
          }
        }
      `;

      const response = await fetch(`https://${shopifyConfig.domain}/api/${shopifyConfig.apiVersion}/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': shopifyConfig.storefrontAccessToken,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const result = await response.json();
      
      if (result.errors) {
        return {
          success: false,
          error: `GraphQL Error: ${result.errors[0]?.message || 'Unknown error'}`,
        };
      }

      return {
        success: true,
        productCount: result.data?.products?.edges?.length || 0,
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }
}
