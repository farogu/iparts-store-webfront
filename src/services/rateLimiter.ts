
// Enhanced rate limiting with per-endpoint limits
interface RateLimit {
  maxRequests: number;
  windowMs: number;
}

interface RateLimits {
  default: RateLimit;
  products: RateLimit;
  cart: RateLimit;
  [key: string]: RateLimit;
}

class RateLimiter {
  private requests = new Map<string, number[]>();
  private limits: RateLimits = {
    default: { maxRequests: 100, windowMs: 60 * 1000 },
    products: { maxRequests: 200, windowMs: 60 * 1000 },
    cart: { maxRequests: 50, windowMs: 60 * 1000 },
  };
  
  canMakeRequest(endpoint: string = 'default'): boolean {
    const limit = this.limits[endpoint] || this.limits.default;
    const now = Date.now();
    const requests = this.requests.get(endpoint) || [];
    
    const validRequests = requests.filter(time => now - time < limit.windowMs);
    
    if (validRequests.length >= limit.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(endpoint, validRequests);
    return true;
  }
}

export const rateLimiter = new RateLimiter();
