import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { PermissionButton } from "../components/common/PermissionButton";
import {
  Settings,
  Save,
  Key,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

export const SettingsPage: React.FC = () => {
  const { currentUser, getModulePermissions, resetToDefaults } = useAuth();
  const [feedback, setFeedback] = useState<string | null>(null);

  const permissions = getModulePermissions("Settings");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              System Settings & Administration
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Access control policies, API credentials, and global security audit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              resetToDefaults();
              setFeedback("Reset demo personas to factory defaults");
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Personas
          </button>

          <PermissionButton
            module="Settings"
            action="EDIT"
            variant="primary"
            icon={<Save className="w-4 h-4" />}
            onClick={() => setFeedback("Saved security settings and firewall rules")}
          >
            Save Configuration
          </PermissionButton>
        </div>
      </div>

      {/* Permissions Audit Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <ShieldCheck className="w-4 h-4 text-slate-500" />
          <span className="text-slate-500">
            Your permissions for <strong className="text-slate-800 dark:text-slate-200">Settings</strong>:
          </span>
          <div className="flex items-center gap-1.5">
            {permissions.length === 0 ? (
              <span className="text-rose-500 font-semibold">None</span>
            ) : (
              permissions.map((p) => (
                <span
                  key={p}
                  className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  {p}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="text-xs text-slate-400">
          User: <span className="font-semibold text-slate-700 dark:text-slate-300">{currentUser.personaLabel}</span>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <span>✓ {feedback}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-emerald-600 hover:text-emerald-800 text-[10px] uppercase font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-4">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm mb-4">
            <Key className="w-4 h-4 text-blue-500" />
            <span>RBAC Security Matrix</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Currently authenticated as <strong className="text-slate-800 dark:text-slate-200">{currentUser.name}</strong> ({currentUser.personaLabel}).
            Settings module requires active administrative privileges.
          </p>

          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 font-mono text-xs overflow-x-auto text-slate-700 dark:text-slate-300">
            <pre>{JSON.stringify(currentUser.modules, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
