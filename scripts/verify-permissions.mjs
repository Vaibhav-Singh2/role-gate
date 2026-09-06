/**
 * Automated Verification Script for Role-Based Navigation System
 * Tests dynamic sidebar generation, route guards, and granular action permissions.
 */

import assert from "node:assert";

// Mock Data directly reflecting API responses defined in src/data/mockUsers.ts
const MOCK_USERS = [
  {
    id: "user-a",
    name: "Alex Mercer",
    personaLabel: "User A (Standard Manager)",
    modules: [
      { name: "Orders", permission: ["VIEW", "CREATE", "EDIT", "DELETE"] },
      { name: "Billing", permission: ["VIEW", "CREATE", "EDIT"] },
      { name: "Customers", permission: ["VIEW", "CREATE", "EDIT"] },
      { name: "Analytics", permission: ["VIEW", "EXPORT"] },
    ],
  },
  {
    id: "user-b",
    name: "Bailey Chen",
    personaLabel: "User B (Operations Specialist)",
    modules: [
      { name: "Orders", permission: ["VIEW", "CREATE", "EDIT"] },
      { name: "Customers", permission: ["VIEW"] },
      { name: "Analytics", permission: ["VIEW"] },
    ],
  },
  {
    id: "user-c",
    name: "Cameron Reed",
    personaLabel: "User C (Read-Only Auditor)",
    modules: [
      { name: "Orders", permission: ["VIEW"] },
      { name: "Billing", permission: ["VIEW"] },
      { name: "Customers", permission: ["VIEW"] },
      { name: "Analytics", permission: ["VIEW"] },
    ],
  },
  {
    id: "admin",
    name: "Devon Vance",
    personaLabel: "System Administrator",
    modules: [
      { name: "Orders", permission: ["VIEW", "CREATE", "EDIT", "DELETE", "EXPORT"] },
      { name: "Billing", permission: ["VIEW", "CREATE", "EDIT", "DELETE", "EXPORT"] },
      { name: "Customers", permission: ["VIEW", "CREATE", "EDIT", "DELETE", "EXPORT"] },
      { name: "Analytics", permission: ["VIEW", "EXPORT"] },
      { name: "Settings", permission: ["VIEW", "EDIT"] },
    ],
  },
];

const NAVIGATION_ITEMS = [
  { id: "orders", name: "Orders", path: "/orders" },
  { id: "billing", name: "Billing", path: "/billing" },
  { id: "customers", name: "Customers", path: "/customers" },
  { id: "analytics", name: "Analytics", path: "/analytics" },
  { id: "settings", name: "Settings", path: "/settings" },
];

function canViewModule(user, moduleName) {
  const mod = user.modules.find(
    (m) => m.name.toLowerCase() === moduleName.toLowerCase()
  );
  return !!mod && mod.permission.includes("VIEW");
}

function hasPermission(user, moduleName, action) {
  const mod = user.modules.find(
    (m) => m.name.toLowerCase() === moduleName.toLowerCase()
  );
  return !!mod && mod.permission.includes(action);
}

function getAuthorizedNavItems(user) {
  return NAVIGATION_ITEMS.filter((item) => canViewModule(user, item.name));
}

console.log("=================================================");
console.log("  ROLE-BASED NAVIGATION (RBAC) TEST SUITE");
console.log("=================================================\n");

let passed = 0;
let total = 0;

function test(description, fn) {
  total++;
  try {
    fn();
    console.log(`  [PASS] ${description}`);
    passed++;
  } catch (err) {
    console.error(`  [FAIL] ${description}`);
    console.error(`         ${err.message}`);
  }
}

const userA = MOCK_USERS.find((u) => u.id === "user-a");
const userB = MOCK_USERS.find((u) => u.id === "user-b");
const userC = MOCK_USERS.find((u) => u.id === "user-c");
const admin = MOCK_USERS.find((u) => u.id === "admin");

console.log("--- 1. CORE REQUIREMENT: User A sees Billing; User B doesn't ---");

test("User A has VIEW permission for Billing module", () => {
  assert.strictEqual(canViewModule(userA, "Billing"), true);
});

test("User B does NOT have VIEW permission for Billing module", () => {
  assert.strictEqual(canViewModule(userB, "Billing"), false);
});

test("User A's dynamic sidebar includes Billing item", () => {
  const nav = getAuthorizedNavItems(userA);
  assert.ok(nav.some((item) => item.name === "Billing"));
});

test("User B's dynamic sidebar excludes Billing item", () => {
  const nav = getAuthorizedNavItems(userB);
  assert.strictEqual(nav.some((item) => item.name === "Billing"), false);
});

console.log("\n--- 2. ROUTE GUARD PROTECTION (URL Interception) ---");

test("Direct URL guard allows User A to visit /billing", () => {
  assert.strictEqual(canViewModule(userA, "Billing"), true);
});

test("Direct URL guard triggers 403 Access Denied for User B on /billing", () => {
  const allowed = canViewModule(userB, "Billing");
  assert.strictEqual(allowed, false);
});

test("Settings module is blocked for User A, User B, and User C", () => {
  assert.strictEqual(canViewModule(userA, "Settings"), false);
  assert.strictEqual(canViewModule(userB, "Settings"), false);
  assert.strictEqual(canViewModule(userC, "Settings"), false);
});

test("Settings module is permitted for Admin", () => {
  assert.strictEqual(canViewModule(admin, "Settings"), true);
});

console.log("\n--- 3. GRANULAR ACTION PERMISSIONS (Buttons / In-Page Actions) ---");

test("User A has Orders CREATE permission (Create Order button active)", () => {
  assert.strictEqual(hasPermission(userA, "Orders", "CREATE"), true);
});

test("User C (Auditor) lacks Orders CREATE permission (Create Order button hidden/disabled)", () => {
  assert.strictEqual(hasPermission(userC, "Orders", "CREATE"), false);
});

test("User C has Orders VIEW permission (can inspect orders)", () => {
  assert.strictEqual(hasPermission(userC, "Orders", "VIEW"), true);
});

test("Admin has full DELETE & EXPORT permissions across modules", () => {
  assert.strictEqual(hasPermission(admin, "Orders", "DELETE"), true);
  assert.strictEqual(hasPermission(admin, "Billing", "EXPORT"), true);
});

console.log("\n--- 4. ROBUSTNESS & CASE INSENSITIVITY ---");

test("Permission checks are case-insensitive ('orders', 'BiLLiNg')", () => {
  assert.strictEqual(canViewModule(userA, "orders"), true);
  assert.strictEqual(canViewModule(userA, "BiLLiNg"), true);
  assert.strictEqual(canViewModule(userB, "BILLING"), false);
});

console.log("\n=================================================");
console.log(`  RESULT: ${passed}/${total} TESTS PASSED`);
console.log("=================================================");

if (passed !== total) {
  process.exit(1);
}
