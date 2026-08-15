import { Menu, Search, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABEL } from "@/data/platform";

type Props = {
  title?: string;
  onMenu: () => void;
};

export function Topbar({ title = "Admin", onMenu }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials =
    user?.name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "AD";

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-background/95 px-4 backdrop-blur md:px-6">
      <button
        type="button"
        className="cursor-pointer p-2 text-muted hover:text-gold lg:hidden"
        onClick={onMenu}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-muted">{title}</p>
      </div>

      <label className="relative hidden max-w-xs flex-1 md:block">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          placeholder="Search orders, vendors…"
          className="w-full border border-white/10 bg-white/[0.04] py-2 pr-3 pl-9 text-sm outline-none placeholder:text-muted/60 focus:border-gold/50"
        />
      </label>

      <button
        type="button"
        className="cursor-pointer p-2 text-muted hover:text-gold"
        aria-label="Notifications"
        onClick={() => navigate("/notifications")}
      >
        <Bell className="h-5 w-5" />
      </button>

      <div className="hidden items-center gap-2 border-l border-white/10 pl-3 sm:flex">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-xs text-gold">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm text-foreground">
            {user?.name ?? "Admin"}
          </p>
          {user && (
            <p className="truncate text-[10px] tracking-wide text-muted uppercase">
              {ROLE_LABEL[user.role]}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        className="cursor-pointer p-2 text-muted hover:text-gold"
        aria-label="Logout"
        title="Sign out"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5" />
      </button>
    </header>
  );
}
