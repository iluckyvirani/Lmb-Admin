/** Money & logistics mock — payments, payouts, shipping */

export type PaymentMethod = "UPI" | "Card" | "COD";
export type PaymentStatus =
  | "paid"
  | "pending"
  | "failed"
  | "refunded"
  | "partial_refund";

export type PaymentRefType = "order" | "booking";

export type AdminPayment = {
  id: string;
  createdAt: string;
  refType: PaymentRefType;
  refId: string;
  customerName: string;
  vendorName: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  gatewayRef?: string;
  note?: string;
};

export type PayoutStatus = "scheduled" | "processing" | "paid" | "on_hold";

export type VendorPayout = {
  id: string;
  vendorId: string;
  vendorName: string;
  periodLabel: string;
  amount: number;
  ordersCount: number;
  status: PayoutStatus;
  scheduledFor: string;
};

export type CourierProvider = {
  id: string;
  name: string;
  code: string;
  kind: "rocket" | "surface" | "express";
  active: boolean;
  trackingPrefix: string;
  avgEtaDays: number;
  supportPhone: string;
};

export type ShippingZone = {
  id: string;
  name: string;
  pincodePrefixes: string[];
  etaMinDays: number;
  etaMaxDays: number;
  baseRate: number;
  freeAbove: number;
};

