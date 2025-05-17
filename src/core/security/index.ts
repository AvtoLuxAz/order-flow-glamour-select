export * from "./crypto";
export * from "./secure-storage";

import { AUTH_CONFIG } from "../constants";
import { securityLogger as logger } from "../../shared/utils";
import type { User } from "../types";

// Token Management
export const TokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, token);
  },

  removeRefreshToken: (): void => {
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
  },

  clearTokens: (): void => {
    TokenManager.removeToken();
    TokenManager.removeRefreshToken();
  },
};

// Session Management
export const SessionManager = {
  lastActivity: Date.now(),

  updateLastActivity(): void {
    this.lastActivity = Date.now();
  },

  isSessionExpired(): boolean {
    const timeSinceLastActivity = Date.now() - this.lastActivity;
    return timeSinceLastActivity > AUTH_CONFIG.SESSION_TIMEOUT;
  },

  shouldRefreshToken(): boolean {
    const token = TokenManager.getToken();
    if (!token) return false;

    try {
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
      const timeUntilExpiration = expirationTime - Date.now();

      return timeUntilExpiration < AUTH_CONFIG.REFRESH_THRESHOLD;
    } catch (error) {
      logger.error("Error parsing token:", error);
      return false;
    }
  },
};

// XSS Prevention
export const SecurityUtils = {
  sanitizeInput(input: string): string {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
  },

  validateInput(input: string, pattern: RegExp): boolean {
    return pattern.test(input);
  },

  escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },
};

// CSRF Protection
export const CSRFManager = {
  tokenKey: "csrf-token",

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  },

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  },

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  },

  generateToken(): string {
    const token = crypto
      .getRandomValues(new Uint8Array(32))
      .reduce((acc, val) => acc + val.toString(16).padStart(2, "0"), "");
    this.setToken(token);
    return token;
  },
};

// User Security
export const UserSecurity = {
  validateUserPermissions(user: User, requiredPermissions: string[]): boolean {
    return requiredPermissions.every((permission) =>
      user.permissions.includes(permission)
    );
  },

  validateUserRole(user: User, requiredRoles: string[]): boolean {
    return requiredRoles.includes(user.role);
  },

  hasAccess(
    user: User,
    requiredPermissions: string[] = [],
    requiredRoles: string[] = []
  ): boolean {
    if (!user) return false;

    if (
      requiredRoles.length > 0 &&
      !this.validateUserRole(user, requiredRoles)
    ) {
      return false;
    }

    if (
      requiredPermissions.length > 0 &&
      !this.validateUserPermissions(user, requiredPermissions)
    ) {
      return false;
    }

    return true;
  },
};

// Export all security utilities
export * from "./auth/security-utils";
export * from "./encryption/crypto-utils";

// Re-export specific instances for convenience
export { cryptoUtils, secureStorage } from "./encryption/crypto-utils";
