import { apiRequest, setAdminToken } from "@/lib/connect";
import type { AuthUser } from "@/data/auth";
import type { AdminRole } from "@/data/platform";

export async function adminLogin(email: string, password: string) {
  const res = await apiRequest<{
    ok: boolean;
    token: string;
    admin: {
      id: string;
      name: string;
      email: string;
      role: AdminRole;
    };
  }>("/admin/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
  setAdminToken(res.token);
  const user: AuthUser = {
    id: String(res.admin.id),
    name: String(res.admin.name),
    email: String(res.admin.email),
    role: res.admin.role,
  };
  return user;
}

export async function adminMe() {
  const res = await apiRequest<{
    ok: boolean;
    admin: { id: string; name: string; email: string; role: AdminRole };
  }>("/admin/auth/me");
  return {
    id: String(res.admin.id),
    name: String(res.admin.name),
    email: String(res.admin.email),
    role: res.admin.role,
  } satisfies AuthUser;
}
