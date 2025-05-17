export type UserRole = "admin" | "staff" | "cashier" | "user";

export type Permission =
  | "appointments:create"
  | "appointments:read"
  | "appointments:edit"
  | "appointments:delete"
  | "payments:create"
  | "payments:read"
  | "payments:edit"
  | "payments:delete"
  | "customers:create"
  | "customers:read"
  | "customers:edit"
  | "customers:delete";

export interface RolePermissions {
  [key: string]: Permission[];
}

export interface CanAccessProps {
  roles?: UserRole[];
  permissions?: Permission[];
  children: React.ReactNode;
}
