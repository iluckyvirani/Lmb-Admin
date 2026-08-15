import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { NAV_GROUPS, NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/cn";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ open, onClose }: Props) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-background-secondary transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div>
            <p className="font-heading text-lg text-white">LMB Admin</p>
            <p className="text-[10px] tracking-[0.2em] text-gold uppercase">
              Bar Market
            </p>
          </div>
          <button
            type="button"
            className="cursor-pointer p-1 text-muted hover:text-gold lg:hidden"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group) => {
            const items = NAV_ITEMS.filter((i) => i.group === group.id);
            if (!items.length) return null;
            return (
              <div key={group.id} className="mb-5">
                <p className="mb-2 px-2 text-[10px] tracking-[0.2em] text-muted uppercase">
                  {group.label}
                </p>
                <ul className="space-y-0.5">
                  {items.map(({ to, label, icon: Icon }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        end={to === "/" || to === "/orders"}
                        onClick={onClose}
                        className={({ isActive }) =>
                          cn(
                            "flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                            isActive
                              ? "bg-gold/10 text-gold"
                              : "text-muted hover:bg-white/[0.04] hover:text-foreground",
                          )
                        }
                      >
                        <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                        {label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
