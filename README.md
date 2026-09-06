# Role-Based Navigation System (RBAC Gateway) | RoleGate

An enterprise-grade Role-Based Access Control (RBAC) navigation system built with **React 18**, **React Router v6**, **TypeScript**, and **Tailwind CSS v4**.

This application directly satisfies the technical assessment requirements specified in [`Role_Based_Navigation.md`](./Role_Based_Navigation.md).

---

## 🚀 Key Requirements & Architectural Overview

The core objective of this assessment is to control UI navigation and route accessibility dynamically using permissions returned by a backend permissions API:

```json
{
  "modules": [
    { "name": "Orders", "permission": ["VIEW", "CREATE"] },
    { "name": "Billing", "permission": ["VIEW"] }
  ]
}
```

---

## 📋 Comprehensive Feature Breakdown

### 1. Dynamic Sidebar Generation ([`src/components/layout/Sidebar.tsx`](./src/components/layout/Sidebar.tsx))
- **How It Works**: Rather than hardcoding navigation items, the application registers all possible enterprise routes in a master catalog (`NAVIGATION_ITEMS`).
- **Runtime Filtering**: At render time, the sidebar queries `canViewModule(item.name)` against the active user's permissions array.
- **Strict Authorization**: Only modules where `permission.includes("VIEW")` evaluate to true are rendered as clickable navigation links.
- **Badge & Meta Indicators**: Each authorized navigation item displays active permissions count (e.g. `2p`, `4p`) and context badges.

### 2. Automatic Hiding of Unauthorized Modules
- **Zero Leakage**: If a user lacks the `"VIEW"` permission for a module, the navigation item is completely removed from the DOM.
- **Live Audit Pill**: For verification and administrative transparency, the bottom of the sidebar features an active security audit box that explicitly lists all **Hidden Modules** for the current persona.

### 3. Route Guard & Direct URL Protection ([`src/components/guards/ProtectedRoute.tsx`](./src/components/guards/ProtectedRoute.tsx))
- **Defense in Depth**: Hiding sidebar links is not enough; users might type `/billing` or `/settings` directly into the browser URL bar or follow an external link.
- **Route Interception**: Every protected route in `App.tsx` is wrapped by `<ProtectedRoute moduleName="...">`.
- **403 Forbidden Screen ([`src/pages/UnauthorizedPage.tsx`](./src/pages/UnauthorizedPage.tsx))**:
  - When an unauthorized route is accessed, the guard immediately renders a dedicated 403 Forbidden screen while preserving the target route in the address bar.
  - Displays the active persona's name and role.
  - Shows an inspector with the exact permissions JSON currently assigned to the user.
  - Highlights what permission was missing (`VIEW` on target module).
  - Provides instant recovery actions: a **"Back to Orders"** button and a **"Switch to User A"** one-click shortcut.

### 4. Permission-Based Buttons ([`src/components/common/PermissionButton.tsx`](./src/components/common/PermissionButton.tsx))
- **Granular Action Authorization**: Granular control beyond page-level access (`CREATE`, `EDIT`, `DELETE`, `EXPORT`).
- **Declarative Usage**:
  ```tsx
  <PermissionButton
    module="Orders"
    action="CREATE"
    variant="primary"
    onClick={handleCreateOrder}
  >
    + Create Order
  </PermissionButton>
  ```
- **Adaptive Render Modes**:
  - `hideIfUnauthorized={true}` (default): Button is not rendered at all if the user lacks the action permission.
  - `hideIfUnauthorized={false}`: Renders the button in a disabled state with reduced opacity and an explanatory lock tooltip on hover (e.g. *"Requires CREATE permission for Orders"*).

### 5. Multi-Persona Test Harness & Switcher ([`src/components/common/Header.tsx`](./src/components/common/Header.tsx))
Located in the top header, the persona switcher allows instant, live switching between 4 personas to test the assessment criteria in real-time:

| Persona | Role Title | Assigned Modules & Permissions | Behavior in UI |
| :--- | :--- | :--- | :--- |
| **User A** *(Alex Mercer)* | Standard Manager | • **Orders**: `VIEW`, `CREATE`, `EDIT`, `DELETE`<br>• **Billing**: `VIEW`, `CREATE`, `EDIT`<br>• **Customers**: `VIEW`, `CREATE`, `EDIT`<br>• **Analytics**: `VIEW`, `EXPORT` | **Sees Billing** in sidebar. Has full access to `/billing` and invoice issuing. |
| **User B** *(Bailey Chen)* | Operations Specialist | • **Orders**: `VIEW`, `CREATE`, `EDIT`<br>• **Customers**: `VIEW`<br>• **Analytics**: `VIEW` | **Billing is hidden** from sidebar. Navigating to `/billing` triggers the **403 Forbidden Screen**. |
| **User C** *(Cameron Reed)* | Read-Only Auditor | • **Orders**: `VIEW`<br>• **Billing**: `VIEW`<br>• **Customers**: `VIEW`<br>• **Analytics**: `VIEW` | Can view all modules, but destructive/creation buttons (`+ Create Order`, `Delete`) are disabled with tooltips. |
| **Admin** *(Devon Vance)* | System Administrator | Full `VIEW`, `CREATE`, `EDIT`, `DELETE`, `EXPORT` across all modules + **Settings** (`VIEW`, `EDIT`) | Unrestricted access. Sole persona permitted into `/settings`. |

### 6. Quick Route Tester Button
- In the top navigation bar, a **"Test /billing URL"** shortcut is permanently pinned.
- Clicking it immediately navigates to `/billing`, allowing reviewers to observe the 403 Forbidden Route Guard when logged in as User B, and normal dashboard access when switched to User A.

