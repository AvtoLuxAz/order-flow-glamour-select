// Common type definitions
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncStatus = "idle" | "loading" | "success" | "error";

// API related types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

// Auth related types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
}

export interface AuthState {
  user: Nullable<User>;
  isAuthenticated: boolean;
  token: Nullable<string>;
}

// Common component props
export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
}

// Form related types
export interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  validation?: Record<string, unknown>;
}

export interface FormConfig {
  fields: FormField[];
  submitLabel: string;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}
