/** Commerce ops mock — product orders & service bookings */

export type ShipmentStatus =
  | "ordered"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type TimelineStep = {
  status: ShipmentStatus;
  label: string;
  at: string;
  done: boolean;
};

export type OrderLine = {
  id: string;
  title: string;
  qty: number;
  unitPrice: number;
};

export type PaymentMethod = "UPI" | "Card" | "COD";

export type AdminOrder = {
  id: string;
  createdAt: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  vendorId: string;
  vendorName: string;
  status: ShipmentStatus;
  statusLabel: string;
  trackingId: string;
  courier: string;
  expectedDelivery: string;
  paymentMethod: PaymentMethod;
  paymentStatus: "paid" | "pending" | "cod";
  subtotal: number;
  shipping: number;
  total: number;
  address: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  lines: OrderLine[];
  timeline: TimelineStep[];
  note?: string;
  /** API shipment row id (for advance/tracking) */
  shipmentId?: string;
};

export type BookingStatus =
  | "pending"
  | "info_requested"
  | "confirmed"
  | "completed"
  | "cancelled";

export type AdminBooking = {
  id: string;
  createdAt: string;
  serviceId: string;
  serviceTitle: string;
  /** Catalog brand on website — always LMB for services */
  partnerId: string;
  partnerName: string;
  /** Fulfillment: "lmb" or verified service partner id */
  assignedTo: "lmb" | string;
  assignedName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  eventDate: string;
  guests: number;
  city: string;
  venue?: string;
  amount: number;
  status: BookingStatus;
  message: string;
  adminNote?: string;
};

export const PRODUCT_TIMELINE_TEMPLATE: {
  status: ShipmentStatus;
  label: string;
}[] = [
  { status: "ordered", label: "Ordered" },
  { status: "packed", label: "Packed" },
  { status: "shipped", label: "Shipped" },
  { status: "out_for_delivery", label: "Out for delivery" },
  { status: "delivered", label: "Delivered" },
];

export const SHIPMENT_BOARD_COLUMNS: {
  status: ShipmentStatus;
  label: string;
}[] = [
  { status: "ordered", label: "To pack" },
  { status: "packed", label: "Packed" },
  { status: "shipped", label: "Shipped" },
  { status: "out_for_delivery", label: "Out for delivery" },
];

export function statusLabelFor(status: ShipmentStatus): string {
  if (status === "cancelled") return "Cancelled";
  return (
    PRODUCT_TIMELINE_TEMPLATE.find((t) => t.status === status)?.label ?? status
  );
}

