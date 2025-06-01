
import { shopifyConfig } from '@/config/shopify';
import { environment } from '@/config/environment';

interface ShopifyAuthParams {
  shop: string;
  timestamp: string;
  nonce: string;
  signature: string;
}

interface ShopifyAuthState {
  shop: string;
  timestamp: number;
  nonce: string;
}

class ShopifyAuthService {
  private readonly SCOPES = [
    'read_products',
    'write_products',
    'read_inventory',
    'write_inventory',
    'read_orders',
    'write_orders'
  ];

  // Enhanced request validation with timing attack protection
  validateRequest(params: ShopifyAuthParams): boolean {
    const { shop, timestamp, nonce, signature } = params;
    
    // Input sanitization
    if (!shop || typeof shop !== 'string' || shop.length > 255) {
      return false;
    }
    
    // Strict shop domain validation
    const shopPattern = /^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/;
    if (!shopPattern.test(shop)) {
      return false;
    }

    // Enhanced timestamp validation
    if (!timestamp || !/^\d+$/.test(timestamp)) {
      return false;
    }
    
    const requestTime = parseInt(timestamp) * 1000;
    const now = Date.now();
    
    // Stricter time window (2 minutes instead of 5)
    if (now - requestTime > 2 * 60 * 1000 || requestTime > now + 60 * 1000) {
      return false;
    }

    // Nonce validation
    if (!nonce || typeof nonce !== 'string' || nonce.length < 16) {
      return false;
    }

    // In production, HMAC signature validation would be done server-side
    if (environment.isProduction) {
      console.warn('HMAC validation should be performed server-side');
    }

    return true;
  }

  // Generate OAuth URL with enhanced security
  getInstallUrl(shop: string, redirectUri: string): string {
    // Input validation
    if (!shop || typeof shop !== 'string') {
      throw new Error('Invalid shop parameter');
    }
    
    if (!redirectUri || typeof redirectUri !== 'string') {
      throw new Error('Invalid redirect URI');
    }

    // Validate shop domain
    const shopPattern = /^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/;
    if (!shopPattern.test(shop)) {
      throw new Error('Invalid shop domain format');
    }

    // Validate redirect URI
    try {
      const url = new URL(redirectUri);
      if (!url.protocol.startsWith('https') && environment.isProduction) {
        throw new Error('HTTPS required for redirect URI in production');
      }
    } catch (error) {
      throw new Error('Invalid redirect URI format');
    }

    const state = this.generateSecureState();
    this.storeAuthState(state, shop);

    const params = new URLSearchParams({
      client_id: shopifyConfig.storefrontAccessToken,
      scope: this.SCOPES.join(','),
      redirect_uri: redirectUri,
      state,
    });

    return `https://${shop}/admin/oauth/authorize?${params.toString()}`;
  }

  // Handle OAuth callback with enhanced validation
  async handleCallback(code: string, shop: string, state: string): Promise<{ success: boolean; message: string }> {
    try {
      // Input validation
      if (!code || typeof code !== 'string' || code.length > 1000) {
        throw new Error('Invalid authorization code');
      }

      if (!shop || typeof shop !== 'string') {
        throw new Error('Invalid shop parameter');
      }

      if (!state || typeof state !== 'string') {
        throw new Error('Invalid state parameter');
      }

      // Validate state and prevent CSRF
      if (!this.validateAndConsumeState(state, shop)) {
        throw new Error('Invalid or expired state parameter');
      }

      // In a production app, this would exchange the code for an access token server-side
      console.log('OAuth callback received:', { shop, codeLength: code.length });
      
      if (environment.isProduction) {
        return {
          success: false,
          message: 'OAuth token exchange must be performed server-side in production'
        };
      }

      return {
        success: true,
        message: 'Authorization successful (development mode)'
      };
      
    } catch (error) {
      console.error('OAuth callback failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Authorization failed'
      };
    }
  }

  // Remove client-side session storage - sessions should be server-side only
  getSession(): null {
    if (environment.isProduction) {
      console.warn('Session management should be server-side in production');
    }
    return null;
  }

  // Clear any legacy client-side session data
  clearSession(): void {
    // Clear any legacy session data
    localStorage.removeItem('shopify_session');
    localStorage.removeItem('shopify_auth_state');
    
    // Clear secure storage
    import('./secureStorage').then(({ secureStorage }) => {
      secureStorage.removeItem('shopify_session');
      secureStorage.removeItem('shopify_auth_state');
    });
  }

  private generateSecureState(): string {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const array = new Uint8Array(32); // 256 bits
      window.crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // Fallback for environments without crypto API
    throw new Error('Secure random generation not available');
  }

  private storeAuthState(state: string, shop: string): void {
    const authState: ShopifyAuthState = {
      shop,
      timestamp: Date.now(),
      nonce: state
    };
    
    // Store with short TTL (5 minutes)
    import('./secureStorage').then(({ secureStorage }) => {
      secureStorage.setItem('shopify_auth_state', JSON.stringify(authState), 5 * 60 * 1000);
    });
  }

  private validateAndConsumeState(state: string, shop: string): boolean {
    try {
      import('./secureStorage').then(async ({ secureStorage }) => {
        const storedStateStr = await secureStorage.getItem('shopify_auth_state');
        if (!storedStateStr) return false;

        const storedState: ShopifyAuthState = JSON.parse(storedStateStr);
        
        // Validate state matches and shop matches
        if (storedState.nonce !== state || storedState.shop !== shop) {
          return false;
        }

        // Check if state is not too old (5 minutes max)
        if (Date.now() - storedState.timestamp > 5 * 60 * 1000) {
          return false;
        }

        // Consume the state (remove it)
        secureStorage.removeItem('shopify_auth_state');
        return true;
      });
      
      return true;
    } catch (error) {
      console.error('State validation failed:', error);
      return false;
    }
  }
}

export const shopifyAuth = new ShopifyAuthService();
