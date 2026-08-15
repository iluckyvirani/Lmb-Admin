/** Platform mock — settings, notifications, support, reports, admins */

export type StoreSettings = {
  storeName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  whatsapp: string;
  gstin: string;
  taxPercent: number;
  codEnabled: boolean;
  codMaxAmount: number;
  otpDemoMode: boolean;
  otpFixedCode: string;
  defaultDeliveryDaysMin: number;
  defaultDeliveryDaysMax: number;
  metroPincodePrefixes: string;
  /** Global marketplace commission on product subtotal (%) */
  productCommissionPercent: number;
};

export type NotifChannel = "email" | "whatsapp" | "in_app";

export type NotifTemplate = {
  id: string;
  key: string;
  name: string;
  subject: string;
  body: string;
  channels: Record<NotifChannel, boolean>;
  lastSentAt?: string;
  sentCount: number;
};

export type NotifLog = {
  id: string;
  templateId: string;
  templateName: string;
  channel: NotifChannel;
  to: string;
  refId: string;
  status: "sent" | "failed" | "queued";
  at: string;
};

export type TicketStatus = "open" | "pending" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high";

export type SupportTicket = {
  id: string;
  subject: string;
  customerName: string;
  customerPhone: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignee?: string;
  linkedOrderId?: string;
  linkedBookingId?: string;
  createdAt: string;
  updatedAt: string;
  message: string;
  channel: "email" | "whatsapp" | "in_app";
};

export type AdminRole = "super_admin" | "ops" | "support" | "finance";

export type StaffAdmin = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  active: boolean;
  lastActiveAt: string;
};

export type SalesByCategory = {
  category: string;
  revenue: number;
  orders: number;
};

export type TopVendorRow = {
  vendorName: string;
  revenue: number;
  orders: number;
  rating: number;
};

export type BookingConversion = {
  enquiries: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  conversionRate: number;
};

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const SEED_SETTINGS: StoreSettings = {
  storeName: "LMB Bar Market",
  tagline: "Premium bar equipment & event services",
  supportEmail: "care@lmb.demo",
  supportPhone: "9582810267",
  whatsapp: "919582810267",
  gstin: "07AABCL1234A1Z5",
  taxPercent: 18,
  codEnabled: true,
  codMaxAmount: 15000,
  otpDemoMode: true,
  otpFixedCode: "123456",
  defaultDeliveryDaysMin: 2,
  defaultDeliveryDaysMax: 5,
  metroPincodePrefixes: "11,12,40,56,50",
  productCommissionPercent: 10,
};

export const SEED_TEMPLATES: NotifTemplate[] = [
  {
    id: "nt1",
    key: "order_placed",
    name: "Order placed",
    subject: "Your LMB order {{order_id}} is confirmed",
    body: "Hi {{name}}, we received your order {{order_id}} for {{total}}. Track it anytime in My Orders.",
    channels: { email: true, whatsapp: true, in_app: true },
    lastSentAt: "2026-08-12T18:22:00",
    sentCount: 412,
  },
  {
    id: "nt2",
    key: "order_shipped",
    name: "Order shipped",
    subject: "Shipped via {{courier}} — {{tracking_id}}",
    body: "Good news {{name}} — {{order_id}} is on the way. ETA {{eta}}.",
    channels: { email: true, whatsapp: true, in_app: true },
    lastSentAt: "2026-08-12T16:05:00",
    sentCount: 288,
  },
  {
    id: "nt3",
    key: "booking_enquiry",
    name: "Booking enquiry received",
    subject: "We got your {{service}} enquiry",
    body: "Thanks {{name}}. Our partner will review {{service}} for {{event_date}}. Ref {{booking_id}}.",
    channels: { email: true, whatsapp: true, in_app: false },
    lastSentAt: "2026-08-13T11:05:00",
    sentCount: 96,
  },
  {
    id: "nt4",
    key: "booking_confirmed",
    name: "Booking confirmed",
    subject: "Confirmed — {{service}} on {{event_date}}",
    body: "{{partner}} is confirmed for your event. Guests: {{guests}}. Ref {{booking_id}}.",
    channels: { email: true, whatsapp: true, in_app: true },
    lastSentAt: "2026-08-11T10:00:00",
    sentCount: 54,
  },
  {
    id: "nt5",
    key: "out_for_delivery",
    name: "Out for delivery",
    subject: "{{order_id}} is out for delivery",
    body: "Your package is with the rider. Keep phone handy for OTP / delivery call.",
    channels: { email: false, whatsapp: true, in_app: true },
    lastSentAt: "2026-08-13T10:30:00",
    sentCount: 190,
  },
];

export const SEED_NOTIF_LOG: NotifLog[] = [
  {
    id: "nl1",
    templateId: "nt1",
    templateName: "Order placed",
    channel: "whatsapp",
    to: "+91 98765 43210",
    refId: "LMB-1042",
    status: "sent",
    at: "2026-08-12T18:22:00",
  },
  {
    id: "nl2",
    templateId: "nt2",
    templateName: "Order shipped",
    channel: "email",
    to: "neha@example.com",
    refId: "LMB-1040",
    status: "sent",
    at: "2026-08-12T16:05:00",
  },
  {
    id: "nl3",
    templateId: "nt3",
    templateName: "Booking enquiry received",
    channel: "whatsapp",
    to: "+91 98765 43210",
    refId: "BK-2201",
    status: "sent",
    at: "2026-08-13T11:05:00",
  },
  {
    id: "nl4",
    templateId: "nt5",
    templateName: "Out for delivery",
    channel: "whatsapp",
    to: "+91 98765 43210",
    refId: "LMB-1042",
    status: "queued",
    at: "2026-08-13T10:30:00",
  },
  {
    id: "nl5",
    templateId: "nt1",
    templateName: "Order placed",
    channel: "email",
    to: "rohan@example.com",
    refId: "LMB-1037",
    status: "failed",
    at: "2026-08-11T19:10:00",
  },
];

