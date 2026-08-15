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
  SEED_COURIERS,
  SEED_PAYMENTS,
  SEED_PAYOUTS,
  SEED_RATES,
  SEED_ZONES,
  type AdminPayment,
  type CourierProvider,
  type PaymentStatus,
  type PayoutStatus,
  type ShippingRateRow,
  type ShippingZone,
  type VendorPayout,
} from "@/data/moneyLogistics";
import { apiRequest, hydrateMoney } from "@/lib/hydrate";
import { useAuth } from "@/context/AuthContext";

type MoneyLogisticsContextValue = {
  payments: AdminPayment[];
  payouts: VendorPayout[];
  couriers: CourierProvider[];
  zones: ShippingZone[];
  rates: ShippingRateRow[];
  setPaymentStatus: (id: string, status: PaymentStatus, note?: string) => void;
  setPayoutStatus: (id: string, status: PayoutStatus) => void;
  toggleCourier: (id: string) => void;
  updateZone: (id: string, patch: Partial<ShippingZone>) => void;
  updateRate: (id: string, patch: Partial<ShippingRateRow>) => void;
};

const MoneyLogisticsContext =
  createContext<MoneyLogisticsContextValue | null>(null);

export function MoneyLogisticsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [payments, setPayments] = useState(SEED_PAYMENTS);
  const [payouts, setPayouts] = useState(SEED_PAYOUTS);
  const [couriers, setCouriers] = useState(SEED_COURIERS);
  const [zones, setZones] = useState(SEED_ZONES);
  const [rates, setRates] = useState(SEED_RATES);

  useEffect(() => {
    if (!user) return;
    void hydrateMoney()
      .then((data) => {
        setPayments(data.payments.length ? data.payments : SEED_PAYMENTS);
        setPayouts(data.payouts.length ? data.payouts : SEED_PAYOUTS);
        setCouriers(data.couriers.length ? data.couriers : SEED_COURIERS);
        setZones(data.zones.length ? data.zones : SEED_ZONES);
        setRates(data.rates.length ? data.rates : SEED_RATES);
      })
      .catch(() => undefined);
  }, [user]);

  const setPaymentStatus = useCallback(
    (id: string, status: PaymentStatus, note?: string) => {
      setPayments((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, status, note: note !== undefined ? note : p.note }
            : p,
        ),
      );
    },
    [],
  );

  const setPayoutStatus = useCallback((id: string, status: PayoutStatus) => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p)),
    );
    void apiRequest(`/admin/payouts/${id}`, {
      method: "PATCH",
      body: { status },
    }).catch(() => undefined);
  }, []);

  const toggleCourier = useCallback((id: string) => {
    setCouriers((prev) => {
      const next = prev.map((c) =>
        c.id === id ? { ...c, active: !c.active } : c,
      );
      const row = next.find((c) => c.id === id);
      if (row) {
        void apiRequest("/admin/shipping/couriers", {
          method: "POST",
          body: {
            id: row.id,
            name: row.name,
            code: row.code,
            kind: row.kind,
            active: row.active,
            trackingPrefix: row.trackingPrefix,
            avgEtaDays: row.avgEtaDays,
            supportPhone: row.supportPhone,
          },
        }).catch(() => undefined);
      }
      return next;
    });
  }, []);

  const updateZone = useCallback(
    (id: string, patch: Partial<ShippingZone>) => {
      setZones((prev) =>
        prev.map((z) => (z.id === id ? { ...z, ...patch } : z)),
      );
    },
    [],
  );

  const updateRate = useCallback(
    (id: string, patch: Partial<ShippingRateRow>) => {
      setRates((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      );
    },
    [],
  );

  const value = useMemo(
    () => ({
      payments,
      payouts,
      couriers,
      zones,
      rates,
      setPaymentStatus,
      setPayoutStatus,
      toggleCourier,
      updateZone,
      updateRate,
    }),
    [
      payments,
      payouts,
      couriers,
      zones,
      rates,
      setPaymentStatus,
      setPayoutStatus,
      toggleCourier,
      updateZone,
      updateRate,
    ],
  );

  return (
    <MoneyLogisticsContext.Provider value={value}>
      {children}
    </MoneyLogisticsContext.Provider>
  );
}

export function useMoneyLogistics() {
  const ctx = useContext(MoneyLogisticsContext);
  if (!ctx) {
    throw new Error(
      "useMoneyLogistics must be used within MoneyLogisticsProvider",
    );
  }
  return ctx;
}
