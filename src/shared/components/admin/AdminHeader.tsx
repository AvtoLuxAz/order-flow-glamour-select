import React, { useState } from "react";
import { Bell, Search, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useMobile } from "@/shared/hooks/use-mobile";
import { cn } from "@/shared/lib/utils";
import { config } from "@/config/env";

const AdminHeader = () => {
  const isMobile = useMobile();
  const [searchVisible, setSearchVisible] = useState(false);

  // Determine environment indicator
  const getEnvIndicator = () => {
    // There is no featureFlags in config, use features.enableMockData for mock mode
    // and show debug info if in development mode
    if (!config.app.isDevelopment) return null;

    return (
      <div className="px-2 py-1 rounded text-xs font-semibold hidden md:block">
        {config.usesMockData ? (
          <span className="text-amber-600">LOCAL MODE</span>
        ) : (
          <span className="text-green-600">API MODE</span>
        )}
      </div>
    );
  };

  return (
    <header className="bg-white border-b px-4 md:px-6 py-3 flex items-center justify-between">
      {isMobile && searchVisible ? (
        <div className="flex-1 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={() => setSearchVisible(false)}
          >
            <X size={20} />
          </Button>
        </div>
      ) : (
        <>
          <div className={cn("relative", isMobile ? "w-auto" : "w-64")}>
            {isMobile ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchVisible(true)}
              ></Button>
            ) : (
              <></>
            )}
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-1 md:gap-2"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              <LogOut size={18} />
              {!isMobile && <span>Çıx</span>}
            </Button>
          </div>
        </>
      )}

      {/* Add environment indicator */}
      {getEnvIndicator()}
    </header>
  );
};

export default AdminHeader;
