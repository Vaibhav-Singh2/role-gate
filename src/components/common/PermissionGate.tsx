import React from "react";
import { useAuth } from "../../context/AuthContext";
import { PermissionAction } from "../../types/auth";
import { Lock } from "lucide-react";

interface PermissionGateProps {
  module: string;
  action: PermissionAction;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  /**
   * If true, shows child element in disabled state with permission restriction tooltip
   * instead of completely hiding it.
   */
  renderDisabled?: boolean;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  module,
  action,
  children,
  fallback = null,
  renderDisabled = false,
}) => {
  const { hasPermission } = useAuth();
  const isAllowed = hasPermission(module, action);

  if (isAllowed) {
    return <>{children}</>;
  }

  if (renderDisabled) {
    return (
      <div className="relative group inline-block">
        <div className="opacity-50 pointer-events-none cursor-not-allowed">
          {children}
        </div>
        {/* Informative Tooltip explaining missing permission */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none">
          <Lock className="w-3 h-3 text-amber-400" />
          <span>Requires <strong>{action}</strong> permission for {module}</span>
        </div>
      </div>
    );
  }

  return <>{fallback}</>;
};
