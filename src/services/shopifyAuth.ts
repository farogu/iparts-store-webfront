
import { shopifyConfig } from '@/config/shopify';

interface ShopifyAuthParams {
  shop: string;
  timestamp: string;
  nonce: string;
  signature: string;
}

interface ShopifySession {
  shop: string;
  accessToken: string;
  scope: string;
  expiresAt?: number;
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

  // Validate incoming requests from Shopify
  validateRequest(params: ShopifyAuthParams): boolean {
    const { shop, timestamp, nonce, signature } = params;
    
    // Basic validation
    if (!shop || !shop.endsWith('.myshopify.com')) {
      return false;
    }

    // Check timestamp (requests older than 5 minutes are invalid)
    const requestTime = parseInt(timestamp) * 1000;
    const now = Date.now();
    if (now - requestTime > 5 * 60 * 1000) {
      return false;
    }

    // In production, you would validate the HMAC signature here
    // This requires the app secret which should be on the backend
    return true;
  }

  // Generate OAuth URL for app installation
  getInstallUrl(shop: string, redirectUri: string): string {
    if (!shop.endsWith('.myshopify.com')) {
      throw new Error('Invalid shop domain');
    }

    const params = new URLSearchParams({
      client_id: shopifyConfig.storefrontAccessToken, // In real app, use app API key
      scope: this.SCOPES.join(','),
      redirect_uri: redirectUri,
      state: this.generateNonce(),
    });

    return `https://${shop}/admin/oauth/authorize?${params.toString()}`;
  }

  // Handle OAuth callback
  async handleCallback(code: string, shop: string, state: string): Promise<ShopifySession> {
    if (!this.validateState(state)) {
      throw new Error('Invalid state parameter');
    }

    // In a real implementation, this would be handled by your backend
    // Frontend apps cannot securely store app secrets
    console.log('OAuth callback received:', { code, shop });
    
    // Mock session for development
    return {
      shop,
      accessToken: 'mock_access_token',
      scope: this.SCOPES.join(','),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    };
  }

  // Store session securely
  storeSession(session: ShopifySession): void {
    // Use secure storage for session data
    const encryptedSession = this.encryptSession(session);
    localStorage.setItem('shopify_session', encryptedSession);
  }

  // Retrieve stored session
  getSession(): ShopifySession | null {
    const encryptedSession = localStorage.getItem('shopify_session');
    if (!encryptedSession) return null;

    try {
      const session = this.decryptSession(encryptedSession);
      
      // Check if session is expired
      if (session.expiresAt && Date.now() > session.expiresAt) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Failed to decrypt session:', error);
      this.clearSession();
      return null;
    }
  }

  // Clear stored session
  clearSession(): void {
    localStorage.removeItem('shopify_session');
    localStorage.removeItem('shopify_auth_state');
  }

  private generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  private validateState(state: string): boolean {
    const storedState = localStorage.getItem('shopify_auth_state');
    localStorage.removeItem('shopify_auth_state');
    return storedState === state;
  }

  private encryptSession(session: ShopifySession): string {
    // Simple encryption for demonstration
    // In production, use proper encryption
    return btoa(JSON.stringify(session));
  }

  private decryptSession(encrypted: string): ShopifySession {
    try {
      return JSON.parse(atob(encrypted));
    } catch (error) {
      throw new Error('Failed to decrypt session');
    }
  }
}

export const shopifyAuth = new ShopifyAuthService();
