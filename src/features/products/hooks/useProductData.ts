import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Product } from "@/models/product.model";
import { productService } from "@/services";
import { ApiResponse } from "@/services/apiClient";

interface ProductDataOptions {
  isFeatured?: boolean;
  limit?: number;
}

// Overload signatures for better type inference by the caller
export function useProductData(
  productId: string | number
): UseQueryResult<Product | null, Error>;
export function useProductData(
  options: ProductDataOptions
): UseQueryResult<Product[], Error>;
export function useProductData(): UseQueryResult<Product[], Error>; // For all products

export function useProductData(
  arg?: string | number | ProductDataOptions
): UseQueryResult<Product | Product[] | null, Error> {
  let productId: string | number | undefined;
  let options: ProductDataOptions | undefined;

  if (typeof arg === "string" || typeof arg === "number") {
    productId = arg;
  } else if (typeof arg === "object" && arg !== null) {
    options = arg;
  }

  const fetchProducts = async (): Promise<Product[]> => {
    const response: ApiResponse<Product[]> = await productService.getProducts();
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data || [];
  };

  const fetchProductById = async (
    id: string | number
  ): Promise<Product | null> => {
    const numericId = typeof id === "string" ? parseInt(id, 10) : id;
    const response: ApiResponse<Product> = await productService.getProductById(
      numericId
    );
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data || null;
  };

  const fetchFeaturedProducts = async (limit?: number): Promise<Product[]> => {
    const response: ApiResponse<Product[]> = await productService.getFeatured(
      limit
    );
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data || [];
  };

  // Query for a single product by ID
  const productQuery = useQuery<Product | null, Error>({
    queryKey: ["products", productId],
    queryFn: () => fetchProductById(productId!),
    enabled: !!productId,
  });

  // Query for featured products
  const featuredProductsQuery = useQuery<Product[], Error>({
    queryKey: ["products", "featured", { limit: options?.limit ?? 4 }],
    queryFn: () => fetchFeaturedProducts(options?.limit),
    enabled: !!options?.isFeatured && !productId,
  });

  // Query for all products (default)
  const allProductsQuery = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
    enabled: !productId && !options?.isFeatured,
  });

  if (productId) {
    // Type assertion needed because the function signature guarantees this path returns UseQueryResult<Product | null, Error>
    return productQuery as UseQueryResult<Product | Product[] | null, Error>;
  }

  if (options?.isFeatured) {
    return featuredProductsQuery as UseQueryResult<
      Product | Product[] | null,
      Error
    >;
  }

  return allProductsQuery as UseQueryResult<Product | Product[] | null, Error>;
}
