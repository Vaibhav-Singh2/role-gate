# Role-Based Navigation System (RBAC Gateway)

Enterprise-grade Role-Based Access Control (RBAC) navigation system in React 18 / TypeScript and Tailwind CSS v4, built to fulfill the frontend technical assessment requirements.

---

## 🚀 Key Requirements & Implementations

### 1. Dynamic Sidebar Generation
- The navigation sidebar is rendered dynamically from an authenticated user's permissions API response payload:
  ```json
  {
    "modules": [
      { "name": "Orders", "permission": ["VIEW", "CREATE"] },
      { "name": "Billing", "permission": ["VIEW"] }
    ]
  }
  ```
- **Code Reference**: [`src/components/layout/Sidebar.tsx`](src/components/layout/Sidebar.tsx) filters registered routes using `canViewModule(item.name)` against the active user's permissions payload.

### 2. Unauthorized Modules are Hidden
- Modules where the user lacks the `"VIEW"` permission are completely excluded from the navigation bar.
- An audit pill in the sidebar inspects and displays which modules are currently hidden.

### 3. Route Guards & Protection (403 Forbidden Screen)
- If an unauthorized user bypasses the sidebar by manually typing a protected route into the browser address bar (e.g. `/billing`), the [`ProtectedRoute`](src/components/guards/ProtectedRoute.tsx) guard intercepts the render and displays a 403 Access Denied page ([`src/pages/UnauthorizedPage.tsx`](src/pages/UnauthorizedPage.tsx)).
- The 403 screen details why access was denied, shows active permissions, and offers a 1-click persona switch or return button.

### 4. Permission-Based Buttons (Granular In-Page Actions)
- Features granular action-level authorization for in-page buttons (`CREATE`, `EDIT`, `DELETE`, `EXPORT`).
- Implemented declaratively via `<PermissionButton module="Orders" action="CREATE">` and `<PermissionGate>`.
- Buttons adapt automatically: they can be either hidden or rendered in a disabled state with an explanatory lock tooltip.

### 5. Verified Assessment Test Example: User A vs User B
- **User A (Alex Mercer - Standard Manager)**: Has `VIEW` permission on **Billing**. Billing appears in the sidebar, and navigating to `/billing` succeeds.
- **User B (Bailey Chen - Operations Specialist)**: Lacks `VIEW` permission on **Billing**. Billing is completely absent from the sidebar, and entering `/billing` triggers the 403 Route Guard.
- **User C (Cameron Reed - Auditor)**: Has `VIEW` on all modules but lacks `CREATE`/`EDIT`/`DELETE`, demonstrating button disabling.
- **Devon Vance (Admin)**: Full access to all modules including system `/settings`.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: React 18, Vite 6, TypeScript 5
- **Routing**: `react-router-dom` v6
- **Styling**: Tailwind CSS v4 with `@custom-variant dark (&:where(.dark, .dark *))`
- **Icons**: `lucide-react`
- **State Management**: React Context (`AuthContext`) with persistent LocalStorage persona switching and theme management.

### Project Structure

```text
role-gate/
├── scripts/
│   └── verify-permissions.mjs    # Automated RBAC verification suite
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx        # Persona switcher, theme toggle, /billing test shortcut
│   │   │   ├── PermissionButton.tsx  # Granular action button with RBAC checking
│   │   │   └── PermissionGate.tsx    # Declarative authorization wrapper
│   │   ├── guards/
│   │   │   └── ProtectedRoute.tsx    # Route guard interceptor
│   │   └── layout/
│   │       ├── DashboardLayout.tsx   # Responsive app shell
│   │       └── Sidebar.tsx           # Dynamic authorized navigation
│   ├── context/
│   │   └── AuthContext.tsx           # RBAC permissions store & state
│   ├── data/
│   │   ├── mockModuleData.ts         # Orders, invoices, customers mock data
│   │   └── mockUsers.ts              # User A, User B, User C, Admin mock personas
│   ├── hooks/
│   │   ├── usePermission.ts          # Custom hook for granular action checks
│   │   └── useTheme.ts               # Dark / Light mode persistence hook
│   ├── pages/
│   │   ├── AnalyticsPage.tsx         # Fleet analytics with EXPORT action
│   │   ├── BillingPage.tsx           # Invoices dashboard (User A vs User B test target)
│   │   ├── CustomersPage.tsx         # Customer accounts
│   │   ├── OrdersPage.tsx            # Orders management with CREATE/EDIT/DELETE
│   │   ├── SettingsPage.tsx          # System RBAC matrix (Admin-only)
│   │   └── UnauthorizedPage.tsx      # 403 Forbidden screen
│   ├── types/
│   │   └── auth.ts                   # TypeScript interfaces & types
│   ├── App.tsx                       # Route definitions and guards
│   ├── index.css                     # Tailwind v4 setup
│   └── main.tsx                      # App entry point
└── package.json
```

---

## 🧪 Testing & Verification

### Running Automated Test Suite

```bash
npm test
```

This executes `scripts/verify-permissions.mjs` verifying:
1. User A has `VIEW` for Billing (`true`).
2. User B lacks `VIEW` for Billing (`false`).
3. User A dynamic sidebar includes Billing.
4. User B dynamic sidebar excludes Billing.
5. Direct navigation to `/billing` succeeds for User A.
6. Direct navigation to `/billing` triggers 403 Access Denied for User B.
7. Settings module is blocked for User A, B, and C, and accessible to Admin.
8. Granular `CREATE` action works for User A and is rejected for User C (Read-Only).
9. Case-insensitive module matching (`"billing"`, `"BiLLiNg"`).

### Building Production Bundle

```bash
npm run build
```

Compiles TypeScript (`tsc`) and bundles with Vite without errors or warnings.

### Running the Live Application

```bash
npm run dev
```

Open `http://localhost:5173` (or the indicated port) in your browser:
1. Notice that by default you are **User A** -> **Billing** is visible in the sidebar.
2. Click the top-right persona switcher and switch to **User B**.
3. Notice that **Billing** instantly disappears from the sidebar navigation.
4. Click the top bar's **"Test /billing URL"** button (or navigate directly to `http://localhost:5173/billing`) -> See the **403 Route Guard Protection Active** screen.
5. Click **"Switch to User A"** on the 403 page -> Access to Billing is immediately granted!
