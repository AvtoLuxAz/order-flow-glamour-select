import { UserContext } from "../context/UserContext";
import { User } from "../models/user.model";
import React from "react";

// Define a type for permission (can be extended for more granular permissions)
export type Permission = "view_dashboard" | "manage_settings" | "delete_users"; // Example permissions

interface AuthHook {
  user: User | null;
  isLoading: boolean;
  checkAccess: (allowedRoles: string[]) => boolean;
  hasPermission: (permission: Permission) => boolean;
}

// Consider wrapping development-specific console.logs with
// if (process.env.NODE_ENV === 'development') { /* ... */ } for cleaner production builds.

export const useAuth = (): AuthHook => {
  const { user, isLoading } = React.useContext(UserContext);

  const checkAccess = (allowedRoles: string[]): boolean => {
    if (isLoading || !user?.role) {
      // Simplified check for user and user.role
      // console.log('checkAccess: Loading or no user/role, access denied.'); // Dev log
      return false;
    }
    const hasAccess = allowedRoles.includes(user.role);
    // console.log(`checkAccess: User role: "${user.role}", Allowed roles: [${allowedRoles.join(', ')}], Access granted: ${hasAccess}`); // Dev log
    return hasAccess;
  };

  // Placeholder for hasPermission, can be expanded based on application needs.
  // This example demonstrates role-based implicit permissions.
  const hasPermission = (permission: Permission): boolean => {
    if (isLoading || !user?.role) {
      // Simplified check for user and user.role
      // console.log('hasPermission: Loading or no user/role, permission denied.'); // Dev log
      return false;
    }

    // console.log(`hasPermission: Checking permission "${permission}" for user role "${user.role}".`); // Dev log

    // Example permission logic:
    switch (user.role) {
      case "admin":
        // console.log('hasPermission: Admin role has all permissions. Access granted.'); // Dev log
        return true;
      case "editor":
        if (
          permission === "view_dashboard" ||
          permission === "manage_settings"
        ) {
          // console.log(`hasPermission: Editor role has permission "${permission}". Access granted.`); // Dev log
          return true;
        }
        break;
      case "viewer":
        if (permission === "view_dashboard") {
          // console.log(`hasPermission: Viewer role has permission "${permission}". Access granted.`); // Dev log
          return true;
        }
        break;
      default:
        // console.log(`hasPermission: Role "${user.role}" has no explicit permission for "${permission}". Access denied.`); // Dev log
        return false;
    }
    // console.log(`hasPermission: Role "${user.role}" does not have permission "${permission}". Access denied.`); // Dev log
    return false;
  };

  // For active debugging:
  // if (process.env.NODE_ENV === 'development') {
  //   console.log("useAuth state:", { user, isLoading });
  // }

  return {
    user,
    isLoading,
    checkAccess,
    hasPermission,
  };
};

// Developer instruction logs (Manual Testing Steps) have been removed from the file content.
// Such instructions are better suited for READMEs or external documentation.
// Development-time console.logs for debugging data flow are kept (commented out by default for brevity)
// but should be conditionally rendered (e.g., via process.env.NODE_ENV === 'development') in production apps.
