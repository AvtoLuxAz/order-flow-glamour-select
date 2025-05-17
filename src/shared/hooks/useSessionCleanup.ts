import { useEffect } from "react";
import { config } from "@/config/env";

export function useSessionCleanup() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear all auth-related data from localStorage
      localStorage.removeItem(config.auth.tokenKey);
      localStorage.removeItem(config.auth.tokenExpireKey);
      localStorage.removeItem(config.auth.refreshTokenKey);

      // Clear any other session-related data
      sessionStorage.clear();
    };

    // Add event listener for tab/browser close
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
}
