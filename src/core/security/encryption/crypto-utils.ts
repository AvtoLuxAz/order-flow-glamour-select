import { logger } from "../../utils/logger";

const ENCRYPTION_KEY =
  import.meta.env.VITE_ENCRYPTION_KEY || "your-fallback-key";

export class CryptoUtils {
  private static instance: CryptoUtils;
  private encoder: TextEncoder;
  private decoder: TextDecoder;

  private constructor() {
    this.encoder = new TextEncoder();
    this.decoder = new TextDecoder();
  }

  public static getInstance(): CryptoUtils {
    if (!CryptoUtils.instance) {
      CryptoUtils.instance = new CryptoUtils();
    }
    return CryptoUtils.instance;
  }

  private async generateKey(salt: Uint8Array): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      this.encoder.encode(ENCRYPTION_KEY),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  public async encrypt(data: string): Promise<string> {
    try {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const key = await this.generateKey(salt);

      const encryptedData = await crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv,
        },
        key,
        this.encoder.encode(data)
      );

      // Combine salt, iv, and encrypted data
      const combined = new Uint8Array(
        salt.length + iv.length + encryptedData.byteLength
      );
      combined.set(salt, 0);
      combined.set(iv, salt.length);
      combined.set(new Uint8Array(encryptedData), salt.length + iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      logger.error("Encryption failed:", error);
      throw new Error("Failed to encrypt data");
    }
  }

  public async decrypt(encryptedData: string): Promise<string> {
    try {
      const combined = new Uint8Array(
        atob(encryptedData)
          .split("")
          .map((char) => char.charCodeAt(0))
      );

      const salt = combined.slice(0, 16);
      const iv = combined.slice(16, 28);
      const data = combined.slice(28);

      const key = await this.generateKey(salt);

      const decryptedData = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv,
        },
        key,
        data
      );

      return this.decoder.decode(decryptedData);
    } catch (error) {
      logger.error("Decryption failed:", error);
      throw new Error("Failed to decrypt data");
    }
  }
}

// Secure storage utility
export class SecureStorage {
  private crypto: CryptoUtils;

  constructor() {
    this.crypto = CryptoUtils.getInstance();
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      const encryptedValue = await this.crypto.encrypt(value);
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      logger.error("Failed to store encrypted data:", error);
      throw new Error("Failed to store data securely");
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;
      return await this.crypto.decrypt(encryptedValue);
    } catch (error) {
      logger.error("Failed to retrieve encrypted data:", error);
      return null;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}

// Export singleton instances
export const cryptoUtils = CryptoUtils.getInstance();
export const secureStorage = new SecureStorage();
