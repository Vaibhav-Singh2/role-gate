import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MOCK_CUSTOMERS } from "../data/mockModuleData";
import { CustomerItem } from "../types/auth";
import { PermissionButton } from "../components/common/PermissionButton";
import {
  Users,
  Plus,
  Mail,
  Building,
  ShieldCheck,
  Trash2,
} from "lucide-react";

export const CustomersPage: React.FC = () => {
  const { currentUser, getModulePermissions } = useAuth();
  const [customers, setCustomers] = useState<CustomerItem[]>(MOCK_CUSTOMERS);
  const [feedback, setFeedback] = useState<string | null>(null);

  const permissions = getModulePermissions("Customers");

  const handleAddCustomer = () => {
    const newCust: CustomerItem = {
      id: `cust-${Date.now()}`,
      name: "Marcus Aurelius",
      email: "m.aurelius@imperiumfreight.com",
      company: "Imperium Logistics",
      ordersCount: 1,
      status: "Active",
    };
    setCustomers([newCust, ...customers]);
    setFeedback(`Added new customer ${newCust.name}!`);
  };

  const handleDeleteCustomer = (id: string, name: string) => {
    setCustomers(customers.filter((c) => c.id !== id));
    setFeedback(`Removed customer ${name}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Customer Accounts
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Directory of logistics partners, shippers, and commercial consignees
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <PermissionButton
            module="Customers"
            action="CREATE"
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleAddCustomer}
          >
            + New Customer
          </PermissionButton>
        </div>
      </div>

      {/* Permissions Audit Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <ShieldCheck className="w-4 h-4 text-purple-500" />
          <span className="text-slate-500">
            Your permissions for <strong className="text-slate-800 dark:text-slate-200">Customers</strong>:
          </span>
          <div className="flex items-center gap-1.5">
            {permissions.map((p) => (
              <span
                key={p}
                className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
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

      {/* Grid of Customers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {c.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.company}</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    c.status === "Active"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  }`}
                >
                  {c.status}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{c.email}</span>
              </div>

              <div className="mt-2 text-xs text-slate-500">
                Total Orders: <strong className="text-slate-800 dark:text-slate-200">{c.ordersCount}</strong>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <PermissionButton
                module="Customers"
                action="DELETE"
                variant="danger"
                size="sm"
                icon={<Trash2 className="w-3.5 h-3.5" />}
                onClick={() => handleDeleteCustomer(c.id, c.name)}
              >
                Delete
              </PermissionButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
