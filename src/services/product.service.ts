import { supabase } from "@/lib/supabase";
import { ApiResponse } from "@/models/types";
import { Product } from "@/models/product.model";

export class ProductService {
  async getAll(): Promise<ApiResponse<Product[]>> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) {
      return { error: error.message };
    }

    return { data: data as Product[] };
  }

  async getById(id: number): Promise<ApiResponse<Product>> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data: data as Product };
  }

  async create(
    product: Omit<Product, "id" | "created_at" | "updated_at">
  ): Promise<ApiResponse<Product>> {
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data: data as Product };
  }

  async update(
    id: number,
    product: Partial<Product>
  ): Promise<ApiResponse<Product>> {
    const { data, error } = await supabase
      .from("products")
      .update(product)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data: data as Product };
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    const { error } = await supabase
      .from("products")
      .update({ is_active: false })
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    return { data: undefined };
  }

  async updateStock(
    id: number,
    quantity: number
  ): Promise<ApiResponse<Product>> {
    const { data, error } = await supabase
      .from("products")
      .update({ stock_quantity: quantity })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data: data as Product };
  }

  async getRelatedServices(productId: number): Promise<ApiResponse<number[]>> {
    const { data, error } = await supabase
      .from("service_products")
      .select("service_id")
      .eq("product_id", productId);

    if (error) {
      return { error: error.message };
    }

    return { data: data.map((item) => item.service_id) };
  }
}

export const productService = new ProductService();
