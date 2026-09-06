import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MOCK_ORDERS } from "../data/mockModuleData";
import { OrderItem } from "../types/auth";
import { PermissionButton } from "../components/common/PermissionButton";
import {
  ShoppingCart,
  Plus,
  Edit2,
  Trash2,
  Download,
  ShieldCheck,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export const OrdersPage: React.FC = () => {
  const { currentUser, getModulePermissions } = useAuth();
  const [orders, setOrders] = useState<OrderItem[]>(MOCK_ORDERS);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const permissions = getModulePermissions("Orders");

  const handleCreateOrder = () => {
    const newId = `ord-${Date.now()}`;
    const newOrder: OrderItem = {
      id: newId,
      orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: "Global Express Freight",
      itemsCount: Math.floor(1 + Math.random() * 20),
      totalAmount: Math.floor(500 + Math.random() * 15000),
      status: "Processing",
      date: new Date().toISOString().split("T")[0],
    };
    setOrders([newOrder, ...orders]);
    setLastAction(`Created new order ${newOrder.orderNumber}!`);
  };

  const handleDeleteOrder = (id: string, orderNumber: string) => {
    setOrders(orders.filter((o) => o.id !== id));
    setLastAction(`Deleted order ${orderNumber}`);
  };

  const handleEditOrder = (orderNumber: string) => {
    setLastAction(`Edited order ${orderNumber}`);
  };

  const getStatusBadge = (status: OrderItem["status"]) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle className="w-3 h-3" /> Completed
          </span>
        );
      case "Processing":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <Clock className="w-3 h-3" /> Processing
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <AlertCircle className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Orders Management
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage logistics purchases, shipments, and customer order records
              </p>
            </div>
          </div>
        </div>

        {/* Top Action Bar (Permission-gated actions) */}
        <div className="flex items-center gap-2.5">
          <PermissionButton
            module="Orders"
            action="EXPORT"
            variant="secondary"
            icon={<Download className="w-4 h-4" />}
            onClick={() => setLastAction("Exported orders CSV successfully")}
          >
            Export CSV
          </PermissionButton>

          <PermissionButton
            module="Orders"
            action="CREATE"
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleCreateOrder}
          >
            + Create Order
          </PermissionButton>
        </div>
      </div>

      {/* Permissions Audit Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span className="text-slate-500">
            Your permissions for <strong className="text-slate-800 dark:text-slate-200">Orders</strong>:
          </span>
          <div className="flex items-center gap-1.5">
            {permissions.map((p) => (
              <span
                key={p}
                className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
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
      {lastAction && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <span>✓ {lastAction}</span>
          <button
            onClick={() => setLastAction(null)}
            className="text-emerald-600 hover:text-emerald-800 text-[10px] uppercase font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              All Orders ({orders.length})
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Items</th>
                <th className="py-3 px-6">Total Amount</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-4 px-6 font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                    {order.orderNumber}
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-800 dark:text-slate-200">
                    {order.customerName}
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500">
                    {order.date}
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-400">
                    {order.itemsCount} units
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-100">
                    ${order.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(order.status)}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <PermissionButton
                        module="Orders"
                        action="EDIT"
                        variant="secondary"
                        size="sm"
                        icon={<Edit2 className="w-3.5 h-3.5" />}
                        onClick={() => handleEditOrder(order.orderNumber)}
                      >
                        Edit
                      </PermissionButton>

                      <PermissionButton
                        module="Orders"
                        action="DELETE"
                        variant="danger"
                        size="sm"
                        icon={<Trash2 className="w-3.5 h-3.5" />}
                        onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                      >
                        Delete
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
