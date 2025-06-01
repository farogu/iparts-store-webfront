
// Enhanced cache with TTL and size limits
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

class APICache {
  private cache = new Map<string, CacheEntry>();
  private readonly MAX_CACHE_SIZE = 1000;

  private manageCache(): void {
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      const entries = Array.from(this.cache.entries());
      const sorted = entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const toDelete = sorted.slice(0, Math.floor(this.MAX_CACHE_SIZE * 0.2));
      toDelete.forEach(([key]) => this.cache.delete(key));
    }
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp >= entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
    this.manageCache();
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

export const apiCache = new APICache();
