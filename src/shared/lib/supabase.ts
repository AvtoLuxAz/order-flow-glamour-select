import { createClient } from "@supabase/supabase-js";
import { config } from "@/config/env";

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate Supabase URL
const isValidUrl = (url: string | undefined) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Create mock client
const createMockClient = () => ({
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: [], error: null }),
    update: () => Promise.resolve({ data: [], error: null }),
    delete: () => Promise.resolve({ data: [], error: null }),
  }),
  auth: {
    signIn: () => Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
  },
});

// Initialize Supabase client
let supabase;

if (config.usesMockData || !isValidUrl(supabaseUrl) || !supabaseAnonKey) {
  console.warn("Using mock Supabase client - no real database connection");
  supabase = createMockClient();
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Failed to create Supabase client:", error);
    supabase = createMockClient();
  }
}

export { supabase };
