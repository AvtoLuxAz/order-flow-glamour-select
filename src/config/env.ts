// Environment configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
    timeout: 30000, // 30 seconds
  },

  // Feature Flags
  features: {
    enableMockData: import.meta.env.VITE_USE_MOCK_DATA === "true",
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  },

  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },

  // Application Settings
  app: {
    name: "AzEstetik",
    version: "1.0.0",
    environment: import.meta.env.MODE,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  },

  // Use mock data if enabled in features or if Supabase credentials are not set
  get usesMockData() {
    return (
      this.features.enableMockData ||
      !this.supabase.url ||
      !this.supabase.anonKey
    );
  },
};
