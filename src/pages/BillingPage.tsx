import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MOCK_INVOICES } from "../data/mockModuleData";
import { InvoiceItem } from "../types/auth";
import { PermissionButton } from "../components/common/PermissionButton";
import {
  Receipt,
  Plus,
  Download,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
} from "lucide-react";

export const BillingPage: React.FC = () => {
  const { currentUser, getModulePermissions } = useAuth();
  const [invoices, setInvoices] = useState<InvoiceItem[]>(MOCK_INVOICES);
  const [feedback, setFeedback] = useState<string | null>(null);

  const permissions = getModulePermissions("Billing");

  const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.amount, 0);
  const totalPaid = invoices
    .filter((i) => i.status === "Paid")
    .reduce((acc, inv) => acc + inv.amount, 0);
  const totalUnpaid = invoices
    .filter((i) => i.status !== "Paid")
    .reduce((acc, inv) => acc + inv.amount, 0);

  const handleCreateInvoice = () => {
    const newInv: InvoiceItem = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: "Apex Logistics International",
      amount: Math.floor(1000 + Math.random() * 20000),
      dueDate: "2026-10-15",
      issuedDate: new Date().toISOString().split("T")[0],
      status: "Unpaid",
    };
    setInvoices([newInv, ...invoices]);
    setFeedback(`Invoice ${newInv.invoiceNumber} issued successfully!`);
  };

  const handleMarkPaid = (id: string, num: string) => {
    setInvoices(
      invoices.map((i) => (i.id === id ? { ...i, status: "Paid" } : i))
    );
    setFeedback(`Invoice ${num} marked as Paid!`);
  };

  const getStatusBadge = (status: InvoiceItem["status"]) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="w-3 h-3" /> Paid
          </span>
        );
      case "Overdue":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
            <AlertTriangle className="w-3 h-3" /> Overdue
          </span>
        );
      case "Unpaid":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <Clock className="w-3 h-3" /> Unpaid
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Billing & Invoices
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Accounts receivable, invoice dispatch, and financial clearinghouse
            </p>
          </div>
        </div>

        {/* Action Buttons with granular permissions */}
        <div className="flex items-center gap-2.5">
          <PermissionButton
            module="Billing"
            action="EXPORT"
            variant="secondary"
            icon={<Download className="w-4 h-4" />}
            onClick={() => setFeedback("Exported billing statements to Excel")}
          >
            Export Statements
          </PermissionButton>

          <PermissionButton
            module="Billing"
            action="CREATE"
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleCreateInvoice}
          >
            + Issue Invoice
          </PermissionButton>
        </div>
      </div>

      {/* Permissions Audit Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <ShieldCheck className="w-4 h-4 text-indigo-500" />
          <span className="text-slate-500">
            Your permissions for <strong className="text-slate-800 dark:text-slate-200">Billing</strong>:
          </span>
          <div className="flex items-center gap-1.5">
            {permissions.map((p) => (
              <span
                key={p}
                className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
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

      {/* Feedback Toast */}
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

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Total Invoiced
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            ${totalInvoiced.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across all clients</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            Collected / Paid
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            ${totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Cleared in merchant account</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            Outstanding / Unpaid
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            ${totalUnpaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting settlement</div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Issued Invoices ({invoices.length})
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-6">Invoice #</th>
                <th className="py-3 px-6">Client</th>
                <th className="py-3 px-6">Issued Date</th>
                <th className="py-3 px-6">Due Date</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-4 px-6 font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-800 dark:text-slate-200">
                    {inv.clientName}
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500">
                    {inv.issuedDate}
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500">
                    {inv.dueDate}
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-100">
                    ${inv.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(inv.status)}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <PermissionButton
                        module="Billing"
                        action="EDIT"
                        variant="secondary"
                        size="sm"
                        disabled={inv.status === "Paid"}
                        onClick={() => handleMarkPaid(inv.id, inv.invoiceNumber)}
                      >
                        {inv.status === "Paid" ? "Cleared" : "Mark Paid"}
                      </PermissionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
