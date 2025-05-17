import { Toaster } from "./shared/components/ui/toaster";
import { Toaster as Sonner } from "./shared/components/ui/sonner";
import { TooltipProvider } from "./shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./hooks/use-auth";
import RequireAuth from "./components/auth/RequireAuth";
import Index from "./features/pages/Index";
import Login from "./features/pages/Login";
import Booking from "./features/pages/Booking";
import BookingDetails from "./features/pages/BookingDetails";
import Admin from "./features/pages/Admin";
import NotFound from "./features/pages/NotFound";
import Services from "./features/pages/Services";
import ServiceDetail from "./features/pages/ServiceDetail";
import Products from "./features/pages/Products";
import ProductDetail from "./features/pages/ProductDetail";
import About from "./features/pages/About";
import Contact from "./features/pages/Contact";
import CustomerDetailPage from "./features/pages/CustomerDetailPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/booking" element={<Booking />} />
            <Route
              path="/booking-details/:orderId"
              element={<BookingDetails />}
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <RequireAuth allowedRoles={["admin", "staff", "cashier"]}>
                  <Admin />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <RequireAuth allowedRoles={["admin", "staff"]}>
                  <Admin />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/services"
              element={
                <RequireAuth allowedRoles={["admin", "staff"]}>
                  <Admin />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/products"
              element={
                <RequireAuth allowedRoles={["admin", "staff", "cashier"]}>
                  <Admin />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/appointments"
              element={
                <RequireAuth allowedRoles={["admin", "staff"]}>
                  <Admin />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/cash"
              element={
                <RequireAuth allowedRoles={["admin", "cashier"]}>
                  <Admin />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/staff"
              element={
                <RequireAuth allowedRoles={["admin"]}>
                  <Admin />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <RequireAuth allowedRoles={["admin"]}>
                  <Admin />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <RequireAuth allowedRoles={["admin", "staff", "cashier"]}>
                  <Admin />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/customers/:customerId"
              element={
                <RequireAuth allowedRoles={["admin", "staff"]}>
                  <CustomerDetailPage />
                </RequireAuth>
              }
            />

            {/* Public Routes */}
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
