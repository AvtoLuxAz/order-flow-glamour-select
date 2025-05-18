// Service model and related types
export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceFormData {
  name: string;
  description: string;
  price: number;
  duration: number;
  image_url?: string;
}

export interface ServiceBenefit {
  text: string;
}
