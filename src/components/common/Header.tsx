import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Menu,
  ChevronDown,
  Sun,
  Moon,
  ExternalLink,
  Check,
} from "lucide-react";

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileSidebar,
  theme,
  toggleTheme,
}) => {
  const { currentUser, allUsers, switchUser } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>Enterprise Portal</span>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100 font-bold">
            Permission Gateway
          </span>
        </div>
      </div>

      {/* Right: Direct Test Link, Persona Switcher & Theme */}
      <div className="flex items-center gap-3">
        {/* Quick Route Guard Tester Link */}
        <Link
          to="/billing"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
          title="Directly test route protection on /billing"
        >
          <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
          <span>Test /billing URL</span>
        </Link>

        {/* Persona Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all shadow-xs cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>{currentUser.name}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  {currentUser.personaLabel.split(" ")[0]}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {currentUser.roleTitle}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Persona Menu Overlay */}
          {isDropdownOpen && (
            <>
              <div
                onClick={() => setIsDropdownOpen(false)}
                className="fixed inset-0 z-40"
              />
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Switch Test Persona
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Select a role to verify dynamic sidebar & guards
                  </p>
                </div>

                <div className="mt-1 space-y-1">
                  {allUsers.map((u) => {
                    const isSelected = u.id === currentUser.id;
                    const hasBilling = u.modules.some(
                      (m) => m.name === "Billing" && m.permission.includes("VIEW")
                    );

                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent"
                        }`}
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-lg object-cover shrink-0 mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                              {u.personaLabel}
                            </span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {u.roleTitle}
                          </div>
                          <div className="mt-1 flex items-center gap-1.5 text-[10px]">
                            <span
                              className={`px-1.5 py-0.2 rounded font-semibold ${
                                hasBilling
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                  : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                              }`}
                            >
                              {hasBilling ? "✓ Sees Billing" : "✕ No Billing"}
                            </span>
                            <span className="text-slate-400">
                              {u.modules.length} modules
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4 text-slate-700" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>
      </div>
    </header>
  );
};
