import React from "react";
import { Spinner } from "../../atoms/Spinner";

interface WithStatusProps {
  loading?: boolean;
  error?: string | null;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

export const WithStatus: React.FC<WithStatusProps> = ({
  loading = false,
  error = null,
  children,
  loadingComponent = <Spinner />,
  errorComponent = DefaultError,
}) => {
  if (loading) return <>{loadingComponent}</>;
  if (error)
    return (
      <>
        {typeof errorComponent === "function"
          ? errorComponent({ error })
          : errorComponent}
      </>
    );
  return <>{children}</>;
};

interface ErrorProps {
  error: string;
}

const DefaultError: React.FC<ErrorProps> = ({ error }) => (
  <div className="bg-red-50 text-red-500 p-4 rounded-md">
    <p className="text-sm">{error}</p>
  </div>
);
