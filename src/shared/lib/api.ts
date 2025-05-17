import { supabase } from "@/config/supabase";
import { Customer, CustomerFormData } from "@/models/customer.model";

class ApiService {
  customers = {
    list: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data };
    },

    create: async (customerData: CustomerFormData) => {
      const { data, error } = await supabase
        .from("customers")
        .insert([customerData])
        .select()
        .single();

      if (error) throw error;
      return { data };
    },

    update: async (id: string, customerData: Partial<CustomerFormData>) => {
      const { data, error } = await supabase
        .from("customers")
        .update(customerData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { data };
    },

    delete: async (id: string) => {
      const { error } = await supabase.from("customers").delete().eq("id", id);

      if (error) throw error;
      return { success: true };
    },

    getById: async (id: string) => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return { data };
    },
  };
}

export const API = new ApiService();
