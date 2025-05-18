import { supabase } from "@/lib/supabase";
import { ApiResponse } from "@/models/types";
import { Service } from "@/models/service.model";

export class ServiceService {
  async getAll(): Promise<ApiResponse<Service[]>> {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) {
      return { error: error.message };
    }

    return { data: data as Service[] };
  }

  async getById(id: number): Promise<ApiResponse<Service>> {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data: data as Service };
  }

  async create(
    service: Omit<Service, "id" | "created_at" | "updated_at">
  ): Promise<ApiResponse<Service>> {
    const { data, error } = await supabase
      .from("services")
      .insert(service)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data: data as Service };
  }

  async update(
    id: number,
    service: Partial<Service>
  ): Promise<ApiResponse<Service>> {
    const { data, error } = await supabase
      .from("services")
      .update(service)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data: data as Service };
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    const { error } = await supabase
      .from("services")
      .update({ is_active: false })
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    return { data: undefined };
  }

  async getRelatedProducts(serviceId: number): Promise<ApiResponse<number[]>> {
    const { data, error } = await supabase
      .from("service_products")
      .select("product_id")
      .eq("service_id", serviceId);

    if (error) {
      return { error: error.message };
    }

    return { data: data.map((item) => item.product_id) };
  }
}

export const serviceService = new ServiceService();
