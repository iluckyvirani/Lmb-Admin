import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AUTH_STORAGE_KEY, type AuthUser } from "@/data/auth";
import { setAdminToken } from "@/lib/connect";
import { adminLogin, adminMe } from "@/lib/adminApi";

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        if (parsed?.id && parsed?.email) setUser(parsed);
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    void adminMe()
      .then((me) => {
        setUser(me);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(me));
      })
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const next = await adminLogin(email, password);
      setUser(next);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
      return { ok: true as const };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "Login failed",
      };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAdminToken(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, logout }),
    [user, ready, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
