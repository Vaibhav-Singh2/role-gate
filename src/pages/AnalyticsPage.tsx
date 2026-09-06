import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { PermissionButton } from "../components/common/PermissionButton";
import {
  BarChart3,
  TrendingUp,
  Download,
  ShieldCheck,
  Calendar,
  Award,
} from "lucide-react";

export const AnalyticsPage: React.FC = () => {
  const { currentUser, getModulePermissions } = useAuth();
  const [feedback, setFeedback] = useState<string | null>(null);

  const permissions = getModulePermissions("Analytics");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Operational Analytics
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fleet delivery performance, margin analytics, and volume forecasts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <PermissionButton
            module="Analytics"
            action="EXPORT"
            variant="primary"
            icon={<Download className="w-4 h-4" />}
            onClick={() => setFeedback("Exported executive performance metrics (PDF/CSV)")}
          >
            Export Report
          </PermissionButton>
        </div>
      </div>

      {/* Permissions Audit Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <ShieldCheck className="w-4 h-4 text-cyan-500" />
          <span className="text-slate-500">
            Your permissions for <strong className="text-slate-800 dark:text-slate-200">Analytics</strong>:
          </span>
          <div className="flex items-center gap-1.5">
            {permissions.map((p) => (
              <span
                key={p}
                className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800"
              >
                {p}
              </span>
            ))}
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

      {/* Analytics KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">On-Time Delivery Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-100">97.8%</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
            +2.4% vs last quarter
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Average Dispatch Lag</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-100">1.8 hrs</div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-semibold">
            -45 mins turnaround
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Service Reliability Score</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-100">99.2 / 100</div>
          <div className="text-xs text-slate-400 mt-1">Tier-1 logistics standard</div>
        </div>
      </div>
    </div>
  );
};
