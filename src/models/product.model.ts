export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity?: number;
  category?: string;
  image?: string;
  isActive?: boolean;
  created_at: string;
  updated_at: string;
}
