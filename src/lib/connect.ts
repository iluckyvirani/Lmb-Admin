/**
 * Admin API client — talks to LMB Express server.
 * Falls back to mock seeds when the API is unreachable.
 */

export type ApiMode = "remote" | "mock";

export const API_MODE: ApiMode =
  (import.meta.env.VITE_API_MODE as ApiMode | undefined) ?? "remote";

export const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:4000/api";

export const AUTH_TOKEN_KEY = "lmb-admin-api-token";
export const AUTH_STORAGE_KEY = "lmb-admin-auth-v1";

export const ID_PREFIX = {
  order: "LMB-",
  booking: "BK-",
  tracking: "LMBTRACK",
  payment: "PAY-",
  ticket: "TK-",
} as const;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function getAdminToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAdminToken(token: string | null) {
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
  else localStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function apiRequest<T>(
  path: string,
  opts: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  if (API_MODE === "mock") {
    throw new ApiError(503, "API_MODE=mock");
  }

  const headers: Record<string, string> = { Accept: "application/json" };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (opts.auth !== false) {
    const token = getAdminToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method ?? (opts.body !== undefined ? "POST" : "GET"),
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });

  let data: Record<string, unknown> = {};
  try {
    data = (await res.json()) as Record<string, unknown>;
  } catch {
    /* empty */
  }

  if (!res.ok) {
    throw new ApiError(
      res.status,
      String(data.error ?? `API ${res.status}: ${path}`),
    );
  }
  return data as T;
}

/** @deprecated — use apiRequest */
export async function apiGet<T>(path: string, mock: T): Promise<T> {
  try {
    return await apiRequest<T>(path);
  } catch {
    return mock;
  }
}

export const CONNECT_NOTES = [
  "Admin contexts hydrate from /api/admin/* on login.",
  "Services & bookings remain mock on the server.",
  "Set VITE_API_BASE_URL in admin/.env",
];
