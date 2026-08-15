/** Demo auth — replace with real API in production */

import { SEED_STAFF, type AdminRole, type StaffAdmin } from "@/data/platform";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
};

/** Shared demo password for all active staff accounts */
export const DEMO_PASSWORD = "lmbadmin";

export const DEMO_ACCOUNTS = SEED_STAFF.filter((s) => s.active).map((s) => ({
  email: s.email,
  role: s.role,
  name: s.name,
}));

export function authenticate(
  email: string,
  password: string,
): { ok: true; user: AuthUser } | { ok: false; error: string } {
  const normalized = email.trim().toLowerCase();
  const staff = SEED_STAFF.find((s) => s.email.toLowerCase() === normalized);

  if (!staff) {
    return { ok: false, error: "No account found for that email." };
  }
  if (!staff.active) {
    return { ok: false, error: "This account is disabled." };
  }
  if (password !== DEMO_PASSWORD) {
    return { ok: false, error: "Incorrect password." };
  }

  return {
    ok: true,
    user: toAuthUser(staff),
  };
}

export function toAuthUser(staff: StaffAdmin): AuthUser {
  return {
    id: staff.id,
    name: staff.name,
    email: staff.email,
    role: staff.role,
  };
}

export const AUTH_STORAGE_KEY = "lmb-admin-auth-v1";
