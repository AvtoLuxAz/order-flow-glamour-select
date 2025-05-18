import { createClient } from "@supabase/supabase-js";
import { Database } from "../lib/database.types";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://rpomumfcmmzbbnritnux.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb211bWZjbW16YmJucml0bnV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDkxOTMsImV4cCI6MjA2MjQ4NTE5M30.q7nW5yidSVYYPI9X8sXcp23WcUnKS_B7txYzfFaRH44";

console.log("Initializing Supabase client with URL:", supabaseUrl);

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Test the connection
supabase
  .from("customers")
  .select("*")
  .then(({ data, error }) => {
    if (error) {
      console.error("Supabase connection test failed:", error);
    } else {
      console.log(
        "Supabase connection test successful, found",
        data?.length,
        "customers"
      );
    }
  });

// Helper functions for common operations
export const getCustomers = async () => {
  const { data, error } = await supabase.from("customers").select("*");
  if (error) throw error;
  return data;
};

export const getAppointments = async () => {
  const { data, error } = await supabase
    .from("appointments")
    .select("*, customers(*)");
  if (error) throw error;
  return data;
};

export const getServices = async () => {
  const { data, error } = await supabase
    .from("services")
    .select("*, products(*)");
  if (error) throw error;
  return data;
};

export const getProducts = async () => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw error;
  return data;
};

export const getStaff = async () => {
  const { data, error } = await supabase.from("staff").select("*");
  if (error) throw error;
  return data;
};

export const getPayments = async () => {
  const { data, error } = await supabase
    .from("payments")
    .select("*, appointments(*)");
  if (error) throw error;
  return data;
};
