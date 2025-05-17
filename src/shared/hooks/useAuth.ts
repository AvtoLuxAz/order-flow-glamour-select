import { useState, useEffect, useCallback } from "react";
import { createClient, User } from "@supabase/supabase-js";
import { config } from "@/config/env";
import type { UserRole } from "../components/molecules/CanAccess/types";

interface AuthUser extends User {
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

const supabase = createClient(config.supabase.url, config.supabase.apiKey);

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  // Get current session and user data
  const getCurrentUser = useCallback(async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      if (session?.user) {
        // Get user's role from user_roles table
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();

        if (roleError) throw roleError;

        const userWithRole = {
          ...session.user,
          role: roleData?.role || "user",
        } as AuthUser;

        setState({ user: userWithRole, isLoading: false, error: null });
      } else {
        setState({ user: null, isLoading: false, error: null });
      }
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : "Authentication error",
      });
    }
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      await getCurrentUser();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Sign in failed",
      }));
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setState({ user: null, isLoading: false, error: null });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Sign out failed",
      }));
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    getCurrentUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        getCurrentUser();
      } else {
        setState({ user: null, isLoading: false, error: null });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [getCurrentUser]);

  return {
    ...state,
    signIn,
    signOut,
  };
}
