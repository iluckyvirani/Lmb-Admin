import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { usePeople } from "@/context/PeopleContext";
import { formatPhone, type UserStatus } from "@/data/people";
import { EmptyState } from "@/components/ui/States";
import { cn } from "@/lib/cn";

export function UsersPage() {
  const navigate = useNavigate();
  const { users, setUserStatus } = usePeople();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | UserStatus>("all");

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (status !== "all" && u.status !== status) return false;
      if (!q.trim()) return true;
      const hay = `${u.name} ${u.phone} ${u.email}`.toLowerCase();
      return hay.includes(q.trim().toLowerCase());
    });
  }, [users, q, status]);

  return (
    <>
      <div className="mb-6">
        <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
          People
        </p>
        <h1 className="mt-2 font-heading text-3xl text-white">Users</h1>
        <p className="mt-2 text-sm text-muted">
          {filtered.length} of {users.length} customers · open a profile for
          orders, addresses, wishlist, payments & service enquiries
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <label className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, phone, email…"
            className="w-full border border-white/10 bg-white/[0.04] py-2 pr-3 pl-9 text-sm outline-none focus:border-gold/50"
          />
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="cursor-pointer border border-white/10 bg-background-secondary px-3 py-2 text-sm outline-none focus:border-gold/50"
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No users match"
          description="Try another search or status filter."
        />
      ) : (
        <div className="overflow-x-auto border border-white/10 bg-background-secondary">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Orders</th>
                <th className="px-4 py-3 font-medium">Bookings</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-white/5 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="cursor-pointer text-left"
                      onClick={() => navigate(`/users/${u.id}`)}
                    >
                      <span className="block text-white hover:text-gold">
                        {u.name}
                      </span>
                      <span className="text-xs text-muted">{u.email}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {formatPhone(u.phone)}
                  </td>
                  <td className="px-4 py-3">{u.ordersCount}</td>
                  <td className="px-4 py-3">{u.bookingsCount}</td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(u.joinDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "border px-2 py-0.5 text-[10px] tracking-wide uppercase",
                        u.status === "active"
                          ? "border-emerald-500/40 text-emerald-400"
                          : "border-red-400/40 text-red-400",
                      )}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/users/${u.id}`}
                        className="text-gold hover:text-gold-accent"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        className="cursor-pointer text-muted hover:text-foreground"
                        onClick={() =>
                          setUserStatus(
                            u.id,
                            u.status === "active" ? "blocked" : "active",
                          )
                        }
                      >
                        {u.status === "active" ? "Block" : "Unblock"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
