// Customer model and related types
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  lastVisit: string;
  totalSpent: number;
  created_at?: string;
  updated_at?: string;
}

export type CustomerFormData = Omit<
  Customer,
  "id" | "lastVisit" | "totalSpent"
>;

// Customer filters
export interface CustomerFilters {
  search?: string;
  gender?: string;
  sortBy?: "name" | "lastVisit" | "totalSpent";
  sortOrder?: "asc" | "desc";
}
