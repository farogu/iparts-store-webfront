
/**
 * Enhanced input validation and sanitization utilities
 */

// Whitelist patterns for common inputs
const PATTERNS = {
  shopDomain: /^[a-zA-Z0-9][a-zA-Z0-9\-]{0,60}\.myshopify\.com$/,
  productHandle: /^[a-zA-Z0-9\-_]{1,255}$/,
  cartId: /^gid:\/\/shopify\/Cart\/[a-zA-Z0-9\-_]{1,100}$/,
  variantId: /^gid:\/\/shopify\/ProductVariant\/[0-9]{1,20}$/,
  lineId: /^gid:\/\/shopify\/CartLine\/[a-zA-Z0-9\-_]{1,100}$/,
  searchQuery: /^[a-zA-Z0-9\s\-_.,!?'"]{0,200}$/,
};

// Dangerous patterns to reject
const DANGEROUS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /data:text\/html/gi,
  /on\w+\s*=/gi,
  /<iframe[^>]*>/gi,
  /<object[^>]*>/gi,
  /<embed[^>]*>/gi,
];

export class InputValidator {
  static validateShopDomain(domain: string): boolean {
    if (!domain || typeof domain !== 'string') return false;
    return PATTERNS.shopDomain.test(domain);
  }

  static validateProductHandle(handle: string): boolean {
    if (!handle || typeof handle !== 'string') return false;
    return PATTERNS.productHandle.test(handle);
  }

  static validateCartId(cartId: string): boolean {
    if (!cartId || typeof cartId !== 'string') return false;
    return PATTERNS.cartId.test(cartId);
  }

  static validateVariantId(variantId: string): boolean {
    if (!variantId || typeof variantId !== 'string') return false;
    return PATTERNS.variantId.test(variantId);
  }

  static validateLineId(lineId: string): boolean {
    if (!lineId || typeof lineId !== 'string') return false;
    return PATTERNS.lineId.test(lineId);
  }

  static validateQuantity(quantity: number): boolean {
    return Number.isInteger(quantity) && quantity >= 0 && quantity <= 999;
  }

  static validateSearchQuery(query: string): boolean {
    if (!query || typeof query !== 'string') return false;
    return PATTERNS.searchQuery.test(query) && !this.containsDangerousContent(query);
  }

  static sanitizeString(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    // Remove dangerous patterns
    let sanitized = input;
    DANGEROUS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    // Basic HTML entity encoding for critical characters
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
    
    // Limit length
    return sanitized.substring(0, 1000);
  }

  static containsDangerousContent(input: string): boolean {
    return DANGEROUS_PATTERNS.some(pattern => pattern.test(input));
  }

  static validateApiInput(input: any): any {
    if (typeof input === 'string') {
      return this.sanitizeString(input);
    }
    
    if (typeof input === 'number') {
      // Prevent NaN and Infinity
      return Number.isFinite(input) ? input : 0;
    }
    
    if (Array.isArray(input)) {
      return input.slice(0, 100).map(item => this.validateApiInput(item));
    }
    
    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      Object.keys(input).slice(0, 50).forEach(key => {
        const sanitizedKey = this.sanitizeString(key);
        if (sanitizedKey && sanitizedKey.length <= 100) {
          sanitized[sanitizedKey] = this.validateApiInput(input[key]);
        }
      });
      return sanitized;
    }
    
    return input;
  }
}

export default InputValidator;
