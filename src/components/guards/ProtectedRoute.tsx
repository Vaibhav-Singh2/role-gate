import React from "react";
import { useAuth } from "../../context/AuthContext";
import { UnauthorizedPage } from "../../pages/UnauthorizedPage";

interface ProtectedRouteProps {
  moduleName: string;
  children: React.ReactNode;
}

/**
 * Route Guard Component
 * Intercepts direct URL navigation and verifies that the active user
 * has the required "VIEW" permission for the target module.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  moduleName,
  children,
}) => {
  const { canViewModule } = useAuth();
  const hasAccess = canViewModule(moduleName);

  if (!hasAccess) {
    return <UnauthorizedPage moduleName={moduleName} />;
  }

  return <>{children}</>;
};
