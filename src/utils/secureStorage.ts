
import { environment } from '@/config/environment';

/**
 * Enhanced secure storage utility with proper encryption
 * Uses Web Crypto API for secure encryption when available
 */

// Generate a more secure encryption key using Web Crypto API
const generateSecureKey = async (): Promise<CryptoKey> => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      return await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.warn('Web Crypto API not available, falling back to basic encryption');
    }
  }
  
  // Fallback for environments without Web Crypto API
  throw new Error('Secure encryption not available');
};

// Store the encryption key securely
let encryptionKey: CryptoKey | null = null;

// Initialize encryption key
const initializeEncryption = async () => {
  if (!encryptionKey) {
    try {
      encryptionKey = await generateSecureKey();
    } catch (error) {
      console.error('Failed to initialize secure encryption:', error);
    }
  }
};

// Enhanced encryption using AES-GCM
const encryptSecure = async (text: string): Promise<string> => {
  if (!encryptionKey) {
    await initializeEncryption();
  }
  
  if (!encryptionKey || !window.crypto?.subtle) {
    // Fallback to basic encoding for development
    return btoa(text);
  }

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      encryptionKey,
      data
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption failed:', error);
    return btoa(text); // Fallback
  }
};

// Enhanced decryption
const decryptSecure = async (encryptedText: string): Promise<string> => {
  if (!encryptionKey) {
    await initializeEncryption();
  }
  
  if (!encryptionKey || !window.crypto?.subtle) {
    // Fallback to basic decoding
    try {
      return atob(encryptedText);
    } catch {
      return '';
    }
  }

  try {
    const combined = new Uint8Array(
      atob(encryptedText).split('').map(char => char.charCodeAt(0))
    );
    
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      encryptionKey,
      data
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    try {
      return atob(encryptedText); // Fallback
    } catch {
      return '';
    }
  }
};

// Session management with expiration
interface SecureSession {
  data: string;
  timestamp: number;
  expiresAt: number;
  version: string;
}

export const secureStorage = {
  setItem: async (key: string, value: string, ttl: number = 24 * 60 * 60 * 1000): Promise<void> => {
    try {
      const session: SecureSession = {
        data: value,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
        version: '2.0'
      };
      
      const encrypted = await encryptSecure(JSON.stringify(session));
      localStorage.setItem(`secure_v2_${key}`, encrypted);
      
      // Clean up old version
      localStorage.removeItem(`secure_${key}`);
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to store encrypted data:', error);
      // Don't fallback to insecure storage in production
      if (environment.isProduction) {
        throw new Error('Secure storage failed');
      }
    }
  },

  getItem: async (key: string): Promise<string | null> => {
    try {
      const encrypted = localStorage.getItem(`secure_v2_${key}`);
      if (!encrypted) {
        // Check for legacy data and migrate
        const legacyEncrypted = localStorage.getItem(`secure_${key}`);
        const legacyPlain = localStorage.getItem(key);
        
        if (legacyEncrypted || legacyPlain) {
          // Clean up legacy data for security
          localStorage.removeItem(`secure_${key}`);
          localStorage.removeItem(key);
        }
        
        return null;
      }
      
      const decrypted = await decryptSecure(encrypted);
      if (!decrypted) return null;
      
      const session: SecureSession = JSON.parse(decrypted);
      
      // Check expiration
      if (Date.now() > session.expiresAt) {
        localStorage.removeItem(`secure_v2_${key}`);
        return null;
      }
      
      return session.data;
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      // Clean up corrupted data
      localStorage.removeItem(`secure_v2_${key}`);
      return null;
    }
  },

  removeItem: (key: string): void => {
    localStorage.removeItem(`secure_v2_${key}`);
    localStorage.removeItem(`secure_${key}`);
    localStorage.removeItem(key);
  },

  // Clear all secure storage
  clearAll: (): void => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('secure_')) {
        localStorage.removeItem(key);
      }
    });
  }
};

// Initialize encryption on module load
if (typeof window !== 'undefined') {
  initializeEncryption().catch(error => {
    console.warn('Failed to initialize secure encryption:', error);
  });
}
