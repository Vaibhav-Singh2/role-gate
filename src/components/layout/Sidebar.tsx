import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { NAVIGATION_ITEMS } from "../../data/mockUsers";
import {
  ShoppingCart,
  Receipt,
  Users,
  BarChart3,
  Settings,
  Shield,
  Lock,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  ShoppingCart: <ShoppingCart className="w-5 h-5" />,
  Receipt: <Receipt className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { canViewModule, getModulePermissions, currentUser } = useAuth();
  const location = useLocation();

  // DYNAMIC SIDEBAR GENERATION:
  // Filter registered navigation items to only include modules where the user has VIEW permission
  const authorizedNavItems = NAVIGATION_ITEMS.filter((item) =>
    canViewModule(item.name)
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-200 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 dark:text-slate-50 text-base tracking-tight leading-none">
                RoleGate
              </h1>
              <span className="text-[10px] text-slate-400 font-medium">
                RBAC Navigation
              </span>
            </div>
          </div>
        </div>

        {/* User Persona Active Badge */}
        <div className="px-4 py-3 m-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
            <span>ACTIVE ROLE</span>
            <span className="text-blue-600 dark:text-blue-400 font-mono">
              {currentUser.personaLabel.split(" ")[0]}
            </span>
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
            {currentUser.name}
          </div>
          <div className="text-[11px] text-slate-500 truncate">
            {currentUser.roleTitle}
          </div>
        </div>

        {/* Dynamic Navigation Menu */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Authorized Modules ({authorizedNavItems.length})
          </div>

          {authorizedNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const permissions = getModulePermissions(item.name);

            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={onClose}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                    }
                  >
                    {ICON_MAP[item.iconName] || <Shield className="w-5 h-5" />}
                  </span>
                  <span>{item.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold font-mono rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {item.badge}
                    </span>
                  )}
                  {/* Subtle indicator of permissions count */}
                  <span
                    className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 font-mono"
                    title={`Permissions: ${permissions.join(", ")}`}
                  >
                    {permissions.length}p
                  </span>
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Hidden Modules Audit Info (Proves that unauthorized modules are hidden) */}
        <div className="p-3 m-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Hidden Modules:</span>
          </div>
          <div className="text-[11px] text-amber-800/90 dark:text-amber-300/90">
            {NAVIGATION_ITEMS.filter((i) => !canViewModule(i.name)).length === 0 ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                None (Full visibility)
              </span>
            ) : (
              NAVIGATION_ITEMS.filter((i) => !canViewModule(i.name))
                .map((i) => i.name)
                .join(", ")
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
