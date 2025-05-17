import React from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import type { CanAccessProps, Permission } from "./types";

const defaultPermissions = {
  admin: ["*"],
  staff: [
    "appointments:create",
    "appointments:read",
    "appointments:edit",
    "customers:read",
    "customers:create",
  ],
  cashier: ["payments:create", "payments:read", "customers:read"],
  user: ["appointments:read", "payments:read"],
} as const;

export const CanAccess: React.FC<CanAccessProps> = ({
  roles = [],
  permissions = [],
  children,
}) => {
  const { user } = useAuth();

  if (!user) return null;

  const hasRole = roles.length === 0 || roles.includes(user.role);

  const userPermissions = defaultPermissions[user.role] || [];
  const hasPermission =
    permissions.length === 0 ||
    userPermissions.includes("*") ||
    permissions.every((permission) =>
      userPermissions.includes(permission as Permission)
    );

  if (!hasRole || !hasPermission) return null;

  return <>{children}</>;
};
