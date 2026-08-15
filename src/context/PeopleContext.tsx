import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  SEED_USERS,
  SEED_VENDORS,
  type AdminUser,
  type AdminVendor,
  type UserStatus,
  type VendorStatus,
} from "@/data/people";
import { apiRequest, hydratePeople } from "@/lib/hydrate";
import { useAuth } from "@/context/AuthContext";

type PeopleContextValue = {
  users: AdminUser[];
  vendors: AdminVendor[];
  setUserStatus: (id: string, status: UserStatus) => void;
  setVendorStatus: (id: string, status: VendorStatus) => void;
  setVendorVerified: (id: string, verified: boolean) => void;
  getUser: (id: string) => AdminUser | undefined;
  getVendor: (id: string) => AdminVendor | undefined;
};

const PeopleContext = createContext<PeopleContextValue | null>(null);

export function PeopleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [users, setUsers] = useState(SEED_USERS);
  const [vendors, setVendors] = useState(SEED_VENDORS);

  useEffect(() => {
    if (!user) return;
    void hydratePeople()
      .then((data) => {
        if (data.users.length) setUsers(data.users);
        if (data.vendors.length) setVendors(data.vendors);
      })
      .catch(() => undefined);
  }, [user]);

  const setUserStatus = useCallback((id: string, status: UserStatus) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    void apiRequest(`/admin/users/${id}`, {
      method: "PATCH",
      body: { status },
    }).catch(() => undefined);
  }, []);

  const setVendorStatus = useCallback((id: string, status: VendorStatus) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        return {
          ...v,
          status,
          verified: status === "approved" ? true : v.verified && status !== "rejected",
        };
      }),
    );
    void apiRequest(`/admin/vendors/${id}`, {
      method: "PATCH",
      body: { status, verified: status === "approved" },
    }).catch(() => undefined);
  }, []);

  const setVendorVerified = useCallback((id: string, verified: boolean) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, verified } : v)),
    );
    void apiRequest(`/admin/vendors/${id}`, {
      method: "PATCH",
      body: { verified },
    }).catch(() => undefined);
  }, []);

  const getUser = useCallback(
    (id: string) => users.find((u) => u.id === id),
    [users],
  );
  const getVendor = useCallback(
    (id: string) => vendors.find((v) => v.id === id),
    [vendors],
  );

  const value = useMemo(
    () => ({
      users,
      vendors,
      setUserStatus,
      setVendorStatus,
      setVendorVerified,
      getUser,
      getVendor,
    }),
    [
      users,
      vendors,
      setUserStatus,
      setVendorStatus,
      setVendorVerified,
      getUser,
      getVendor,
    ],
  );

  return (
    <PeopleContext.Provider value={value}>{children}</PeopleContext.Provider>
  );
}

export function usePeople() {
  const ctx = useContext(PeopleContext);
  if (!ctx) throw new Error("usePeople must be used within PeopleProvider");
  return ctx;
}
