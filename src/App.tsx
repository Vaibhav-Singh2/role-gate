import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./components/guards/ProtectedRoute";
import { OrdersPage } from "./pages/OrdersPage";
import { BillingPage } from "./pages/BillingPage";
import { CustomersPage } from "./pages/CustomersPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { UnauthorizedPage } from "./pages/UnauthorizedPage";

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main App Layout */}
          <Route path="/" element={<DashboardLayout />}>
            {/* Default Route redirects to /orders */}
            <Route index element={<Navigate to="/orders" replace />} />

            {/* Role-Protected Routes with ProtectedRoute Guards */}
            <Route
              path="orders"
              element={
                <ProtectedRoute moduleName="Orders">
                  <OrdersPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="billing"
              element={
                <ProtectedRoute moduleName="Billing">
                  <BillingPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="customers"
              element={
                <ProtectedRoute moduleName="Customers">
                  <CustomersPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="analytics"
              element={
                <ProtectedRoute moduleName="Analytics">
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="settings"
              element={
                <ProtectedRoute moduleName="Settings">
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Standalone 403 Page */}
            <Route path="unauthorized" element={<UnauthorizedPage />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/orders" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
