import { useEffect, useState, type ReactNode } from "react";
import { usePlatform } from "@/context/PlatformContext";
import type { StoreSettings } from "@/data/platform";
import { cn } from "@/lib/cn";

export function SettingsPage() {
  const { settings, updateSettings } = usePlatform();
  const [draft, setDraft] = useState<StoreSettings>(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  function patch<K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setSaved(false);
  }

  function save() {
    updateSettings(draft);
    setSaved(true);
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.25em] text-gold uppercase">
            Platform
          </p>
          <h1 className="mt-2 font-heading text-3xl text-white">Settings</h1>
          <p className="mt-2 text-sm text-muted">
            Brand, taxes, COD, OTP, delivery, and product commission
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          className="cursor-pointer bg-gold px-4 py-2 text-xs font-medium tracking-wide text-background uppercase hover:bg-gold-accent"
        >
          {saved ? "Saved" : "Save settings"}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Brand & contact">
          <Field label="Store name">
            <input
              value={draft.storeName}
              onChange={(e) => patch("storeName", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Tagline">
            <input
              value={draft.tagline}
              onChange={(e) => patch("tagline", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Support email">
            <input
              value={draft.supportEmail}
              onChange={(e) => patch("supportEmail", e.target.value)}
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone">
              <input
                value={draft.supportPhone}
                onChange={(e) => patch("supportPhone", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="WhatsApp">
              <input
                value={draft.whatsapp}
                onChange={(e) => patch("whatsapp", e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
        </Section>

        <Section title="GST / tax / COD">
          <Field label="GSTIN">
            <input
              value={draft.gstin}
              onChange={(e) => patch("gstin", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Tax %">
            <input
              type="number"
              min={0}
              value={draft.taxPercent}
              onChange={(e) =>
                patch("taxPercent", Number(e.target.value) || 0)
              }
              className={inputCls}
            />
          </Field>
          <label className="flex cursor-pointer items-center gap-3 text-sm text-white">
            <input
              type="checkbox"
              checked={draft.codEnabled}
              onChange={(e) => patch("codEnabled", e.target.checked)}
              className="accent-gold"
            />
            Enable COD
          </label>
          <Field label="COD max amount (₹)">
            <input
              type="number"
              min={0}
              disabled={!draft.codEnabled}
              value={draft.codMaxAmount}
              onChange={(e) =>
                patch("codMaxAmount", Number(e.target.value) || 0)
              }
              className={cn(inputCls, !draft.codEnabled && "opacity-40")}
            />
          </Field>
        </Section>

        <Section title="OTP (demo)">
          <label className="flex cursor-pointer items-center gap-3 text-sm text-white">
            <input
              type="checkbox"
              checked={draft.otpDemoMode}
              onChange={(e) => patch("otpDemoMode", e.target.checked)}
              className="accent-gold"
            />
            Demo OTP mode (fixed code)
          </label>
          <Field label="Fixed OTP code">
            <input
              value={draft.otpFixedCode}
              onChange={(e) => patch("otpFixedCode", e.target.value)}
              disabled={!draft.otpDemoMode}
              className={cn(inputCls, !draft.otpDemoMode && "opacity-40")}
            />
          </Field>
          <p className="text-xs text-muted">
            Matches storefront checkout login when demo mode is on.
          </p>
        </Section>

        <Section title="Product commission">
          <Field label="Commission on all products (%)">
            <input
              type="number"
              min={0}
              max={50}
              step={0.5}
              value={draft.productCommissionPercent}
              onChange={(e) =>
                patch(
                  "productCommissionPercent",
                  Number(e.target.value) || 0,
                )
              }
              className={inputCls}
            />
          </Field>
          <p className="text-xs text-muted">
            Applied globally at checkout as LMB platform fee on product
            subtotal (all vendors). Current:{" "}
            {draft.productCommissionPercent}% — e.g. ₹10,000 cart → ₹
            {Math.round((10000 * draft.productCommissionPercent) / 100)} fee.
          </p>
        </Section>

        <Section title="Delivery defaults">
          <div className="grid grid-cols-2 gap-3">
            <Field label="ETA min (days)">
              <input
                type="number"
                min={1}
                value={draft.defaultDeliveryDaysMin}
                onChange={(e) =>
                  patch(
                    "defaultDeliveryDaysMin",
                    Number(e.target.value) || 1,
                  )
                }
                className={inputCls}
              />
            </Field>
            <Field label="ETA max (days)">
              <input
                type="number"
                min={1}
                value={draft.defaultDeliveryDaysMax}
                onChange={(e) =>
                  patch(
                    "defaultDeliveryDaysMax",
                    Number(e.target.value) || 1,
                  )
                }
                className={inputCls}
              />
            </Field>
          </div>
          <Field label="Metro pincode prefixes (comma-separated)">
            <input
              value={draft.metroPincodePrefixes}
              onChange={(e) =>
                patch("metroPincodePrefixes", e.target.value)
              }
              className={inputCls}
            />
          </Field>
        </Section>
      </div>
    </>
  );
}

const inputCls =
  "mt-1 w-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-gold/50";

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3 border border-white/10 bg-background-secondary p-5">
      <h2 className="text-xs tracking-wide text-muted uppercase">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-xs text-muted">
      {label}
      {children}
    </label>
  );
}
