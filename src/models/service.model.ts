export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration?: number;
  category?: string;
  image?: string;
  isActive?: boolean;
  created_at: string;
  updated_at: string;
}
