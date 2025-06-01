
import { shopifyConfig } from '@/config/shopify';

interface WebhookPayload {
  id: string;
  topic: string;
  shop_domain: string;
  created_at: string;
  [key: string]: any;
}

class WebhookHandler {
  private validateWebhook(payload: string, signature: string): boolean {
    if (!shopifyConfig.webhookSecret) {
      console.warn('Webhook secret not configured');
      return false;
    }

    // In a real implementation, you would verify the HMAC signature
    // This is a simplified version for demonstration
    try {
      const crypto = window.crypto;
      if (!crypto || !crypto.subtle) {
        console.warn('Web Crypto API not available for webhook validation');
        return false;
      }
      
      // Note: Full HMAC validation would require a backend service
      // This is just a basic structure for the frontend
      return signature.length > 0;
    } catch (error) {
      console.error('Webhook validation error:', error);
      return false;
    }
  }

  async handleWebhook(topic: string, payload: WebhookPayload, signature: string) {
    if (!this.validateWebhook(JSON.stringify(payload), signature)) {
      throw new Error('Invalid webhook signature');
    }

    console.log(`Processing webhook: ${topic}`, payload);

    switch (topic) {
      case 'products/update':
        await this.handleProductUpdate(payload);
        break;
      case 'products/delete':
        await this.handleProductDelete(payload);
        break;
      case 'inventory_levels/update':
        await this.handleInventoryUpdate(payload);
        break;
      case 'orders/create':
        await this.handleOrderCreate(payload);
        break;
      default:
        console.log(`Unhandled webhook topic: ${topic}`);
    }
  }

  private async handleProductUpdate(payload: WebhookPayload) {
    // Invalidate product cache and refetch
    console.log('Product updated:', payload.id);
    // In a real app, you would invalidate React Query cache here
    // queryClient.invalidateQueries(['shopify-products']);
  }

  private async handleProductDelete(payload: WebhookPayload) {
    console.log('Product deleted:', payload.id);
    // Remove from cache and update UI
  }

  private async handleInventoryUpdate(payload: WebhookPayload) {
    console.log('Inventory updated:', payload);
    // Update inventory levels in cache
  }

  private async handleOrderCreate(payload: WebhookPayload) {
    console.log('New order created:', payload.id);
    // Handle new order notifications
  }
}

export const webhookHandler = new WebhookHandler();
