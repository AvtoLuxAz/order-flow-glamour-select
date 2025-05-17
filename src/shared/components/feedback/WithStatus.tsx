import React from "react";
import { ErrorBoundary } from "./ErrorBoundary";

interface WithStatusProps {
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  children: React.ReactNode;
}

export const WithStatus: React.FC<WithStatusProps> = ({
  isLoading = false,
  isError = false,
  error = null,
  loadingFallback,
  errorFallback,
  children,
}) => {
  // Default loading fallback
  const defaultLoadingFallback = (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  // Default error fallback
  const defaultErrorFallback = (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center">
        <svg
          className="w-5 h-5 text-red-500 mr-2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-sm font-medium text-red-800">
          {error?.message || "An error occurred"}
        </h3>
      </div>
    </div>
  );

  if (isLoading) {
    return <>{loadingFallback || defaultLoadingFallback}</>;
  }

  if (isError) {
    return <>{errorFallback || defaultErrorFallback}</>;
  }

  return <ErrorBoundary>{children}</ErrorBoundary>;
};

// Higher-order component version
export const withStatus = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  statusProps?: Omit<WithStatusProps, "children">
) => {
  return function WithStatusWrapper(props: P) {
    return (
      <WithStatus {...statusProps}>
        <WrappedComponent {...props} />
      </WithStatus>
    );
  };
};
