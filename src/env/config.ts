import {
  ENV_TYPES,
  type Environment,
  API_CONSTANTS,
  AUTH_CONSTANTS,
  I18N_CONSTANTS,
  FEATURE_FLAGS,
} from "./constants";

interface Config {
  env: Environment;
  api: {
    baseUrl: string;
    timeout: number;
    useMockData: boolean;
    retryAttempts: number;
    retryDelay: number;
    cacheDuration: number;
  };
  supabase: {
    url: string;
    anonKey: string;
  };
  auth: {
    tokenKey: string;
    refreshTokenKey: string;
    expiresInDays: number;
    sessionCheckInterval: number;
  };
  features: {
    [FEATURE_FLAGS.ANALYTICS]: boolean;
    [FEATURE_FLAGS.DEBUG_INFO]: boolean;
    [FEATURE_FLAGS.MOCK_DATA]: boolean;
    [FEATURE_FLAGS.DARK_MODE]: boolean;
  };
  i18n: {
    defaultLanguage: (typeof I18N_CONSTANTS.SUPPORTED_LANGUAGES)[number];
    supportedLanguages: typeof I18N_CONSTANTS.SUPPORTED_LANGUAGES;
    fallbackLanguage: (typeof I18N_CONSTANTS.SUPPORTED_LANGUAGES)[number];
  };
}

const getEnvironment = (): Environment => {
  const env = import.meta.env.VITE_APP_ENV?.toLowerCase();
  if (env === ENV_TYPES.TEST || env === ENV_TYPES.PRODUCTION) return env;
  return ENV_TYPES.LOCAL;
};

/**
 * Application Configuration
 * Loads and validates environment variables with proper fallbacks
 */
export const config: Config = {
  env: getEnvironment(),
  api: {
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    timeout:
      Number(import.meta.env.VITE_API_TIMEOUT) || API_CONSTANTS.DEFAULT_TIMEOUT,
    useMockData: import.meta.env.VITE_USE_MOCK_DATA === "true",
    retryAttempts: API_CONSTANTS.RETRY_ATTEMPTS,
    retryDelay: API_CONSTANTS.RETRY_DELAY,
    cacheDuration: API_CONSTANTS.CACHE_DURATION,
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  },
  auth: {
    tokenKey: AUTH_CONSTANTS.TOKEN_KEY,
    refreshTokenKey: AUTH_CONSTANTS.REFRESH_TOKEN_KEY,
    expiresInDays:
      Number(import.meta.env.VITE_AUTH_EXPIRES_DAYS) ||
      AUTH_CONSTANTS.DEFAULT_EXPIRES,
    sessionCheckInterval: AUTH_CONSTANTS.SESSION_CHECK_INTERVAL,
  },
  features: {
    [FEATURE_FLAGS.ANALYTICS]: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
    [FEATURE_FLAGS.DEBUG_INFO]: import.meta.env.VITE_SHOW_DEBUG_INFO === "true",
    [FEATURE_FLAGS.MOCK_DATA]: import.meta.env.VITE_USE_MOCK_DATA === "true",
    [FEATURE_FLAGS.DARK_MODE]: import.meta.env.VITE_ENABLE_DARK_MODE === "true",
  },
  i18n: {
    defaultLanguage: (import.meta.env.VITE_DEFAULT_LANGUAGE ||
      I18N_CONSTANTS.DEFAULT_LANGUAGE) as (typeof I18N_CONSTANTS.SUPPORTED_LANGUAGES)[number],
    supportedLanguages: I18N_CONSTANTS.SUPPORTED_LANGUAGES,
    fallbackLanguage: I18N_CONSTANTS.FALLBACK_LANGUAGE,
  },
};

// Validate required configuration in development
if (import.meta.env.DEV) {
  const requiredEnvVars = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"];

  requiredEnvVars.forEach((envVar) => {
    if (!import.meta.env[envVar]) {
      console.warn(`Missing required environment variable: ${envVar}`);
    }
  });
}
