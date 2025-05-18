// Environment configuration system

// Define environment types
export type Environment = "local" | "supabase" | "production";

// Determine current environment
const determineEnv = (): Environment => {
  const env = import.meta.env.VITE_APP_ENV;
  if (env === "supabase") return "supabase";
  if (env === "production") return "production";
  return "local";
};

export const currentEnv = determineEnv();

// Environment-specific configuration
export const config = {
  usesMockData:
    currentEnv === "local" && import.meta.env.VITE_USE_MOCK_DATA === "true",
  apiBaseUrl: (() => {
    if (currentEnv === "production") {
      return import.meta.env.VITE_API_URL || "https://api.glamourstudio.com";
    } else if (currentEnv === "supabase") {
      return import.meta.env.VITE_API_URL || "https://api.glamourstudio.com";
    } else {
      return import.meta.env.VITE_API_URL || "/api";
    }
  })(),
  apiKey: import.meta.env.VITE_API_KEY || "",
  // Supabase configuration
  supabaseUrl:
    import.meta.env.VITE_SUPABASE_URL ||
    "https://rpomumfcmmzbbnritnux.supabase.co",
  supabaseAnonKey:
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb211bWZjbW16YmJucml0bnV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDkxOTMsImV4cCI6MjA2MjQ4NTE5M30.q7nW5yidSVYYPI9X8sXcp23WcUnKS_B7txYzfFaRH44",
  isSupabase: currentEnv === "supabase",
  featureFlags: {
    showDebugInfo:
      currentEnv === "local" || import.meta.env.VITE_DEBUG_MODE === "true",
    enableAnalytics:
      currentEnv !== "local" ||
      import.meta.env.VITE_ENABLE_ANALYTICS === "true",
    enableLogging: import.meta.env.VITE_ENABLE_LOGGING === "true",
  },
} as const;

console.log(`Running in ${currentEnv} environment with config:`, config);
