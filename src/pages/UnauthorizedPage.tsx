import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldAlert, ArrowLeft, UserCheck, KeyRound } from "lucide-react";

interface UnauthorizedPageProps {
  moduleName?: string;
}

export const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({
  moduleName = "Requested Module",
}) => {
  const { currentUser, switchUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-950/60 p-8 shadow-xl text-center space-y-6">
        {/* Warning Icon Badge */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-lg shadow-rose-500/10">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 mb-2">
            403 • Route Guard Protection Active
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Access Denied to {moduleName}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Your current persona (<strong>{currentUser.personaLabel}</strong>) does not have the required{" "}
            <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 font-mono text-xs font-bold">
              VIEW
            </code>{" "}
            permission for the <strong>{moduleName}</strong> module.
          </p>
        </div>

        {/* Current Permissions Inspector */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-left text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5" />
              Active User Permissions
            </span>
            <span className="font-mono text-[11px]">{currentUser.email}</span>
          </div>
          <pre className="mt-2 text-[11px] font-mono text-slate-800 dark:text-slate-200 overflow-x-auto">
            {JSON.stringify(currentUser.modules, null, 2)}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate("/orders")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </button>

          {currentUser.id !== "user-a" && (
            <button
              onClick={() => {
                switchUser("user-a");
                navigate(`/${moduleName.toLowerCase()}`);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              Switch to User A (Has Access)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
