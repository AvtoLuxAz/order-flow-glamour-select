// Environment configuration system

// Define environment types
export type Environment = "local" | "test" | "production";

// Determine current environment
const determineEnv = (): Environment => {
  // Check for environment variable from Vite
  const env = import.meta.env.VITE_APP_ENV;

  if (env === "test") return "test";
  if (env === "production") return "production";
  return "local"; // Default to local if not specified
};

export const currentEnv = determineEnv();

// Environment-specific configuration
export const config = {
  // API configuration
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  usesMockData: import.meta.env.VITE_USE_MOCK_DATA === "true" || true,

  // Supabase configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "",
    apiKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  },

  // Auth configuration
  auth: {
    tokenKey: "auth_token",
    tokenExpireKey: "auth_token_expires",
    refreshTokenKey: "auth_refresh_token",
  },

  // API timeouts
  timeouts: {
    default: 30000, // 30 seconds
    upload: 120000, // 2 minutes
  },

  // Date formats
  dateFormats: {
    display: "YYYY-MM-DD",
    api: "YYYY-MM-DD",
    datetime: "YYYY-MM-DD HH:mm:ss",
  },
} as const;

// Display current environment in console for debugging
if (import.meta.env.DEV) {
  console.log(`Running in ${currentEnv} environment with config:`, config);
}
