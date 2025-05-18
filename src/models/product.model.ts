// Product model and related types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  image_url?: string;
  stock_quantity: number;
}