export type ShippingRateRow = {
  id: string;
  zoneId: string;
  zoneName: string;
  weightKgMax: number;
  rate: number;
  rocketSurcharge: number;
};

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const ts = (daysAgo: number, hour = 12, minute = 0): string => {
  const d = new Date("2026-08-13T12:00:00");
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const SEED_PAYMENTS: AdminPayment[] = [
  {
    id: "PAY-9012",
    createdAt: ts(1, 18, 22),
    refType: "order",
    refId: "LMB-1042",
    customerName: "Aarav Mehta",
    vendorName: "Crystal Pour Supplies",
    method: "UPI",
    amount: 7647,
    status: "paid",
    gatewayRef: "upi_rzp_1042a",
  },
  {
    id: "PAY-9011",
    createdAt: ts(1, 14, 8),
    refType: "order",
    refId: "LMB-1041",
    customerName: "Neha Sharma",
    vendorName: "LMB Official Store",
    method: "Card",
    amount: 14999,
    status: "paid",
    gatewayRef: "card_rzp_1041b",
  },
  {
    id: "PAY-9010",
    createdAt: ts(2, 21, 42),
    refType: "order",
    refId: "LMB-1040",
    customerName: "Rohan Kapoor",
    vendorName: "ShakeCraft Tools",
    method: "UPI",
    amount: 4298,
    status: "paid",
    gatewayRef: "upi_rzp_1040c",
  },
  {
    id: "PAY-9009",
    createdAt: ts(2, 11, 20),
    refType: "order",
    refId: "LMB-1039",
    customerName: "Priya Nair",
    vendorName: "LMB Official Store",
    method: "COD",
    amount: 8999,
    status: "pending",
    note: "Collect on delivery",
  },
  {
    id: "PAY-9008",
    createdAt: ts(3, 9, 35),
    refType: "order",
    refId: "LMB-1038",
    customerName: "Kabir Singh",
    vendorName: "Crystal Pour Supplies",
    method: "UPI",
    amount: 3198,
    status: "paid",
    gatewayRef: "upi_rzp_1038d",
  },
  {
    id: "PAY-9007",
    createdAt: ts(3, 19, 5),
    refType: "order",
    refId: "LMB-1037",
    customerName: "Neha Sharma",
    vendorName: "ShakeCraft Tools",
    method: "Card",
    amount: 5498,
    status: "failed",
    gatewayRef: "card_rzp_1037_fail",
    note: "Bank declined — retry pending",
  },
  {
    id: "PAY-9006",
    createdAt: ts(4, 12, 10),
    refType: "order",
    refId: "LMB-1036",
    customerName: "Aarav Mehta",
    vendorName: "LMB Official Store",
    method: "UPI",
    amount: 6200,
    status: "paid",
    gatewayRef: "upi_rzp_1036e",
  },
  {
    id: "PAY-9005",
    createdAt: ts(5, 8, 15),
    refType: "order",
    refId: "LMB-1035",
    customerName: "Rohan Kapoor",
    vendorName: "Crystal Pour Supplies",
    method: "COD",
    amount: 2498,
    status: "refunded",
    note: "Order cancelled before pack",
  },
  {
    id: "PAY-8801",
    createdAt: ts(2, 10, 5),
    refType: "booking",
    refId: "BK-2199",
    customerName: "Priya Nair",
    vendorName: "Event Pour Co.",
    method: "UPI",
    amount: 14000,
    status: "paid",
    gatewayRef: "upi_bk_2199",
    note: "50% booking advance",
  },
  {
    id: "PAY-8800",
    createdAt: ts(4, 14, 20),
    refType: "booking",
    refId: "BK-2198",
    customerName: "Kabir Singh",
    vendorName: "Event Pour Co.",
    method: "Card",
    amount: 95000,
    status: "paid",
    gatewayRef: "card_bk_2198",
  },
  {
    id: "PAY-8799",
    createdAt: ts(1, 16, 40),
    refType: "booking",
    refId: "BK-2200",
    customerName: "Neha Sharma",
    vendorName: "Event Pour Co.",
    method: "UPI",
    amount: 21000,
    status: "partial_refund",
    gatewayRef: "upi_bk_2200",
    note: "Guest count reduced — partial refund ₹5,000",
  },
  {
    id: "PAY-8798",
    createdAt: ts(0, 11, 10),
    refType: "booking",
    refId: "BK-2201",
    customerName: "Aarav Mehta",
    vendorName: "Event Pour Co.",
    method: "UPI",
    amount: 42500,
    status: "pending",
    note: "Awaiting advance for wedding booking",
  },
];

export const SEED_PAYOUTS: VendorPayout[] = [
  {
    id: "PO-441",
    vendorId: "v-crystal",
    vendorName: "Crystal Pour Supplies",
    periodLabel: "1–7 Aug 2026",
    amount: 42000,
    ordersCount: 11,
    status: "scheduled",
    scheduledFor: "2026-08-15",
  },
  {
    id: "PO-440",
    vendorId: "v-lmb",
    vendorName: "LMB Official Store",
    periodLabel: "1–7 Aug 2026",
    amount: 125000,
    ordersCount: 28,
    status: "processing",
    scheduledFor: "2026-08-14",
  },
  {
    id: "PO-439",
    vendorId: "v-shake",
    vendorName: "ShakeCraft Tools",
    periodLabel: "25–31 Jul 2026",
    amount: 18500,
    ordersCount: 9,
    status: "paid",
    scheduledFor: "2026-08-07",
  },
  {
    id: "PO-438",
    vendorId: "v-event",
    vendorName: "Event Pour Co.",
    periodLabel: "1–7 Aug 2026",
    amount: 89000,
    ordersCount: 4,
    status: "on_hold",
    scheduledFor: "2026-08-16",
  },
];

export const SEED_COURIERS: CourierProvider[] = [
  {
    id: "c-rocket",
    name: "Rocket Express",
    code: "ROCKET",
    kind: "rocket",
    active: true,
    trackingPrefix: "LMBTRACK",
    avgEtaDays: 2,
    supportPhone: "1800-200-7645",
  },
  {
    id: "c-delhivery",
    name: "Delhivery",
    code: "DLV",
    kind: "surface",
    active: true,
    trackingPrefix: "DLV",
    avgEtaDays: 4,
    supportPhone: "1800-123-4567",
  },
  {
    id: "c-ekart",
    name: "Ekart Logistics",
    code: "EKART",
    kind: "express",
    active: true,
    trackingPrefix: "EKO",
    avgEtaDays: 3,
    supportPhone: "1800-208-9898",
  },
  {
    id: "c-bluedart",
    name: "Blue Dart",
    code: "BD",
    kind: "express",
    active: false,
    trackingPrefix: "BD",
    avgEtaDays: 2,
    supportPhone: "1860-233-1234",
  },
];

export const SEED_ZONES: ShippingZone[] = [
  {
    id: "z-metro",
    name: "Metro (NCR / Mumbai / BLR / HYD)",
    pincodePrefixes: ["11", "12", "40", "56", "50"],
    etaMinDays: 1,
    etaMaxDays: 3,
    baseRate: 0,
    freeAbove: 2999,
  },
  {
    id: "z-tier1",
    name: "Tier-1 cities",
    pincodePrefixes: ["60", "70", "38", "41", "30"],
    etaMinDays: 2,
    etaMaxDays: 5,
    baseRate: 149,
    freeAbove: 4999,
  },
  {
    id: "z-rest",
    name: "Rest of India",
    pincodePrefixes: ["*"],
    etaMinDays: 4,
    etaMaxDays: 8,
    baseRate: 299,
    freeAbove: 7999,
  },
];

export const SEED_RATES: ShippingRateRow[] = [
  {
    id: "r1",
    zoneId: "z-metro",
    zoneName: "Metro",
    weightKgMax: 1,
    rate: 0,
    rocketSurcharge: 99,
  },
  {
    id: "r2",
    zoneId: "z-metro",
    zoneName: "Metro",
    weightKgMax: 5,
    rate: 99,
    rocketSurcharge: 149,
  },
  {
    id: "r3",
    zoneId: "z-tier1",
    zoneName: "Tier-1",
    weightKgMax: 1,
    rate: 149,
    rocketSurcharge: 129,
  },
  {
    id: "r4",
    zoneId: "z-tier1",
    zoneName: "Tier-1",
    weightKgMax: 5,
    rate: 249,
    rocketSurcharge: 179,
  },
  {
    id: "r5",
    zoneId: "z-rest",
    zoneName: "Rest of India",
    weightKgMax: 1,
    rate: 299,
    rocketSurcharge: 199,
  },
  {
    id: "r6",
    zoneId: "z-rest",
    zoneName: "Rest of India",
    weightKgMax: 5,
    rate: 449,
    rocketSurcharge: 249,
  },
];

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  failed: "Failed",
  refunded: "Refunded",
  partial_refund: "Partial refund",
};

export const PAYOUT_STATUS_LABEL: Record<PayoutStatus, string> = {
  scheduled: "Scheduled",
  processing: "Processing",
  paid: "Paid",
  on_hold: "On hold",
};
