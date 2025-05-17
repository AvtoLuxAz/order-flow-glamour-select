import { useState, useCallback, useEffect } from "react";
import { AuthFormData, User, UserSession } from "../types";
import { authService } from "../services/auth.service";
import { config } from "@/config/env";

const initialSession: UserSession = {
  user: null,
  token: null,
  isAuthenticated: false,
  expiresAt: null,
};

export const useAuth = () => {
  const [session, setSession] = useState<UserSession>(initialSession);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const token = localStorage.getItem(config.auth.tokenKey);
    const expiresAt = localStorage.getItem(config.auth.tokenExpireKey);

    if (token && expiresAt) {
      // Check if token is expired
      if (Number(expiresAt) > Date.now()) {
        // Token is still valid, get user data
        authService
          .getCurrentUser(token)
          .then((response) => {
            if (response.data) {
              setSession({
                user: response.data,
                token,
                isAuthenticated: true,
                expiresAt: Number(expiresAt),
              });
            } else {
              // Invalid token or user data
              handleLogout();
            }
          })
          .catch(() => handleLogout())
          .finally(() => setIsLoading(false));
      } else {
        // Token is expired
        handleLogout();
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(config.auth.tokenKey);
    localStorage.removeItem(config.auth.tokenExpireKey);
    localStorage.removeItem(config.auth.refreshTokenKey);
    setSession(initialSession);
  }, []);

  const login = useCallback(async (credentials: AuthFormData) => {
    try {
      const response = await authService.login(credentials);

      if (response.data) {
        const { user, token, expiresAt } = response.data;

        // Store auth data
        localStorage.setItem(config.auth.tokenKey, token);
        localStorage.setItem(config.auth.tokenExpireKey, String(expiresAt));

        setSession({
          user,
          token,
          isAuthenticated: true,
          expiresAt,
        });

        return { data: user };
      }

      return { error: response.error || "Login failed" };
    } catch (error) {
      return { error: "An unexpected error occurred" };
    }
  }, []);

  const updateUser = useCallback(
    async (userData: Partial<User>) => {
      if (!session.user?.id) return { error: "No user logged in" };

      try {
        const response = await authService.updateUser(
          session.user.id,
          userData
        );

        if (response.data) {
          setSession((prev) => ({
            ...prev,
            user: response.data,
          }));
          return { data: response.data };
        }

        return { error: response.error || "Failed to update user" };
      } catch (error) {
        return { error: "An unexpected error occurred" };
      }
    },
    [session.user?.id]
  );

  return {
    user: session.user,
    token: session.token,
    isAuthenticated: session.isAuthenticated,
    isLoading,
    login,
    logout: handleLogout,
    updateUser,
  };
};
