import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@shared/components/organisms/Navbar";
import { Sidebar } from "@shared/components/organisms/Sidebar";
import { useAuth } from "@shared/hooks";
import { WithStatus } from "@shared/components/molecules";

export const MainLayout: React.FC = () => {
  const { isLoading, error } = useAuth();

  return (
    <WithStatus loading={isLoading} error={error}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </WithStatus>
  );
};
