/**
 * Environment Types
 * Used to determine the current runtime environment
 */
export const ENV_TYPES = {
  LOCAL: "local",
  TEST: "test",
  PRODUCTION: "production",
} as const;

export type Environment = (typeof ENV_TYPES)[keyof typeof ENV_TYPES];

/**
 * Feature Flag Keys
 * Used to enable/disable specific features
 */
export const FEATURE_FLAGS = {
  ANALYTICS: "analytics",
  DEBUG_INFO: "debugInfo",
  MOCK_DATA: "mockData",
  DARK_MODE: "darkMode",
} as const;

/**
 * API Configuration Constants
 */
export const API_CONSTANTS = {
  DEFAULT_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

/**
 * Authentication Constants
 */
export const AUTH_CONSTANTS = {
  TOKEN_KEY: "auth_token",
  REFRESH_TOKEN_KEY: "refresh_token",
  DEFAULT_EXPIRES: 7, // days
  SESSION_CHECK_INTERVAL: 5 * 60 * 1000, // 5 minutes
};

/**
 * Localization Constants
 */
export const I18N_CONSTANTS = {
  DEFAULT_LANGUAGE: "en",
  SUPPORTED_LANGUAGES: ["en", "az", "ru"] as const,
  FALLBACK_LANGUAGE: "en",
};

/**
 * Cache Keys
 * Used for consistent cache key naming across the application
 */
export const CACHE_KEYS = {
  USER_PREFERENCES: "user_preferences",
  THEME: "theme",
  LANGUAGE: "language",
  AUTH_STATE: "auth_state",
} as const;
