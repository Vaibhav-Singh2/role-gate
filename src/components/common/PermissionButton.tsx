import React from "react";
import { PermissionGate } from "./PermissionGate";
import { PermissionAction } from "../../types/auth";

export interface PermissionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  module: string;
  action: PermissionAction;
  hideIfUnauthorized?: boolean; // if false, displays disabled with lock tooltip
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const PermissionButton: React.FC<PermissionButtonProps> = ({
  module,
  action,
  hideIfUnauthorized = true,
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  ...buttonProps
}) => {
  const variantStyles = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-500/20 disabled:opacity-50",
    secondary:
      "bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 disabled:opacity-50",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white shadow-xs shadow-rose-500/20 disabled:opacity-50",
    ghost:
      "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 disabled:opacity-50",
  };

  const sizeStyles = {
    sm: "px-2.5 py-1 text-xs rounded-lg gap-1",
    md: "px-3.5 py-2 text-xs sm:text-sm rounded-xl gap-1.5",
    lg: "px-5 py-2.5 text-sm rounded-xl gap-2 font-bold",
  };

  const button = (
    <button
      {...buttonProps}
      className={`inline-flex items-center justify-center font-semibold transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );

  return (
    <PermissionGate
      module={module}
      action={action}
      renderDisabled={!hideIfUnauthorized}
    >
      {button}
    </PermissionGate>
  );
};
