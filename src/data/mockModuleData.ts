import { OrderItem, InvoiceItem, CustomerItem } from "../types/auth";

export const MOCK_ORDERS: OrderItem[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-9401",
    customerName: "Acme Logistics Global",
    itemsCount: 14,
    totalAmount: 14850.0,
    status: "Completed",
    date: "2026-09-04",
  },
  {
    id: "ord-2",
    orderNumber: "ORD-9402",
    customerName: "Pacifica Supply Co.",
    itemsCount: 6,
    totalAmount: 4320.5,
    status: "Processing",
    date: "2026-09-05",
  },
  {
    id: "ord-3",
    orderNumber: "ORD-9403",
    customerName: "Vertex Freight Systems",
    itemsCount: 22,
    totalAmount: 28900.0,
    status: "Pending",
    date: "2026-09-06",
  },
  {
    id: "ord-4",
    orderNumber: "ORD-9404",
    customerName: "Horizon Health Logistics",
    itemsCount: 3,
    totalAmount: 1750.0,
    status: "Completed",
    date: "2026-09-06",
  },
];

export const MOCK_INVOICES: InvoiceItem[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2026-081",
    clientName: "Acme Logistics Global",
    amount: 14850.0,
    dueDate: "2026-09-20",
    issuedDate: "2026-09-04",
    status: "Paid",
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2026-082",
    clientName: "Pacifica Supply Co.",
    amount: 4320.5,
    dueDate: "2026-09-25",
    issuedDate: "2026-09-05",
    status: "Unpaid",
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-2026-083",
    clientName: "North Star Shipping",
    amount: 11200.0,
    dueDate: "2026-08-30",
    issuedDate: "2026-08-10",
    status: "Overdue",
  },
];

export const MOCK_CUSTOMERS: CustomerItem[] = [
  {
    id: "cust-1",
    name: "Eleanor Vance",
    email: "e.vance@acmelogistics.com",
    company: "Acme Logistics Global",
    ordersCount: 42,
    status: "Active",
  },
  {
    id: "cust-2",
    name: "David Kross",
    email: "dkross@pacificasupply.com",
    company: "Pacifica Supply Co.",
    ordersCount: 18,
    status: "Active",
  },
  {
    id: "cust-3",
    name: "Sarah Lindqvist",
    email: "sarah@vertexfreight.io",
    company: "Vertex Freight Systems",
    ordersCount: 9,
    status: "Pending",
  },
];
