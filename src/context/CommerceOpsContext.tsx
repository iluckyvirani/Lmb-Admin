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
  SEED_BOOKINGS,
  SEED_ORDERS,
  buildTimeline,
  statusLabelFor,
  type AdminBooking,
  type AdminOrder,
  type BookingStatus,
  type ShipmentStatus,
} from "@/data/commerceOps";
import { apiRequest, hydrateCommerceOps } from "@/lib/hydrate";
import { useAuth } from "@/context/AuthContext";

const ADVANCE: Partial<Record<ShipmentStatus, ShipmentStatus>> = {
  ordered: "packed",
  packed: "shipped",
  shipped: "out_for_delivery",
  out_for_delivery: "delivered",
};

type CommerceOpsContextValue = {
  orders: AdminOrder[];
  bookings: AdminBooking[];
  getOrder: (id: string) => AdminOrder | undefined;
  getBooking: (id: string) => AdminBooking | undefined;
  setOrderStatus: (id: string, status: ShipmentStatus) => void;
  advanceOrderStatus: (id: string) => void;
  setOrderTracking: (id: string, trackingId: string, courier: string) => void;
  setOrderNote: (id: string, note: string) => void;
  setBookingStatus: (id: string, status: BookingStatus) => void;
  setBookingNote: (id: string, note: string) => void;
  assignBooking: (
    id: string,
    assignedTo: "lmb" | string,
    assignedName: string,
  ) => void;
};

const CommerceOpsContext = createContext<CommerceOpsContextValue | null>(null);

function applyStatus(order: AdminOrder, status: ShipmentStatus): AdminOrder {
  const now = new Date().toISOString();
  const stamps: Partial<Record<ShipmentStatus, string>> = {};
  for (const step of order.timeline) {
    if (step.done && step.at) stamps[step.status] = step.at;
  }
  stamps[status] = stamps[status] || now;
  if (status === "cancelled") stamps.cancelled = now;

  return {
    ...order,
    status,
    statusLabel: statusLabelFor(status),
    timeline: buildTimeline(status, order.createdAt, stamps),
  };
}

export function CommerceOpsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState(SEED_ORDERS);
  const [bookings, setBookings] = useState(SEED_BOOKINGS);

  useEffect(() => {
    if (!user) return;
    void hydrateCommerceOps()
      .then((data) => {
        if (data.orders.length) setOrders(data.orders);
        setBookings(data.bookings.length ? data.bookings : SEED_BOOKINGS);
      })
      .catch(() => undefined);
  }, [user]);

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders],
  );
  const getBooking = useCallback(
    (id: string) => bookings.find((b) => b.id === id),
    [bookings],
  );

  const setOrderStatus = useCallback((id: string, status: ShipmentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? applyStatus(o, status) : o)),
    );
  }, []);

  const advanceOrderStatus = useCallback((id: string) => {
    setOrders((prev) => {
      const order = prev.find((o) => o.id === id);
      if (!order) return prev;
      const next = ADVANCE[order.status];
      if (!next) return prev;
      if (order.shipmentId) {
        void apiRequest(`/admin/orders/${order.shipmentId}/advance`, {
          method: "POST",
        }).catch(() => undefined);
      }
      return prev.map((o) => (o.id === id ? applyStatus(o, next) : o));
    });
  }, []);

  const setOrderTracking = useCallback(
    (id: string, trackingId: string, courier: string) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id
            ? {
                ...o,
                trackingId: trackingId.trim() || o.trackingId,
                courier: courier.trim() || o.courier,
              }
            : o,
        ),
      );
    },
    [],
  );

  const setOrderNote = useCallback((id: string, note: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, note } : o)),
    );
  }, []);

  const setBookingStatus = useCallback((id: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b)),
    );
    if (status === "confirmed" || status === "completed") {
      void apiRequest(`/admin/bookings/${id}/advance`, { method: "POST" }).catch(
        () => undefined,
      );
    }
  }, []);

  const setBookingNote = useCallback((id: string, note: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, adminNote: note } : b)),
    );
  }, []);

  const assignBooking = useCallback(
    (id: string, assignedTo: "lmb" | string, assignedName: string) => {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                assignedTo,
                assignedName,
                partnerId: "v-lmb",
                partnerName: "LMB Bar Market",
              }
            : b,
        ),
      );
      void apiRequest(`/admin/bookings/${id}/assign`, {
        method: "POST",
        body: { assignedTo, assignedName },
      }).catch(() => undefined);
    },
    [],
  );

  const value = useMemo(
    () => ({
      orders,
      bookings,
      getOrder,
      getBooking,
      setOrderStatus,
      advanceOrderStatus,
      setOrderTracking,
      setOrderNote,
      setBookingStatus,
      setBookingNote,
      assignBooking,
    }),
    [
      orders,
      bookings,
      getOrder,
      getBooking,
      setOrderStatus,
      advanceOrderStatus,
      setOrderTracking,
      setOrderNote,
      setBookingStatus,
      setBookingNote,
      assignBooking,
    ],
  );

  return (
    <CommerceOpsContext.Provider value={value}>
      {children}
    </CommerceOpsContext.Provider>
  );
}

export function useCommerceOps() {
  const ctx = useContext(CommerceOpsContext);
  if (!ctx) {
    throw new Error("useCommerceOps must be used within CommerceOpsProvider");
  }
  return ctx;
}