export function buildTimeline(
  current: ShipmentStatus,
  createdAt: string,
  stamps?: Partial<Record<ShipmentStatus, string>>,
): TimelineStep[] {
  if (current === "cancelled") {
    return [
      {
        status: "ordered",
        label: "Ordered",
        at: createdAt,
        done: true,
      },
      {
        status: "cancelled",
        label: "Cancelled",
        at: stamps?.cancelled ?? createdAt,
        done: true,
      },
    ];
  }
  const order = PRODUCT_TIMELINE_TEMPLATE.map((t) => t.status);
  const idx = order.indexOf(current);
  return PRODUCT_TIMELINE_TEMPLATE.map((t, i) => ({
    status: t.status,
    label: t.label,
    at: i <= idx ? (stamps?.[t.status] ?? (i === 0 ? createdAt : "")) : "",
    done: i <= idx,
  }));
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPhone(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (d.length === 10) return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
  return phone;
}

const ts = (
  daysAgo: number,
  hour = 12,
  minute = 0,
): string => {
  const d = new Date("2026-08-13T12:00:00");
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const SEED_ORDERS: AdminOrder[] = [
  {
    id: "LMB-1042",
    createdAt: ts(1, 18, 20),
    customerId: "u1",
    customerName: "Aarav Mehta",
    customerPhone: "9876543210",
    vendorId: "v-crystal",
    vendorName: "Crystal Pour Supplies",
    status: "out_for_delivery",
    statusLabel: "Out for delivery",
    trackingId: "LMBTRACK104201",
    courier: "Rocket Express",
    expectedDelivery: "2026-08-13",
    paymentMethod: "UPI",
    paymentStatus: "paid",
    subtotal: 7299,
    shipping: 348,
    total: 7647,
    address: {
      line1: "14, Golf Course Road",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122001",
    },
    lines: [
      { id: "p1", title: "Crystal Mixing Glass 750ml", qty: 1, unitPrice: 4299 },
      { id: "p2", title: "Gold Bar Spoon Set", qty: 2, unitPrice: 1500 },
    ],
    timeline: buildTimeline("out_for_delivery", ts(1, 18, 20), {
      ordered: ts(1, 18, 20),
      packed: ts(1, 6, 0),
      shipped: ts(0, 22, 0),
      out_for_delivery: ts(0, 10, 30),
    }),
  },
  {
    id: "LMB-1041",
    createdAt: ts(1, 14, 5),
    customerId: "u2",
    customerName: "Neha Sharma",
    customerPhone: "9811122233",
    vendorId: "v-lmb",
    vendorName: "LMB Official Store",
    status: "packed",
    statusLabel: "Packed",
    trackingId: "LMBTRACK104102",
    courier: "Rocket Express",
    expectedDelivery: "2026-08-15",
    paymentMethod: "Card",
    paymentStatus: "paid",
    subtotal: 14999,
    shipping: 0,
    total: 14999,
    address: {
      line1: "22, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
    },
    lines: [
      { id: "p8", title: "Pro Mobile Bar Cart", qty: 1, unitPrice: 14999 },
    ],
    timeline: buildTimeline("packed", ts(1, 14, 5), {
      ordered: ts(1, 14, 5),
      packed: ts(0, 9, 0),
    }),
  },
  {
    id: "LMB-1040",
    createdAt: ts(2, 21, 40),
    customerId: "u3",
    customerName: "Rohan Kapoor",
    customerPhone: "9822334455",
    vendorId: "v-shake",
    vendorName: "ShakeCraft Tools",
    status: "shipped",
    statusLabel: "Shipped",
    trackingId: "LMBTRACK104003",
    courier: "Delhivery",
    expectedDelivery: "2026-08-14",
    paymentMethod: "UPI",
    paymentStatus: "paid",
    subtotal: 3999,
    shipping: 299,
    total: 4298,
    address: {
      line1: "88, Koramangala 5th Block",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560095",
    },
    lines: [
      { id: "p3", title: "Boston Shaker Tin Set", qty: 1, unitPrice: 2199 },
      { id: "p4", title: "Japanese Jigger 30/60", qty: 2, unitPrice: 900 },
    ],
    timeline: buildTimeline("shipped", ts(2, 21, 40), {
      ordered: ts(2, 21, 40),
      packed: ts(2, 10, 0),
      shipped: ts(1, 16, 0),
    }),
  },
  {
    id: "LMB-1039",
    createdAt: ts(2, 11, 15),
    customerId: "u4",
    customerName: "Priya Nair",
    customerPhone: "9988776655",
    vendorId: "v-lmb",
    vendorName: "LMB Official Store",
    status: "delivered",
    statusLabel: "Delivered",
    trackingId: "LMBTRACK103904",
    courier: "Rocket Express",
    expectedDelivery: "2026-08-12",
    paymentMethod: "COD",
    paymentStatus: "cod",
    subtotal: 8999,
    shipping: 0,
    total: 8999,
    address: {
      line1: "5, Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500033",
    },
    lines: [
      { id: "p9", title: "Copper Moscow Mule Set", qty: 1, unitPrice: 8999 },
    ],
    timeline: buildTimeline("delivered", ts(2, 11, 15), {
      ordered: ts(2, 11, 15),
      packed: ts(2, 16, 0),
      shipped: ts(1, 8, 0),
      out_for_delivery: ts(1, 11, 0),
      delivered: ts(1, 14, 20),
    }),
  },
  {
    id: "LMB-1038",
    createdAt: ts(3, 9, 30),
    customerId: "u5",
    customerName: "Kabir Singh",
    customerPhone: "9700011223",
    vendorId: "v-crystal",
    vendorName: "Crystal Pour Supplies",
    status: "ordered",
    statusLabel: "Ordered",
    trackingId: "LMBTRACK103805",
    courier: "Pending assign",
    expectedDelivery: "2026-08-16",
    paymentMethod: "UPI",
    paymentStatus: "paid",
    subtotal: 2899,
    shipping: 299,
    total: 3198,
    address: {
      line1: "41, Sector 18",
      city: "Noida",
      state: "Uttar Pradesh",
      pincode: "201301",
    },
    lines: [
      { id: "p5", title: "Hawthorne Strainer", qty: 2, unitPrice: 899 },
      { id: "p6", title: "Citrus Peeler Pro", qty: 1, unitPrice: 1101 },
    ],
    timeline: buildTimeline("ordered", ts(3, 9, 30), {
      ordered: ts(3, 9, 30),
    }),
  },
  {
    id: "LMB-1037",
    createdAt: ts(3, 19, 0),
    customerId: "u2",
    customerName: "Neha Sharma",
    customerPhone: "9811122233",
    vendorId: "v-shake",
    vendorName: "ShakeCraft Tools",
    status: "ordered",
    statusLabel: "Ordered",
    trackingId: "LMBTRACK103706",
    courier: "Pending assign",
    expectedDelivery: "2026-08-17",
    paymentMethod: "Card",
    paymentStatus: "paid",
    subtotal: 5498,
    shipping: 0,
    total: 5498,
    address: {
      line1: "22, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
    },
    lines: [
      { id: "p3", title: "Boston Shaker Tin Set", qty: 2, unitPrice: 2199 },
      { id: "p7", title: "Bar Mat Black", qty: 1, unitPrice: 1100 },
    ],
    timeline: buildTimeline("ordered", ts(3, 19, 0), {
      ordered: ts(3, 19, 0),
    }),
  },
  {
    id: "LMB-1036",
    createdAt: ts(4, 12, 0),
    customerId: "u1",
    customerName: "Aarav Mehta",
    customerPhone: "9876543210",
    vendorId: "v-lmb",
    vendorName: "LMB Official Store",
    status: "shipped",
    statusLabel: "Shipped",
    trackingId: "LMBTRACK103607",
    courier: "Rocket Express",
    expectedDelivery: "2026-08-14",
    paymentMethod: "UPI",
    paymentStatus: "paid",
    subtotal: 6200,
    shipping: 0,
    total: 6200,
    address: {
      line1: "14, Golf Course Road",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122001",
    },
    lines: [
      { id: "p10", title: "Ice Mold Sphere Kit", qty: 2, unitPrice: 3100 },
    ],
    timeline: buildTimeline("shipped", ts(4, 12, 0), {
      ordered: ts(4, 12, 0),
      packed: ts(3, 15, 0),
      shipped: ts(2, 11, 0),
    }),
  },
  {
    id: "LMB-1035",
    createdAt: ts(5, 8, 0),
    customerId: "u3",
    customerName: "Rohan Kapoor",
    customerPhone: "9822334455",
    vendorId: "v-crystal",
    vendorName: "Crystal Pour Supplies",
    status: "cancelled",
    statusLabel: "Cancelled",
    trackingId: "LMBTRACK103508",
    courier: "—",
    expectedDelivery: "—",
    paymentMethod: "COD",
    paymentStatus: "pending",
    subtotal: 2199,
    shipping: 299,
    total: 2498,
    address: {
      line1: "88, Koramangala 5th Block",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560095",
    },
    lines: [
      { id: "p3", title: "Boston Shaker Tin Set", qty: 1, unitPrice: 2199 },
    ],
    timeline: buildTimeline("cancelled", ts(5, 8, 0), {
      cancelled: ts(4, 10, 0),
    }),
    note: "Customer cancelled before pack",
  },
];

export const SEED_BOOKINGS: AdminBooking[] = [
  {
    id: "BK-2201",
    createdAt: ts(0, 11, 0),
    serviceId: "s1",
    serviceTitle: "Luxury Wedding Bartending",
    partnerId: "v-lmb",
    partnerName: "LMB Bar Market",
    assignedTo: "lmb",
    assignedName: "LMB (self) — unassigned",
    customerId: "u1",
    customerName: "Aarav Mehta",
    customerPhone: "9876543210",
    eventDate: "2026-09-20",
    guests: 180,
    city: "Gurugram",
    venue: "The Leela Ambience",
    amount: 85000,
    status: "pending",
    message:
      "Reception evening bar — need signature bride & groom cocktails and glassware styling.",
  },
  {
    id: "BK-2200",
    createdAt: ts(1, 16, 30),
    serviceId: "s2",
    serviceTitle: "Corporate Cocktail Night",
    partnerId: "v-lmb",
    partnerName: "LMB Bar Market",
    assignedTo: "lmb",
    assignedName: "LMB (self) — unassigned",
    customerId: "u2",
    customerName: "Neha Sharma",
    customerPhone: "9811122233",
    eventDate: "2026-08-28",
    guests: 60,
    city: "Mumbai",
    venue: "BKC office terrace",
    amount: 42000,
    status: "info_requested",
    message: "Need mocktails-heavy menu and 2 bartenders for 4 hours.",
    adminNote: "Asked for floor plan and power access details",
  },
  {
    id: "BK-2199",
    createdAt: ts(2, 10, 0),
    serviceId: "s3",
    serviceTitle: "Private Party Bar Setup",
    partnerId: "v-lmb",
    partnerName: "LMB Bar Market",
    assignedTo: "lmb",
    assignedName: "LMB (self)",
    customerId: "u4",
    customerName: "Priya Nair",
    customerPhone: "9988776655",
    eventDate: "2026-08-22",
    guests: 40,
    city: "Hyderabad",
    venue: "Home — Jubilee Hills",
    amount: 28000,
    status: "confirmed",
    message: "Birthday — classic cocktails + beer station.",
  },
  {
    id: "BK-2198",
    createdAt: ts(4, 14, 0),
    serviceId: "s1",
    serviceTitle: "Luxury Wedding Bartending",
    partnerId: "v-lmb",
    partnerName: "LMB Bar Market",
    assignedTo: "lmb",
    assignedName: "LMB (self)",
    customerId: "u5",
    customerName: "Kabir Singh",
    customerPhone: "9700011223",
    eventDate: "2026-08-10",
    guests: 220,
    city: "Delhi",
    venue: "ITC Maurya",
    amount: 95000,
    status: "completed",
    message: "Sangeet + reception dual setup.",
  },
  {
    id: "BK-2197",
    createdAt: ts(3, 9, 0),
    serviceId: "s4",
    serviceTitle: "Mobile Bar Hire",
    partnerId: "v-lmb",
    partnerName: "LMB Bar Market",
    assignedTo: "lmb",
    assignedName: "LMB (self)",
    customerId: "u3",
    customerName: "Rohan Kapoor",
    customerPhone: "9822334455",
    eventDate: "2026-09-01",
    guests: 25,
    city: "Bengaluru",
    amount: 18000,
    status: "cancelled",
    message: "Rooftop party — cancelled due to rain forecast.",
    adminNote: "Customer cancelled; no deposit taken",
  },
  {
    id: "BK-2196",
    createdAt: ts(0, 8, 15),
    serviceId: "s2",
    serviceTitle: "Corporate Cocktail Night",
    partnerId: "v-lmb",
    partnerName: "LMB Bar Market",
    assignedTo: "lmb",
    assignedName: "LMB (self) — unassigned",
    customerId: "u2",
    customerName: "Neha Sharma",
    customerPhone: "9811122233",
    eventDate: "2026-09-05",
    guests: 90,
    city: "Mumbai",
    venue: "Hotel lobby bar takeover",
    amount: 55000,
    status: "pending",
    message: "Product launch afterparty — brand mocktails required.",
  },
];

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Pending",
  info_requested: "Info requested",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};
