import { ApiService } from "./api.service";
import { Customer, CustomerFormData } from "@/models/customer.model";
import { ApiResponse } from "@/models/types";
import { config } from "@/config/env";
import { mockCustomers } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";

export class CustomerService extends ApiService {
  // Get all customers
  async getAll(): Promise<ApiResponse<Customer[]>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { data: mockCustomers as Customer[] };
    }

    try {
      const { data, error } = await supabase.from("customers").select("*");
      if (error) {
        console.error("Supabase error:", error);
        return { error: error.message };
      }
      return { data: data as Customer[] };
    } catch (error) {
      console.error("Error fetching customers:", error);
      return { error: "Failed to fetch customers" };
    }
  }

  // Get a single customer by id
  async getById(id: number | string): Promise<ApiResponse<Customer>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const customer = mockCustomers.find((c) => c.id === Number(id));
      return {
        data: customer ? (customer as Customer) : undefined,
        error: customer ? undefined : "Customer not found",
      };
    }

    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Supabase error:", error);
        return { error: error.message };
      }
      return { data: data as Customer };
    } catch (error) {
      console.error("Error fetching customer:", error);
      return { error: "Failed to fetch customer" };
    }
  }

  // Create a new customer
  async create(customer: CustomerFormData): Promise<ApiResponse<Customer>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newCustomer = {
        ...customer,
        id: Math.max(0, ...mockCustomers.map((c) => c.id)) + 1,
        lastVisit: new Date().toISOString().split("T")[0],
        totalSpent: 0,
      } as Customer;

      mockCustomers.unshift(newCustomer);
      return { data: newCustomer };
    }

    try {
      const { data, error } = await supabase
        .from("customers")
        .insert([customer])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        return { error: error.message };
      }
      return { data: data as Customer };
    } catch (error) {
      console.error("Error creating customer:", error);
      return { error: "Failed to create customer" };
    }
  }

  // Update an existing customer
  async update(
    id: number | string,
    customer: CustomerFormData
  ): Promise<ApiResponse<Customer>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = mockCustomers.findIndex((c) => c.id === Number(id));
      if (index >= 0) {
        mockCustomers[index] = {
          ...mockCustomers[index],
          ...customer,
        } as Customer;
        return { data: mockCustomers[index] as Customer };
      }
      return { error: "Customer not found" };
    }

    try {
      const { data, error } = await supabase
        .from("customers")
        .update(customer)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        return { error: error.message };
      }
      return { data: data as Customer };
    } catch (error) {
      console.error("Error updating customer:", error);
      return { error: "Failed to update customer" };
    }
  }

  // Delete a customer
  async deleteCustomer(id: number | string): Promise<ApiResponse<boolean>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = mockCustomers.findIndex((c) => c.id === Number(id));
      if (index >= 0) {
        mockCustomers.splice(index, 1);
        return { data: true };
      }
      return { error: "Customer not found" };
    }

    try {
      const { error } = await supabase.from("customers").delete().eq("id", id);

      if (error) {
        console.error("Supabase error:", error);
        return { error: error.message };
      }
      return { data: true };
    } catch (error) {
      console.error("Error deleting customer:", error);
      return { error: "Failed to delete customer" };
    }
  }
}

// Create a singleton instance
export const customerService = new CustomerService();
