import { useMemo, useState } from "react";
import { usePlatform } from "@/context/PlatformContext";
import type { NotifChannel, NotifTemplate } from "@/data/platform";
import { cn } from "@/lib/cn";

type Tab = "templates" | "log";

const CHANNELS: NotifChannel[] = ["email", "whatsapp", "in_app"];

export function NotificationsPage() {
  const { templates, setTemplateChannel, updateTemplate, notifLog } =
    usePlatform();
  const [tab, setTab] = useState<Tab>("templates");
  const [editId, setEditId] = useState<string | null>(null);

  const editing = templates.find((t) => t.id === editId) ?? null;

  return (
    <>
      <div className="mb-6">
        <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
          Platform
        </p>
        <h1 className="mt-2 font-heading text-3xl text-white">
          Notifications
        </h1>
        <p className="mt-2 text-sm text-muted">
          Email / WhatsApp / in-app templates & send log
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["templates", "Templates"],
            ["log", "Send log"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "cursor-pointer border px-3 py-2 text-xs tracking-wide uppercase",
              tab === id
                ? "border-gold/50 text-gold"
                : "border-white/15 text-muted hover:border-white/30 hover:text-white",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "templates" && (
        <div className="space-y-3">
          {templates.map((t) => (
            <div
              key={t.id}
              className="border border-white/10 bg-background-secondary p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-heading text-xl text-white">{t.name}</h2>
                  <p className="mt-1 text-xs tracking-wide text-muted uppercase">
                    {t.key} · sent {t.sentCount}
                  </p>
                  <p className="mt-2 text-sm text-muted">{t.subject}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditId(t.id)}
                  className="cursor-pointer border border-white/15 px-3 py-2 text-[10px] tracking-wide uppercase hover:border-gold/40 hover:text-gold"
                >
                  Edit copy
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {CHANNELS.map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() =>
                      setTemplateChannel(t.id, ch, !t.channels[ch])
                    }
                    className={cn(
                      "cursor-pointer border px-2.5 py-1 text-[10px] tracking-wide uppercase",
                      t.channels[ch]
                        ? "border-gold/45 text-gold"
                        : "border-white/15 text-muted",
                    )}
                  >
                    {ch === "in_app" ? "In-app" : ch}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "log" && (
        <div className="overflow-x-auto border border-white/10 bg-background-secondary">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Template</th>
                <th className="px-4 py-3 font-medium">Channel</th>
                <th className="px-4 py-3 font-medium">To</th>
                <th className="px-4 py-3 font-medium">Ref</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {notifLog.map((n) => (
                <tr
                  key={n.id}
                  className="border-b border-white/5 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3 text-muted">
                    {new Date(n.at).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-white">{n.templateName}</td>
                  <td className="px-4 py-3 capitalize text-muted">
                    {n.channel.replace("_", "-")}
                  </td>
                  <td className="px-4 py-3 text-muted">{n.to}</td>
                  <td className="px-4 py-3">{n.refId}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "border px-2 py-0.5 text-[10px] tracking-wide uppercase",
                        n.status === "sent" &&
                          "border-emerald-500/40 text-emerald-400",
                        n.status === "queued" && "border-gold/40 text-gold",
                        n.status === "failed" &&
                          "border-red-500/40 text-red-400",
                      )}
                    >
                      {n.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <EditTemplateModal
          key={editing.id}
          template={editing}
          onClose={() => setEditId(null)}
          onSave={(patch) => {
            updateTemplate(editing.id, patch);
            setEditId(null);
          }}
        />
      )}
    </>
  );
}

function EditTemplateModal({
  template,
  onClose,
  onSave,
}: {
  template: NotifTemplate;
  onClose: () => void;
  onSave: (patch: Partial<NotifTemplate>) => void;
}) {
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.body);

  const vars = useMemo(
    () => ["{{name}}", "{{order_id}}", "{{booking_id}}", "{{total}}", "{{eta}}"],
    [],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg border border-white/10 bg-background-secondary p-5 shadow-2xl">
        <p className="text-[11px] tracking-[0.2em] text-gold uppercase">
          Edit template
        </p>
        <h2 className="mt-1 font-heading text-2xl text-white">
          {template.name}
        </h2>
        <p className="mt-2 text-xs text-muted">Vars: {vars.join(" · ")}</p>
        <div className="mt-4 grid gap-3 text-sm">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border border-white/10 bg-white/[0.04] px-3 py-2 outline-none focus:border-gold/50"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            className="border border-white/10 bg-white/[0.04] px-3 py-2 outline-none focus:border-gold/50"
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => onSave({ subject, body })}
            className="cursor-pointer bg-gold px-4 py-2 text-xs font-medium tracking-wide text-background uppercase hover:bg-gold-accent"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer border border-white/15 px-4 py-2 text-xs tracking-wide uppercase hover:border-gold/40"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