### 7. Interactive Module Dashboards
- **Orders Management (`/orders`)**: Interactive orders table, status badges (`Completed`, `Processing`, `Pending`), creation modal trigger (`+ Create Order`), edit, and delete actions.
- **Billing & Invoices (`/billing`)**: Revenue KPIs (Total Invoiced, Paid, Outstanding), invoice dispatching (`+ Issue Invoice`), and mark-as-paid action.
- **Customer Accounts (`/customers`)**: Partner directory cards with email, company details, and customer deletion.
- **Operational Analytics (`/analytics`)**: On-time delivery rate, dispatch lag, reliability score, and `EXPORT` report button.
- **System Administration (`/settings`)**: Visible and accessible only to Admin; displays the active RBAC JSON security matrix.

### 8. Dark Mode & Theme Persistence ([`src/hooks/useTheme.ts`](./src/hooks/useTheme.ts))
- Built with Tailwind CSS v4 class-based variant (`@custom-variant dark`).
- Toggled via the Moon/Sun icon in the header.
- Preference automatically synchronizes with `localStorage` and system theme.

---

## 🧪 Verification & Automated Testing Suite

An automated test script is provided in [`scripts/verify-permissions.mjs`](./scripts/verify-permissions.mjs).

### Run Test Suite
```bash
npm test
```

### Verified Test Cases (13/13 Passing):
1. ✅ **Core Requirement**: User A has `VIEW` for Billing (`true`).
2. ✅ **Core Requirement**: User B lacks `VIEW` for Billing (`false`).
3. ✅ **Dynamic Navigation**: User A's dynamic sidebar includes the `Billing` item.
4. ✅ **Dynamic Navigation**: User B's dynamic sidebar excludes the `Billing` item.
5. ✅ **Route Protection**: Route guard permits User A to visit `/billing`.
6. ✅ **Route Protection**: Route guard triggers 403 Access Denied for User B on `/billing`.
7. ✅ **Restricted Modules**: `/settings` is blocked for User A, User B, and User C.
8. ✅ **Admin Privileges**: `/settings` is permitted for Admin.
9. ✅ **Action Authorization**: User A has Orders `CREATE` permission (active button).
10. ✅ **Action Restriction**: User C (Auditor) lacks Orders `CREATE` permission (button hidden/disabled).
11. ✅ **Read Permission**: User C has Orders `VIEW` permission (table visible).
12. ✅ **Superuser Actions**: Admin has full `DELETE` and `EXPORT` permissions.
13. ✅ **Case-Insensitivity**: Permission matching handles `"orders"`, `"BiLLiNg"`, `"BILLING"`.

---

## 🛠️ How to Run Locally

### 1. Development Server
```bash
cd role-gate
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### 2. Step-by-Step UI Verification
1. Open the app; the active persona defaults to **User A**.
2. Check the sidebar: **Billing** is visible under Authorized Modules.
3. Switch to **User B** using the top-right persona dropdown.
4. Check the sidebar: **Billing** is now hidden, and appears under "Hidden Modules" at the bottom.
5. Click **"Test /billing URL"** in the top bar (or type `/billing` in the URL).
6. Verify that the **403 Route Guard Protection Active** screen appears.
7. Click **"Switch to User A (Has Access)"** on the 403 screen: access is restored immediately.

### 3. Production Build
```bash
npm run build
```
Compiles TypeScript and bundles via Vite with **0 errors and 0 warnings**.

---

## 📁 Directory Structure

```
role-gate/
├── README.md                      # Comprehensive project & feature documentation
├── Role_Based_Navigation.md       # Assessment requirements specification
├── index.html                     # Application HTML entry point
├── package.json                   # Dependencies, scripts, and type declarations
├── tsconfig.json                  # Strict TypeScript configuration
├── vite.config.ts                 # Vite + Tailwind CSS v4 setup
├── scripts/
│   └── verify-permissions.mjs     # 13-point automated RBAC verification test suite
└── src/
    ├── main.tsx                   # React root entry point
    ├── App.tsx                    # Route definitions and ProtectedRoute configuration
    ├── index.css                  # Tailwind styles and @custom-variant dark configuration
    ├── types/
    │   └── auth.ts                # Interfaces for User, ModulePermission, NavigationItem
    ├── data/
    │   ├── mockUsers.ts           # Persona definitions (User A, B, C, Admin)
    │   └── mockModuleData.ts      # Orders, Invoices, and Customers datasets
    ├── context/
    │   └── AuthContext.tsx        # RBAC state provider (switchUser, canViewModule, hasPermission)
    ├── hooks/
    │   ├── usePermission.ts       # Granular action permission check hook
    │   └── useTheme.ts            # Light / Dark mode persistence hook
    ├── components/
    │   ├── common/
    │   │   ├── Header.tsx         # Navbar with Persona Switcher, /billing test link, and theme toggle
    │   │   ├── PermissionButton.tsx # Action button with RBAC enforcement
    │   │   └── PermissionGate.tsx # Declarative conditional rendering gate
    │   ├── guards/
    │   │   └── ProtectedRoute.tsx # Route guard interceptor rendering 403 when unauthorized
    │   └── layout/
    │       ├── DashboardLayout.tsx# Master layout shell
    │       └── Sidebar.tsx        # Dynamic navigation menu with hidden modules audit
    └── pages/
        ├── OrdersPage.tsx         # Orders dashboard with CREATE/EDIT/DELETE actions
        ├── BillingPage.tsx        # Billing dashboard (User A vs User B test target)
        ├── CustomersPage.tsx      # Customer accounts directory
        ├── AnalyticsPage.tsx      # Fleet operational metrics with EXPORT action
        ├── SettingsPage.tsx       # System RBAC matrix (Admin-only)
        └── UnauthorizedPage.tsx   # 403 Forbidden screen with diagnostics and recovery
```
