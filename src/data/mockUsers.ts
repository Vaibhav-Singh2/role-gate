import { User, NavItem } from "../types/auth";

/**
 * Standard Application Navigation Items Registry
 */
export const NAVIGATION_ITEMS: NavItem[] = [
  {
    id: "orders",
    name: "Orders",
    label: "Orders Management",
    path: "/orders",
    iconName: "ShoppingCart",
    badge: "12",
  },
  {
    id: "billing",
    name: "Billing",
    label: "Billing & Invoices",
    path: "/billing",
    iconName: "Receipt",
  },
  {
    id: "customers",
    name: "Customers",
    label: "Customer Directory",
    path: "/customers",
    iconName: "Users",
  },
  {
    id: "analytics",
    name: "Analytics",
    label: "Reports & Analytics",
    path: "/analytics",
    iconName: "BarChart3",
  },
  {
    id: "settings",
    name: "Settings",
    label: "System Settings",
    path: "/settings",
    iconName: "Settings",
  },
];

/**
 * Pre-configured User Personas for demonstration & testing
 */
export const MOCK_USERS: User[] = [
  {
    id: "user-a",
    name: "Alex Morgan",
    email: "alex.morgan@enterprise.io",
    roleTitle: "Commercial & Operations Lead",
    personaLabel: "User A (Sees Billing)",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    badgeColor: "emerald",
    description: "Has full access to Orders (VIEW, CREATE) and Billing (VIEW). Demonstrates authorized Billing navigation.",
    modules: [
      {
        name: "Orders",
        permission: ["VIEW", "CREATE", "EDIT"],
      },
      {
        name: "Billing",
        permission: ["VIEW"],
      },
      {
        name: "Customers",
        permission: ["VIEW", "CREATE"],
      },
      {
        name: "Analytics",
        permission: ["VIEW"],
      },
    ],
  },
  {
    id: "user-b",
    name: "Jordan Lee",
    email: "jordan.lee@enterprise.io",
    roleTitle: "Sales & Dispatch Specialist",
    personaLabel: "User B (No Billing)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    badgeColor: "amber",
    description: "Has Orders (VIEW, CREATE) and Customers (VIEW), but NO Billing permission. Demonstrates hidden sidebar link and Route Guard 403 block.",
    modules: [
      {
        name: "Orders",
        permission: ["VIEW", "CREATE"],
      },
      {
        name: "Customers",
        permission: ["VIEW"],
      },
    ],
  },
  {
    id: "user-c",
    name: "Taylor Chen",
    email: "taylor.chen@auditcorp.com",
    roleTitle: "Compliance & Financial Auditor",
    personaLabel: "User C (Read-Only Viewer)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    badgeColor: "blue",
    description: "Can view Orders and Billing, but has NO CREATE/EDIT permissions. Demonstrates permission-based button disabling/hiding.",
    modules: [
      {
        name: "Orders",
        permission: ["VIEW"],
      },
      {
        name: "Billing",
        permission: ["VIEW"],
      },
      {
        name: "Customers",
        permission: ["VIEW"],
      },
      {
        name: "Analytics",
        permission: ["VIEW"],
      },
    ],
  },
  {
    id: "user-admin",
    name: "Samira Patel",
    email: "admin@enterprise.io",
    roleTitle: "Super Administrator",
    personaLabel: "Admin (Full Access)",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    badgeColor: "purple",
    description: "Unrestricted superuser access across all modules, including Settings, Export, and Delete actions.",
    modules: [
      {
        name: "Orders",
        permission: ["VIEW", "CREATE", "EDIT", "DELETE"],
      },
      {
        name: "Billing",
        permission: ["VIEW", "CREATE", "EDIT", "DELETE"],
      },
      {
        name: "Customers",
        permission: ["VIEW", "CREATE", "EDIT", "DELETE"],
      },
      {
        name: "Analytics",
        permission: ["VIEW", "EXPORT"],
      },
      {
        name: "Settings",
        permission: ["VIEW", "EDIT"],
      },
    ],
  },
];
