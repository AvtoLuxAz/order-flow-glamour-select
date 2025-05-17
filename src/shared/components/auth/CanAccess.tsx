import React from "react";
import { logger } from "../utils/logger";

// Define permission types
export type Permission = string;
export type Role = string;

interface RBACConfig {
  roles: Record<Role, Permission[]>;
  defaultRole?: Role;
}

// Global RBAC configuration
let rbacConfig: RBACConfig = {
  roles: {},
  defaultRole: "user",
};

// Configure RBAC
export const configureRBAC = (config: RBACConfig) => {
  rbacConfig = {
    ...rbacConfig,
    ...config,
  };
  logger.info("RBAC configuration updated:", config);
};

interface CanAccessProps {
  permissions?: Permission | Permission[];
  roles?: Role | Role[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const CanAccess: React.FC<CanAccessProps> = ({
  permissions = [],
  roles = [],
  fallback = null,
  children,
}) => {
  // Convert single permission/role to array
  const requiredPermissions = Array.isArray(permissions)
    ? permissions
    : [permissions];
  const requiredRoles = Array.isArray(roles) ? roles : [roles];

  // Get current user role (implement your own logic to get the user's role)
  const getCurrentUserRole = (): Role => {
    // This should be replaced with your actual authentication logic
    return (
      (localStorage.getItem("userRole") as Role) ||
      rbacConfig.defaultRole ||
      "user"
    );
  };

  const hasRequiredPermissions = (userRole: Role): boolean => {
    // If no permissions are required, allow access
    if (requiredPermissions.length === 0 && requiredRoles.length === 0) {
      return true;
    }

    // Check role-based access
    if (requiredRoles.length > 0 && requiredRoles.includes(userRole)) {
      return true;
    }

    // Get permissions for the user's role
    const userPermissions = rbacConfig.roles[userRole] || [];

    // Check if user has all required permissions
    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );
  };

  const userRole = getCurrentUserRole();
  const canAccess = hasRequiredPermissions(userRole);

  if (!canAccess) {
    logger.warn("Access denied:", {
      userRole,
      requiredPermissions,
      requiredRoles,
    });
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Higher-order component version
export const withAccess = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  accessProps: Omit<CanAccessProps, "children">
) => {
  return function WithAccessWrapper(props: P) {
    return (
      <CanAccess {...accessProps}>
        <WrappedComponent {...props} />
      </CanAccess>
    );
  };
};

// Example usage:
// configureRBAC({
//   roles: {
//     admin: ["read:all", "write:all", "delete:all"],
//     manager: ["read:all", "write:own"],
//     user: ["read:own"],
//   },
//   defaultRole: "user",
// });
