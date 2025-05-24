import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useParams, Outlet } from "react-router-dom";
import AdminVerticalNav from "../components/admin/AdminVerticalNav"; // Assuming path

// =====================================================================================
// --- Placeholder Tab Components & Related Imports ---
// In a real application, these would be imported from their respective files/modules.
// For example:
// import DashboardTab from './tabs/DashboardTab';
// import CustomersTab from './tabs/CustomersTab';
// import CustomerDetailPage from './detail/CustomerDetailPage';
// import AdminVerticalNav from '../components/navigation/AdminVerticalNav';
// =====================================================================================
const DashboardTab: React.FC = () => (
  <div data-testid="dashboard-tab">Dashboard Content</div>
);
const CustomersTab: React.FC = () => (
  <div data-testid="customers-tab">
    Customers Content. This might also contain an <Outlet /> for
    CustomerDetailPage.
  </div>
);
const ProductsTab: React.FC = () => (
  <div data-testid="products-tab">Products Content</div>
);
const ProfileTab: React.FC = () => (
  <div data-testid="profile-tab">User Profile Content</div>
);
const ServicesTab: React.FC = () => (
  <div data-testid="services-tab">Services Content</div>
);
const AppointmentsTab: React.FC = () => (
  <div data-testid="appointments-tab">Appointments Content</div>
);
const StaffTab: React.FC = () => (
  <div data-testid="staff-tab">Staff Content</div>
);
const SettingsTab: React.FC = () => (
  <div data-testid="settings-tab">Settings Content</div>
);
const CashTab: React.FC = () => (
  <div data-testid="cash-tab">Cash/Financials Content</div>
);
const CustomerDetailPage: React.FC = () => (
  <div data-testid="customer-detail-page-content">
    Customer Detail Page Content
  </div>
);
// --- End Placeholder Section ---

interface AdminTabConfig {
  key: string;
  pathSuffix: string;
  title: string;
  component: React.ElementType;
}

// Configuration for admin tabs.
// For tabFromPath logic: if pathSuffixes could overlap significantly (e.g. /settings and /settings/advanced),
// ensure the logic or order correctly prioritizes more specific matches.
// Current tabFromPath sorts by suffix length to help with this.
const adminTabsConfig: AdminTabConfig[] = [
  {
    key: "dashboard",
    pathSuffix: "/admin",
    title: "Dashboard",
    component: DashboardTab,
  },
  {
    key: "customers",
    pathSuffix: "/customers",
    title: "Customers",
    component: CustomersTab,
  },
  {
    key: "products",
    pathSuffix: "/products",
    title: "Products",
    component: ProductsTab,
  },
  {
    key: "services",
    pathSuffix: "/services",
    title: "Services",
    component: ServicesTab,
  },
  {
    key: "appointments",
    pathSuffix: "/appointments",
    title: "Appointments",
    component: AppointmentsTab,
  },
  { key: "staff", pathSuffix: "/staff", title: "Staff", component: StaffTab },
  {
    key: "settings",
    pathSuffix: "/settings",
    title: "Settings",
    component: SettingsTab,
  },
  {
    key: "cash",
    pathSuffix: "/cash",
    title: "Cash Management",
    component: CashTab,
  },
  {
    key: "profile",
    pathSuffix: "/profile",
    title: "My Profile",
    component: ProfileTab,
  }, // Assuming full path like /admin/profile
];

// Helper function to determine the active tab key from the pathname.
// Memoizing sortedConfig could be an optimization if adminTabsConfig was very large or dynamic.
const getSortedConfig = (config: AdminTabConfig[]) =>
  [...config].sort((a, b) => b.pathSuffix.length - a.pathSuffix.length);

const tabFromPath = (
  pathname: string,
  config: AdminTabConfig[],
  sortedConfig: AdminTabConfig[]
): string => {
  if (pathname === "/admin" || pathname === "/admin/") {
    return config.find((tab) => tab.key === "dashboard")?.key || "dashboard";
  }

  for (const tab of sortedConfig) {
    if (tab.pathSuffix === "/admin") continue; // Already handled by exact match
    if (pathname.endsWith(tab.pathSuffix)) {
      return tab.key;
    }
  }
  return "dashboard"; // Default fallback
};

const AdminPage: React.FC = () => {
  const location = useLocation();
  const params = useParams<{ customerId?: string }>();
  const [activeTabKey, setActiveTabKey] = useState("dashboard");

  const isCustomerDetail =
    !!params.customerId && location.pathname.startsWith("/admin/customers/");

  const sortedAdminTabsConfig = useMemo(
    () => getSortedConfig(adminTabsConfig),
    []
  );

  useEffect(() => {
    if (isCustomerDetail) {
      setActiveTabKey("customers");
    } else {
      setActiveTabKey(
        tabFromPath(location.pathname, adminTabsConfig, sortedAdminTabsConfig)
      );
    }
  }, [location.pathname, isCustomerDetail, sortedAdminTabsConfig]);

  const currentTabInfo = adminTabsConfig.find(
    (tab) => tab.key === activeTabKey
  );

  const pageTitle = isCustomerDetail
    ? "Customer Details"
    : currentTabInfo?.title || "Admin";

  const ComponentToRender = isCustomerDetail
    ? CustomerDetailPage
    : currentTabInfo?.component;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-glamour-system-background">
      <AdminVerticalNav
        activeTab={activeTabKey}
        setActiveTab={setActiveTabKey}
      />
      <main className="flex-1 p-4 md:p-6 lg:p-8 bg-white">
        <header className="mb-6">
          <h1 className="text-lg md:text-2xl font-bold text-glamour-800">
            {pageTitle}
          </h1>
        </header>
        {ComponentToRender ? (
          <ComponentToRender />
        ) : (
          <div>Select a tab or component not found.</div>
        )}
        {/* <Outlet /> */} {/* If using nested routes for tab content */}
      </main>
    </div>
  );
};

export default AdminPage;

// Developer instruction logs (Manual Testing Steps) have been removed.
// Placeholders are defined above for self-containment of this example.
// Debug logs are commented out by default; uncomment or use conditional logging for development.
