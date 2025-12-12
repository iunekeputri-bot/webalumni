import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/alumni/Dashboard";
import JobListings from "./pages/alumni/JobListings";
import JobApplicationForm from "./pages/alumni/JobApplicationForm";
import MyApplications from "./pages/alumni/MyApplications";
import ApplicationDetails from "./pages/alumni/ApplicationDetails";
import CompanyAuth from "./pages/company/CompanyAuth";
const CompanyDashboard = lazy(() => import("./pages/company/CompanyDashboard"));
import AdminAuth from "./pages/admin/AdminAuth";
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const SuperAdminDashboard = lazy(() => import("./pages/admin/SuperAdminDashboard"));
import MaintenancePage from "./pages/MaintenancePage";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MaintenanceProvider, useMaintenance } from "@/context/MaintenanceContext";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const { isMaintenanceMode, isChecking } = useMaintenance();

  // Check if accessing super admin with secret key
  const searchParams = new URLSearchParams(location.search);
  const accessKey = searchParams.get("access");
  const isSuperAdminAccess = location.pathname.includes("/admin/super-admin") && accessKey === "superadmin2024secure";

  // Show maintenance page if in maintenance mode and not super admin access
  if (isMaintenanceMode && !isSuperAdminAccess) {
    return <MaintenancePage />;
  }

  // Show loading while checking maintenance status
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 border-4 border-primary/40 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Memeriksa status sistem...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/alumni/dashboard"
        element={
          <ProtectedRoute requiredRole="alumni">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alumni/jobs"
        element={
          <ProtectedRoute requiredRole="alumni">
            <JobListings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alumni/jobs/:jobId/apply"
        element={
          <ProtectedRoute requiredRole="alumni">
            <JobApplicationForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alumni/applications"
        element={
          <ProtectedRoute requiredRole="alumni">
            <MyApplications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alumni/applications/:applicationId"
        element={
          <ProtectedRoute requiredRole="alumni">
            <ApplicationDetails />
          </ProtectedRoute>
        }
      />
      <Route path="/company/auth" element={<CompanyAuth />} />
      <Route
        path="/company/dashboard"
        element={
          <ProtectedRoute requiredRole="company">
            <CompanyDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/auth" element={<AdminAuth />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin" redirectTo="/admin/auth">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      {/* Super Admin - dapat diakses via URL secret key TANPA login */}
      <Route path="/admin/super-admin" element={<SuperAdminDashboard />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MaintenanceProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
              <div className="text-center space-y-3">
                <div className="h-10 w-10 border-4 border-primary/40 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground">Memuat halaman...</p>
              </div>
            </div>
          }
        >
          <AppRoutes />
        </Suspense>
      </TooltipProvider>
    </MaintenanceProvider>
  </QueryClientProvider>
);

export default App;
