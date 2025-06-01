
/**
 * Secure storage utility for sensitive data
 * Provides basic encryption for localStorage data
 */

// Simple encryption key derived from browser fingerprint
const getEncryptionKey = (): string => {
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset()
  ].join('|');
  
  // Create a simple hash
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
};

// Simple XOR encryption
const encrypt = (text: string, key: string): string => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const keyChar = key.charCodeAt(i % key.length);
    const textChar = text.charCodeAt(i);
    result += String.fromCharCode(textChar ^ keyChar);
  }
  return btoa(result); // Base64 encode
};

const decrypt = (encryptedText: string, key: string): string => {
  try {
    const decoded = atob(encryptedText); // Base64 decode
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      const keyChar = key.charCodeAt(i % key.length);
      const encryptedChar = decoded.charCodeAt(i);
      result += String.fromCharCode(encryptedChar ^ keyChar);
    }
    return result;
  } catch {
    return '';
  }
};

export const secureStorage = {
  setItem: (key: string, value: string): void => {
    try {
      const encryptionKey = getEncryptionKey();
      const encrypted = encrypt(value, encryptionKey);
      localStorage.setItem(`secure_${key}`, encrypted);
    } catch (error) {
      console.error('Failed to store encrypted data:', error);
      // Fallback to regular storage if encryption fails
      localStorage.setItem(key, value);
    }
  },

  getItem: (key: string): string | null => {
    try {
      const encrypted = localStorage.getItem(`secure_${key}`);
      if (!encrypted) {
        // Check for legacy non-encrypted data
        return localStorage.getItem(key);
      }
      
      const encryptionKey = getEncryptionKey();
      const decrypted = decrypt(encrypted, encryptionKey);
      return decrypted || null;
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      // Fallback to regular storage
      return localStorage.getItem(key);
    }
  },

  removeItem: (key: string): void => {
    localStorage.removeItem(`secure_${key}`);
    localStorage.removeItem(key); // Also remove legacy
  }
};
