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
  SEED_NOTIF_LOG,
  SEED_SETTINGS,
  SEED_STAFF,
  SEED_TEMPLATES,
  SEED_TICKETS,
  type AdminRole,
  type NotifChannel,
  type NotifLog,
  type NotifTemplate,
  type StaffAdmin,
  type StoreSettings,
  type SupportTicket,
  type TicketStatus,
} from "@/data/platform";
import { apiRequest, hydratePlatform } from "@/lib/hydrate";
import { useAuth } from "@/context/AuthContext";

type PlatformContextValue = {
  settings: StoreSettings;
  updateSettings: (patch: Partial<StoreSettings>) => void;
  templates: NotifTemplate[];
  setTemplateChannel: (
    id: string,
    channel: NotifChannel,
    enabled: boolean,
  ) => void;
  updateTemplate: (id: string, patch: Partial<NotifTemplate>) => void;
  notifLog: NotifLog[];
  tickets: SupportTicket[];
  setTicketStatus: (id: string, status: TicketStatus) => void;
  assignTicket: (id: string, assignee: string) => void;
  staff: StaffAdmin[];
  setStaffRole: (id: string, role: AdminRole) => void;
  setStaffActive: (id: string, active: boolean) => void;
  inviteStaff: (input: {
    name: string;
    email: string;
    role: AdminRole;
  }) => void;
};

const PlatformContext = createContext<PlatformContextValue | null>(null);

export function PlatformProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState(SEED_SETTINGS);
  const [templates, setTemplates] = useState(SEED_TEMPLATES);
  const [notifLog] = useState(SEED_NOTIF_LOG);
  const [tickets, setTickets] = useState(SEED_TICKETS);
  const [staff, setStaff] = useState(SEED_STAFF);

  useEffect(() => {
    if (!user) return;
    void hydratePlatform()
      .then((data) => {
        setSettings({ ...SEED_SETTINGS, ...data.settings });
        if (data.tickets.length) setTickets(data.tickets);
        if (data.staff.length) setStaff(data.staff);
      })
      .catch(() => undefined);
  }, [user]);

  const updateSettings = useCallback((patch: Partial<StoreSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      void apiRequest("/admin/settings", {
        method: "PUT",
        body: { settings: next },
      }).catch(() => undefined);
      return next;
    });
  }, []);

  const setTemplateChannel = useCallback(
    (id: string, channel: NotifChannel, enabled: boolean) => {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, channels: { ...t.channels, [channel]: enabled } }
            : t,
        ),
      );
    },
    [],
  );

  const updateTemplate = useCallback(
    (id: string, patch: Partial<NotifTemplate>) => {
      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      );
    },
    [],
  );

  const setTicketStatus = useCallback((id: string, status: TicketStatus) => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status, updatedAt: now } : t,
      ),
    );
    void apiRequest(`/admin/support/${id}`, {
      method: "PATCH",
      body: { status },
    }).catch(() => undefined);
  }, []);

  const assignTicket = useCallback((id: string, assignee: string) => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, assignee: assignee.trim() || undefined, updatedAt: now }
          : t,
      ),
    );
    void apiRequest(`/admin/support/${id}`, {
      method: "PATCH",
      body: { assignee: assignee.trim() },
    }).catch(() => undefined);
  }, []);

  const setStaffRole = useCallback((id: string, role: AdminRole) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, role } : s)),
    );
  }, []);

  const setStaffActive = useCallback((id: string, active: boolean) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active } : s)),
    );
  }, []);

  const inviteStaff = useCallback(
    (input: { name: string; email: string; role: AdminRole }) => {
      const id = `a${Date.now().toString().slice(-4)}`;
      setStaff((prev) => [
        {
          id,
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          role: input.role,
          active: true,
          lastActiveAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      void apiRequest("/admin/staff", {
        method: "POST",
        body: {
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          role: input.role,
          password: "lmbadmin",
        },
      }).catch(() => undefined);
    },
    [],
  );

  const value = useMemo(
    () => ({
      settings,
      updateSettings,
      templates,
      setTemplateChannel,
      updateTemplate,
      notifLog,
      tickets,
      setTicketStatus,
      assignTicket,
      staff,
      setStaffRole,
      setStaffActive,
      inviteStaff,
    }),
    [
      settings,
      updateSettings,
      templates,
      setTemplateChannel,
      updateTemplate,
      notifLog,
      tickets,
      setTicketStatus,
      assignTicket,
      staff,
      setStaffRole,
      setStaffActive,
      inviteStaff,
    ],
  );

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) {
    throw new Error("usePlatform must be used within PlatformProvider");
  }
  return ctx;
}