export const SEED_TICKETS: SupportTicket[] = [
  {
    id: "TK-501",
    subject: "Delayed shipment LMB-1040",
    customerName: "Rohan Kapoor",
    customerPhone: "9900011223",
    status: "open",
    priority: "high",
    assignee: "Meera Ops",
    linkedOrderId: "LMB-1040",
    createdAt: "2026-08-13T08:20:00",
    updatedAt: "2026-08-13T09:00:00",
    message: "Tracking shows shipped but no movement since yesterday.",
    channel: "whatsapp",
  },
  {
    id: "TK-500",
    subject: "Wedding bar menu change",
    customerName: "Aarav Mehta",
    customerPhone: "9876543210",
    status: "pending",
    priority: "medium",
    assignee: "Support Riya",
    linkedBookingId: "BK-2201",
    createdAt: "2026-08-12T15:40:00",
    updatedAt: "2026-08-13T07:10:00",
    message: "Need mocktail-heavy menu for half the guests.",
    channel: "email",
  },
  {
    id: "TK-499",
    subject: "COD amount mismatch",
    customerName: "Priya Nair",
    customerPhone: "9777788899",
    status: "open",
    priority: "medium",
    linkedOrderId: "LMB-1039",
    createdAt: "2026-08-12T12:00:00",
    updatedAt: "2026-08-12T12:00:00",
    message: "Rider asked for more than order total.",
    channel: "in_app",
  },
  {
    id: "TK-498",
    subject: "Damaged glassware",
    customerName: "Neha Sharma",
    customerPhone: "9811122233",
    status: "resolved",
    priority: "high",
    assignee: "Support Riya",
    linkedOrderId: "LMB-1041",
    createdAt: "2026-08-10T11:00:00",
    updatedAt: "2026-08-11T16:30:00",
    message: "One coupe cracked. Replacement offered.",
    channel: "email",
  },
  {
    id: "TK-497",
    subject: "OTP not received",
    customerName: "Kabir Singh",
    customerPhone: "9123456780",
    status: "closed",
    priority: "low",
    assignee: "Meera Ops",
    createdAt: "2026-08-09T09:15:00",
    updatedAt: "2026-08-09T10:00:00",
    message: "Login OTP delayed — demo mode fixed code works.",
    channel: "whatsapp",
  },
];

export const SEED_STAFF: StaffAdmin[] = [
  {
    id: "a1",
    name: "Anika Shah",
    email: "anika@lmb.demo",
    role: "super_admin",
    active: true,
    lastActiveAt: "2026-08-13T11:50:00",
  },
  {
    id: "a2",
    name: "Meera Ops",
    email: "meera@lmb.demo",
    role: "ops",
    active: true,
    lastActiveAt: "2026-08-13T11:20:00",
  },
  {
    id: "a3",
    name: "Support Riya",
    email: "riya@lmb.demo",
    role: "support",
    active: true,
    lastActiveAt: "2026-08-13T10:05:00",
  },
  {
    id: "a4",
    name: "Finance Kabir",
    email: "finance@lmb.demo",
    role: "finance",
    active: true,
    lastActiveAt: "2026-08-12T18:00:00",
  },
  {
    id: "a5",
    name: "Ex-Ops Dev",
    email: "exops@lmb.demo",
    role: "ops",
    active: false,
    lastActiveAt: "2026-06-01T12:00:00",
  },
];

export const ROLE_LABEL: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  ops: "Ops",
  support: "Support",
  finance: "Finance",
};

export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  super_admin: [
    "Full access",
    "Manage staff & roles",
    "Settings & payouts",
    "Catalog, orders, bookings",
  ],
  ops: [
    "Orders & shipments",
    "Bookings confirm",
    "Catalog publish",
    "Shipping / Rocket",
  ],
  support: [
    "Support tickets",
    "Users view / block",
    "Reviews moderate",
    "Order notes",
  ],
  finance: [
    "Payments & refunds",
    "Vendor payouts",
    "Reports export",
    "COD reconciliation",
  ],
};

export const SALES_BY_CATEGORY: SalesByCategory[] = [
  { category: "Ultimate kits", revenue: 428000, orders: 52 },
  { category: "Glassware", revenue: 186500, orders: 94 },
  { category: "Molecular tools", revenue: 152200, orders: 41 },
  { category: "Mixing tools", revenue: 98500, orders: 77 },
  { category: "Wedding services", revenue: 612000, orders: 18 },
  { category: "Corporate / DJ", revenue: 244000, orders: 22 },
];

export const TOP_VENDORS: TopVendorRow[] = [
  { vendorName: "LMB Official Store", revenue: 512000, orders: 128, rating: 4.9 },
  { vendorName: "Event Pour Co.", revenue: 398000, orders: 34, rating: 4.8 },
  { vendorName: "Crystal Pour Supplies", revenue: 186000, orders: 67, rating: 4.7 },
  { vendorName: "ShakeCraft Tools", revenue: 94000, orders: 41, rating: 4.6 },
];

export const BOOKING_CONVERSION: BookingConversion = {
  enquiries: 48,
  confirmed: 29,
  completed: 18,
  cancelled: 7,
  conversionRate: 60.4,
};

export const TICKET_STATUS_LABEL: Record<TicketStatus, string> = {
  open: "Open",
  pending: "Pending",
  resolved: "Resolved",
  closed: "Closed",
};
