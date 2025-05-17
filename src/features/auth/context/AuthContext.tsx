import React, { createContext, useContext } from "react";
import { User, AuthFormData } from "../types";
import { useAuth } from "../hooks/useAuth";
import { ApiResponse } from "@/lib/types/api.types";
import { useSessionCleanup } from "@/shared/hooks/useSessionCleanup";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthFormData) => Promise<ApiResponse<User>>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<ApiResponse<User>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useAuth();

  // Add session cleanup on browser/tab close
  useSessionCleanup();

  return (
    <AuthContext.Provider value={auth}>
      {auth.isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
