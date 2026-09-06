export type PermissionAction = "VIEW" | "CREATE" | "EDIT" | "DELETE" | "EXPORT";

export interface ModulePermission {
  name: string; // e.g. "Orders", "Billing", "Customers", "Analytics", "Settings"
  permission: PermissionAction[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  roleTitle: string;
  personaLabel: string; // e.g. "User A (Manager)", "User B (Staff)"
  avatar: string;
  badgeColor: string;
  description: string;
  modules: ModulePermission[];
}

export interface NavItem {
  id: string;
  name: string; // matches ModulePermission.name
  label: string;
  path: string;
  iconName: string;
  badge?: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  itemsCount: number;
  totalAmount: number;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  date: string;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Unpaid" | "Overdue";
  issuedDate: string;
}

export interface CustomerItem {
  id: string;
  name: string;
  email: string;
  company: string;
  ordersCount: number;
  status: "Active" | "Pending";
}
