export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  gender: string;
}
