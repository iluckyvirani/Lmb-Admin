/** Mock data for admin MVP — replace with API later */

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export type DashboardKpis = {
  revenueToday: number;
  revenueWeek: number;
  revenueMonth: number;
  ordersCount: number;
  upcomingShipments: number;
  bookingsCount: number;
  pendingBookings: number;
  vendorsCount: number;
  pendingVendors: number;
  customersCount: number;
};

export const DASHBOARD_KPIS: DashboardKpis = {
  revenueToday: 42800,
  revenueWeek: 286500,
  revenueMonth: 1240800,
  ordersCount: 128,
  upcomingShipments: 12,
  bookingsCount: 34,
  pendingBookings: 8,
  vendorsCount: 18,
  pendingVendors: 3,
  customersCount: 892,
};

/** Last 7 days revenue for mini chart */
export const WEEKLY_REVENUE = [
  { day: "Fri", amount: 32000 },
  { day: "Sat", amount: 48000 },
  { day: "Sun", amount: 41000 },
  { day: "Mon", amount: 28000 },
  { day: "Tue", amount: 35500 },
  { day: "Wed", amount: 39000 },
  { day: "Thu", amount: 42800 },
];

export type MockOrder = {
  id: string;
  customer: string;
  total: number;
  status: string;
  items: number;
  createdAt: string;
  vendor: string;
};

export const RECENT_ORDERS: MockOrder[] = [
  {
    id: "LMB-1042",
    customer: "Aarav Mehta",
    total: 7647,
    status: "Out for delivery",
    items: 2,
    createdAt: "2026-08-12T18:20:00",
    vendor: "Crystal Pour Supplies",
  },
  {
    id: "LMB-1041",
    customer: "Neha Sharma",
    total: 14999,
    status: "Packed",
    items: 1,
    createdAt: "2026-08-12T14:05:00",
    vendor: "LMB Official Store",
  },
  {
    id: "LMB-1040",
    customer: "Rohan Kapoor",
    total: 4298,
    status: "Shipped",
    items: 3,
    createdAt: "2026-08-11T21:40:00",
    vendor: "ShakeCraft Tools",
  },
  {
    id: "LMB-1039",
    customer: "Priya Nair",
    total: 8999,
    status: "Delivered",
    items: 1,
    createdAt: "2026-08-11T11:15:00",
    vendor: "LMB Official Store",
  },
  {
    id: "LMB-1038",
    customer: "Kabir Singh",
    total: 3198,
    status: "Ordered",
    items: 2,
    createdAt: "2026-08-13T09:02:00",
    vendor: "Crystal Pour Supplies",
  },
];

export type MockBooking = {
  id: string;
  service: string;
  customer: string;
  partner: string;
  eventDate: string;
  priceFrom: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  guests: number;
};

export const RECENT_BOOKINGS: MockBooking[] = [
  {
    id: "BK-220",
    service: "Luxury Wedding Bartending",
    customer: "Ananya & Vikram",
    partner: "Event Pour Co.",
    eventDate: "2026-09-14",
    priceFrom: 45000,
    status: "Pending",
    guests: 180,
  },
  {
    id: "BK-219",
    service: "DJ + Bar Combo",
    customer: "Meera Joshi",
    partner: "LMB Official Store",
    eventDate: "2026-08-28",
    priceFrom: 42000,
    status: "Confirmed",
    guests: 90,
  },
  {
    id: "BK-218",
    service: "Kitty Party Bar Service",
    customer: "Sana Khan",
    partner: "Event Pour Co.",
    eventDate: "2026-08-20",
    priceFrom: 12000,
    status: "Pending",
    guests: 25,
  },
  {
    id: "BK-217",
    service: "Molecular Bar Setup",
    customer: "TechCorp Launch",
    partner: "LMB Official Store",
    eventDate: "2026-09-02",
    priceFrom: 65000,
    status: "Confirmed",
    guests: 120,
  },
];

export type LowStockItem = {
  id: string;
  title: string;
  vendor: string;
  stock: number;
  sku: string;
};

export const LOW_STOCK: LowStockItem[] = [
  {
    id: "p-smoke-gun",
    title: "Handheld Smoke Infuser",
    vendor: "LMB Official Store",
    stock: 3,
    sku: "MOL-INF-01",
  },
  {
    id: "p-ultimate-pro",
    title: "Ultimate Bar Kit Pro",
    vendor: "LMB Official Store",
    stock: 5,
    sku: "KIT-PRO-24",
  },
  {
    id: "p-martini",
    title: "Martini Glass Pair",
    vendor: "Crystal Pour Supplies",
    stock: 4,
    sku: "GLS-MRT-02",
  },
  {
    id: "p-nitrogen",
    title: "Nitrogen Gloves Kit",
    vendor: "LMB Official Store",
    stock: 2,
    sku: "MOL-NIT-01",
  },
];

export type ActivityItem = {
  id: string;
  text: string;
  time: string;
  tone: "gold" | "muted" | "alert";
};

export const ACTIVITY_FEED: ActivityItem[] = [
  {
    id: "a1",
    text: "New vendor application — PourHouse Delhi",
    time: "12 min ago",
    tone: "gold",
  },
  {
    id: "a2",
    text: "Booking BK-220 awaiting partner confirmation",
    time: "34 min ago",
    tone: "alert",
  },
  {
    id: "a3",
    text: "Order LMB-1042 out for delivery (Rocket)",
    time: "1 hr ago",
    tone: "muted",
  },
  {
    id: "a4",
    text: "Payment ₹14,999 captured for LMB-1041",
    time: "2 hr ago",
    tone: "muted",
  },
  {
    id: "a5",
    text: "Low stock: Nitrogen Gloves Kit (2 left)",
    time: "3 hr ago",
    tone: "alert",
  },
];
