// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  TIMEOUT: 10000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
} as const;

// Authentication Configuration
export const AUTH_CONFIG = {
  TOKEN_KEY: "authToken",
  REFRESH_TOKEN_KEY: "refreshToken",
  USER_ROLE_KEY: "userRole",
  SESSION_TIMEOUT: 3600000, // 1 hour
  REFRESH_THRESHOLD: 300000, // 5 minutes
} as const;

// Role-Based Access Control
export const RBAC_CONFIG = {
  ROLES: {
    ADMIN: "admin",
    MANAGER: "manager",
    USER: "user",
  },
  PERMISSIONS: {
    READ: {
      ALL: "read:all",
      OWN: "read:own",
    },
    WRITE: {
      ALL: "write:all",
      OWN: "write:own",
    },
    DELETE: {
      ALL: "delete:all",
      OWN: "delete:own",
    },
  },
} as const;

// Validation Constants
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 100,
    PATTERN:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
  },
  EMAIL: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 255,
  },
  PHONE: {
    PATTERN: /^\+?[1-9]\d{1,14}$/,
  },
} as const;

// UI Constants
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 300,
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1536,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: {
    OFFLINE: "You are offline. Please check your internet connection.",
    TIMEOUT: "Request timed out. Please try again.",
    SERVER: "An unexpected server error occurred. Please try again later.",
  },
  AUTH: {
    UNAUTHORIZED: "Please log in to continue.",
    FORBIDDEN: "You do not have permission to perform this action.",
    INVALID_CREDENTIALS: "Invalid email or password.",
  },
  VALIDATION: {
    REQUIRED: "This field is required.",
    INVALID_EMAIL: "Please enter a valid email address.",
    INVALID_PASSWORD: "Password must meet the security requirements.",
    PASSWORDS_DONT_MATCH: "Passwords do not match.",
  },
} as const;
