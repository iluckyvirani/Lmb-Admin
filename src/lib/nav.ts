import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ConciergeBell,
  FolderTree,
  ShoppingBag,
  Truck,
  CalendarCheck,
  CreditCard,
  Rocket,
  TicketPercent,
  Image,
  Star,
  Headphones,
  BarChart3,
  Bell,
  Settings,
  Shield,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  group: "overview" | "catalog" | "people" | "ops" | "growth" | "platform";
};

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, group: "overview" },
  { to: "/products", label: "Products", icon: Package, group: "catalog" },
  { to: "/services", label: "Services", icon: ConciergeBell, group: "catalog" },
  { to: "/categories", label: "Categories", icon: FolderTree, group: "catalog" },
  { to: "/users", label: "Users", icon: Users, group: "people" },
  { to: "/vendors", label: "Product vendors", icon: Store, group: "people" },
  {
    to: "/service-partners",
    label: "Service partners",
    icon: ConciergeBell,
    group: "people",
  },
  { to: "/orders", label: "Orders", icon: ShoppingBag, group: "ops" },
  { to: "/orders/upcoming", label: "Upcoming orders", icon: Truck, group: "ops" },
  { to: "/bookings", label: "Bookings", icon: CalendarCheck, group: "ops" },
  { to: "/payments", label: "Payments", icon: CreditCard, group: "ops" },
  { to: "/shipping", label: "Shipping / Rocket", icon: Rocket, group: "ops" },
  { to: "/coupons", label: "Coupons", icon: TicketPercent, group: "growth" },
  { to: "/banners", label: "Banners", icon: Image, group: "growth" },
  { to: "/reviews", label: "Reviews", icon: Star, group: "growth" },
  { to: "/support", label: "Support", icon: Headphones, group: "platform" },
  { to: "/reports", label: "Reports", icon: BarChart3, group: "platform" },
  { to: "/notifications", label: "Notifications", icon: Bell, group: "platform" },
  { to: "/settings", label: "Settings", icon: Settings, group: "platform" },
  { to: "/admins", label: "Admin roles", icon: Shield, group: "platform" },
];

export const NAV_GROUPS: { id: NavItem["group"]; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "catalog", label: "Catalog" },
  { id: "people", label: "People" },
  { id: "ops", label: "Operations" },
  { id: "growth", label: "Growth" },
  { id: "platform", label: "Platform" },
];
