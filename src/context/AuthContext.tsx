import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { User, PermissionAction, ModulePermission } from "../types/auth";
import { MOCK_USERS } from "../data/mockUsers";

interface AuthContextType {
  currentUser: User;
  allUsers: User[];
  switchUser: (userId: string) => void;
  resetToDefaults: () => void;
  canViewModule: (moduleName: string) => boolean;
  hasPermission: (moduleName: string, action: PermissionAction) => boolean;
  getModulePermissions: (moduleName: string) => PermissionAction[];
  userModules: ModulePermission[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to User A as requested in example
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("rolegate-user-id") || "user-a";
    }
    return "user-a";
  });

  const currentUser = useMemo(() => {
    return MOCK_USERS.find((u) => u.id === currentUserId) || MOCK_USERS[0];
  }, [currentUserId]);

  const switchUser = useCallback((userId: string) => {
    setCurrentUserId(userId);
    if (typeof window !== "undefined") {
      localStorage.setItem("rolegate-user-id", userId);
    }
  }, []);

  const resetToDefaults = useCallback(() => {
    setCurrentUserId("user-a");
    if (typeof window !== "undefined") {
      localStorage.setItem("rolegate-user-id", "user-a");
    }
  }, []);

  /**
   * Evaluates if current user has "VIEW" permission for a given module.
   * If false, module is hidden from sidebar and blocked by route guard.
   */
  const canViewModule = useCallback(
    (moduleName: string): boolean => {
      const mod = currentUser.modules.find(
        (m) => m.name.toLowerCase() === moduleName.toLowerCase()
      );
      if (!mod) return false;
      return mod.permission.includes("VIEW");
    },
    [currentUser]
  );

  /**
   * Evaluates granular permission action (e.g. "CREATE", "EDIT", "DELETE") for a module
   */
  const hasPermission = useCallback(
    (moduleName: string, action: PermissionAction): boolean => {
      const mod = currentUser.modules.find(
        (m) => m.name.toLowerCase() === moduleName.toLowerCase()
      );
      if (!mod) return false;
      return mod.permission.includes(action);
    },
    [currentUser]
  );

  /**
   * Returns list of allowed permissions for a module
   */
  const getModulePermissions = useCallback(
    (moduleName: string): PermissionAction[] => {
      const mod = currentUser.modules.find(
        (m) => m.name.toLowerCase() === moduleName.toLowerCase()
      );
      return mod ? mod.permission : [];
    },
    [currentUser]
  );

  const value = useMemo(
    () => ({
      currentUser,
      allUsers: MOCK_USERS,
      switchUser,
      resetToDefaults,
      canViewModule,
      hasPermission,
      getModulePermissions,
      userModules: currentUser.modules,
    }),
    [currentUser, switchUser, resetToDefaults, canViewModule, hasPermission, getModulePermissions]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
