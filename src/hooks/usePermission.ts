import { useAuth } from "../context/AuthContext";
import { PermissionAction } from "../types/auth";

/**
 * Convenient hook for granular permission checks scoped to a module
 */
export function usePermission(moduleName: string) {
  const { hasPermission, canViewModule, getModulePermissions } = useAuth();

  const can = (action: PermissionAction): boolean => {
    return hasPermission(moduleName, action);
  };

  const canView = canViewModule(moduleName);
  const permissions = getModulePermissions(moduleName);

  return {
    can,
    canView,
    permissions,
  };
}
