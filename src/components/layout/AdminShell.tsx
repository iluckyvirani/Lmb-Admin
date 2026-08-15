import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { NAV_ITEMS } from "@/lib/nav";

export function AdminShell() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const current =
    NAV_ITEMS.find((i) => i.to === pathname)?.label ??
    NAV_ITEMS.find((i) => i.to !== "/" && pathname.startsWith(i.to))?.label ??
    "Dashboard";

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={current} onMenu={() => setOpen(true)} />
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
