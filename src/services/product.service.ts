import { Product, ProductFormData } from "@/models/product.model";
import { supabase } from "@/integrations/supabase/client";
import { ApiResponse } from "./apiClient";

export const productService = {
  // Basic CRUD methods
  getAll: async (): Promise<ApiResponse<Product[]>> => {
    try {
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  },

  getById: async (id: number): Promise<ApiResponse<Product>> => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  },

  create: async (
    productData: ProductFormData
  ): Promise<ApiResponse<Product>> => {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([productData])
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  },

  update: async (
    id: number,
    productData: Partial<ProductFormData>
  ): Promise<ApiResponse<Product>> => {
    try {
      const { data, error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  },

  delete: async (id: number): Promise<ApiResponse<boolean>> => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: true, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  },

  // Additional methods - make sure they call the basic methods
  getProducts: async (): Promise<ApiResponse<Product[]>> => {
    return productService.getAll();
  },

  getProductById: async (id: number): Promise<ApiResponse<Product>> => {
    return productService.getById(id);
  },

  createProduct: async (
    productData: ProductFormData
  ): Promise<ApiResponse<Product>> => {
    return productService.create(productData);
  },

  updateProduct: async (
    id: number,
    productData: Partial<ProductFormData>
  ): Promise<ApiResponse<Product>> => {
    return productService.update(id, productData);
  },

  deleteProduct: async (id: number): Promise<ApiResponse<boolean>> => {
    return productService.delete(id);
  },

  getByServiceId: async (
    serviceId: number
  ): Promise<ApiResponse<Product[]>> => {
    try {
      const { data, error } = await supabase
        .from("service_products")
        .select("product_id")
        .eq("service_id", serviceId);

      if (error) {
        return { data: null, error: error.message };
      }

      if (!data || data.length === 0) {
        return { data: [], error: null };
      }

      const productIds = data.map((item) => item.product_id);

      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds);

      if (productsError) {
        return { data: null, error: productsError.message };
      }

      return { data: products, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  },

  getFeatured: async (limit = 4): Promise<ApiResponse<Product[]>> => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  },
};
