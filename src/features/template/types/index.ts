// Template entity type
export interface Template {
  id: number;
  name: string;
  description?: string;
  category: string;
  created_at: string;
  updated_at: string;
}

// Form data type
export interface TemplateFormData {
  name: string;
  description?: string;
  category: string;
}

// API response types
export interface TemplateListResponse {
  data: Template[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

// Filter/Search params
export interface TemplateFilters {
  search?: string;
  category?: string;
  sortBy?: "name" | "createdAt" | "category";
  sortOrder?: "asc" | "desc";
}

// State type for the template feature
export interface TemplateState {
  data: Template[];
  selectedTemplate: Template | null;
  filters: TemplateFilters;
  isLoading: boolean;
  error: string | null;
}
