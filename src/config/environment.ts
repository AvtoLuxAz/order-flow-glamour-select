import { config, currentEnv } from "./env";

export type Environment = "local" | "supabase" | "production";

export interface EnvironmentConfig {
  environment: Environment;
  useMockData: boolean;
  isSupabase: boolean;
  isProduction: boolean;
  debugMode: boolean;
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiUrl: string;
}

export const envConfig: EnvironmentConfig = {
  environment: currentEnv,
  useMockData: config.usesMockData,
  isSupabase: currentEnv === "supabase",
  isProduction: currentEnv === "production",
  debugMode: config.featureFlags.showDebugInfo,
  supabaseUrl: config.supabaseUrl,
  supabaseAnonKey: config.supabaseAnonKey,
  apiUrl: config.apiBaseUrl,
};
