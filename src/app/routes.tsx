import { createBrowserRouter, RouteObject } from "react-router-dom";
import { loadFeatureRoutes, mergeRoutes } from "@shared/utils/routeUtils";
import { MainLayout } from "@shared/layouts/MainLayout";
import { AuthLayout } from "@shared/layouts/AuthLayout";

// Base routes with layouts
const baseRoutes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [], // Will be populated with feature routes
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [], // Will be populated with auth routes
  },
];

// Load and merge feature routes
const routes = await loadFeatureRoutes();

// Organize routes by layout
const mainRoutes = routes.filter((route) => !route.path?.startsWith("/auth"));
const authRoutes = routes.filter((route) => route.path?.startsWith("/auth"));

// Inject routes into appropriate layouts
baseRoutes[0].children = mainRoutes;
baseRoutes[1].children = authRoutes;

// Create router instance
export const router = createBrowserRouter(baseRoutes);
