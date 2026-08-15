import { useState } from "react";
import { Plus, X } from "lucide-react";
import { usePlatform } from "@/context/PlatformContext";
import {
  ROLE_LABEL,
  ROLE_PERMISSIONS,
  type AdminRole,
} from "@/data/platform";
import { cn } from "@/lib/cn";

const ROLES = Object.keys(ROLE_LABEL) as AdminRole[];

export function AdminsPage() {
  const { staff, setStaffRole, setStaffActive, inviteStaff } = usePlatform();
  const [showInvite, setShowInvite] = useState(false);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
            Platform
          </p>
          <h1 className="mt-2 font-heading text-3xl text-white">
            Admin roles
          </h1>
          <p className="mt-2 text-sm text-muted">
            Super Admin / Ops / Support / Finance · permission matrix
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowInvite(true)}
          className="inline-flex cursor-pointer items-center gap-2 bg-gold px-3 py-2 text-xs font-medium tracking-wide text-background uppercase hover:bg-gold-accent"
        >
          <Plus className="h-3.5 w-3.5" />
          Invite staff
        </button>
      </div>

      <section className="mb-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {ROLES.map((role) => (
          <div
            key={role}
            className="border border-white/10 bg-background-secondary p-4"
          >
            <h2 className="font-heading text-lg text-gold">
              {ROLE_LABEL[role]}
            </h2>
            <ul className="mt-3 space-y-1.5 text-xs text-muted">
              {ROLE_PERMISSIONS[role].map((p) => (
                <li key={p}>· {p}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <div className="overflow-x-auto border border-white/10 bg-background-secondary">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Staff</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Last active</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr
                key={s.id}
                className="border-b border-white/5 hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3">
                  <span className="block text-white">{s.name}</span>
                  <span className="text-xs text-muted">{s.email}</span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={s.role}
                    onChange={(e) =>
                      setStaffRole(s.id, e.target.value as AdminRole)
                    }
                    disabled={s.role === "super_admin" && s.id === "a1"}
                    className="cursor-pointer border border-white/10 bg-background px-2 py-1.5 text-sm outline-none focus:border-gold/50 disabled:opacity-50"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABEL[r]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-muted">
                  {new Date(s.lastActiveAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "border px-2 py-0.5 text-[10px] tracking-wide uppercase",
                      s.active
                        ? "border-emerald-500/40 text-emerald-400"
                        : "border-white/20 text-muted",
                    )}
                  >
                    {s.active ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {s.id !== "a1" && (
                    <button
                      type="button"
                      onClick={() => setStaffActive(s.id, !s.active)}
                      className={cn(
                        "cursor-pointer border px-2 py-1 text-[10px] tracking-wide uppercase",
                        s.active
                          ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                          : "border-emerald-500/35 text-emerald-400 hover:bg-emerald-500/10",
                      )}
                    >
                      {s.active ? "Disable" : "Enable"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showInvite && (
        <InviteModal
          onClose={() => setShowInvite(false)}
          onInvite={(input) => {
            inviteStaff(input);
            setShowInvite(false);
          }}
        />
      )}
    </>
  );
}

function InviteModal({
  onClose,
  onInvite,
}: {
  onClose: () => void;
  onInvite: (input: {
    name: string;
    email: string;
    role: AdminRole;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole>("support");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md border border-white/10 bg-background-secondary p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-[11px] tracking-[0.2em] text-gold uppercase">
              Invite
            </p>
            <h2 className="mt-1 font-heading text-2xl text-white">
              Add staff
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-1 text-muted hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-3 text-sm">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="border border-white/10 bg-white/[0.04] px-3 py-2 outline-none focus:border-gold/50"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@lmb.demo"
            className="border border-white/10 bg-white/[0.04] px-3 py-2 outline-none focus:border-gold/50"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
            className="cursor-pointer border border-white/10 bg-background px-3 py-2 outline-none focus:border-gold/50"
          >
            {ROLES.filter((r) => r !== "super_admin").map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          disabled={!name.trim() || !email.trim()}
          onClick={() => onInvite({ name, email, role })}
          className="mt-4 w-full cursor-pointer bg-gold py-2.5 text-xs font-medium tracking-wide text-background uppercase hover:bg-gold-accent disabled:opacity-40"
        >
          Send invite
        </button>
      </div>
    </div>
  );
}
