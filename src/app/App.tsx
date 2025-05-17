import React, { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { WithStatus } from "@shared/components/molecules";
import { validateEnvironment, logValidationErrors } from "@env/validation";
import { config } from "@env/config";

export const App: React.FC = () => {
  useEffect(() => {
    if (config.env !== "production") {
      const errors = validateEnvironment();
      logValidationErrors(errors);
    }
  }, []);

  return (
    <Suspense
      fallback={
        <WithStatus loading>
          <div className="min-h-screen" />
        </WithStatus>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
};
