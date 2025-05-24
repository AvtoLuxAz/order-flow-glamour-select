import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { User } from "../models/user.model";
import { toast } from "react-hot-toast";

interface UserContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>; // Changed params
  signup: (
    email: string,
    password: string,
    full_name?: string
  ) => Promise<void>; // Changed params, full_name is example
  logout: () => Promise<void>;
  fetchUserProfile: (supabaseUser: SupabaseUser) => Promise<User | null>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export { UserContext };

interface UserProviderProps {
  children: ReactNode;
}

// Consider wrapping development-specific console.logs with
// if (process.env.NODE_ENV === 'development') { /* ... */ } for cleaner production builds.

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // fetchUserProfile: Fetches detailed user profile from 'users' table
  // and incorporates info from SupabaseUser (auth user object).
  const fetchUserProfile = async (
    supabaseUser: SupabaseUser
  ): Promise<User | null> => {
    console.log("fetchUserProfile called for user:", supabaseUser.id); // Dev log
    try {
      setIsLoading(true);
      // Explicitly select columns to ensure consistency and clarity
      const { data: profileData, error } = await supabase
        .from("users")
        .select("id, role, email, first_name, last_name")
        .eq("id", supabaseUser.id)
        .single();

      if (error) {
        console.warn(
          `User profile not found for id ${supabaseUser.id} or error fetching:`,
          error.message
        );
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email,
          role: "user",
          isActive: true,
          lastLoginAt: supabaseUser.last_sign_in_at,
        });
        toast.error(
          `Could not fetch your profile details. Some features might be limited.`
        );
        return null;
      }

      if (profileData) {
        console.log("Profile data received:", profileData);
        const appUser: User = {
          id: profileData.id,
          email: profileData.email || supabaseUser.email,
          role: profileData.role || "user",
          firstName: profileData.first_name,
          lastName: profileData.last_name,
          isActive: true,
          lastLoginAt: supabaseUser.last_sign_in_at,
        };
        console.log("Mapped appUser object:", appUser); // Dev log
        setUser(appUser);
        return appUser;
      }
      console.warn(
        "fetchUserProfile: profileData was null or undefined without an error."
      ); // Dev warning
      return null;
    } catch (e) {
      // Changed error variable name for clarity
      const error = e as Error; // Type assertion
      console.error("Exception during fetchUserProfile:", error.message); // Dev error
      toast.error("An unexpected error occurred while fetching your profile.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    supabase.auth
      .getSession()
      .then(async ({ data: { session: currentSession } }) => {
        // Renamed session for clarity
        console.log("Initial getSession response:", currentSession); // Dev log
        setSession(currentSession);
        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        // Renamed session for clarity
        console.log("onAuthStateChange event:", _event, "session:", newSession); // Dev log
        setSession(newSession);
        if (newSession?.user) {
          setIsLoading(true);
          await fetchUserProfile(newSession.user);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); // Empty dependency array is correct for onAuthStateChange setup

  const login = async (email: string, password: string) => {
    // Standardized params
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast.error(`Login failed: ${error.message}`);
        console.error("Login error:", error.message); // Dev error
      } else {
        toast.success("Logged in successfully!");
        // User profile will be fetched by onAuthStateChange
      }
    } catch (e) {
      // Changed error variable name
      const error = e as Error;
      toast.error(
        `Login error: ${error.message || "An unexpected error occurred."}`
      );
      console.error("Login exception:", error.message); // Dev error
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    full_name?: string
  ) => {
    // Standardized params
    setIsLoading(true);
    try {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              // full_name: full_name, // Example: if passing additional data during signup
            },
          },
        });

      if (signUpError) {
        toast.error(`Signup failed: ${signUpError.message}`);
        console.error("Signup error:", signUpError.message); // Dev error
        return;
      }

      if (signUpData.user) {
        toast.success("Signup successful! Please check your email to verify.");
        // Profile population handled by onAuthStateChange and fetchUserProfile,
        // assuming a DB trigger or post-signup logic handles 'users' table entry.
      }
    } catch (e) {
      // Changed error variable name
      const error = e as Error;
      toast.error(
        `Signup error: ${error.message || "An unexpected error occurred."}`
      );
      console.error("Signup exception:", error.message); // Dev error
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(`Logout failed: ${error.message}`);
        console.error("Logout error:", error.message); // Dev error
      } else {
        toast.success("Logged out successfully!");
        setUser(null);
        setSession(null);
      }
    } catch (e) {
      // Changed error variable name
      const error = e as Error;
      toast.error(
        `Logout error: ${error.message || "An unexpected error occurred."}`
      );
      console.error("Logout exception:", error.message); // Dev error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        session,
        isLoading,
        login,
        signup,
        logout,
        fetchUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
