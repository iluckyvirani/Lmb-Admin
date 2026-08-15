import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function LoadingBlock({
  label = "Loading…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-muted",
        className,
      )}
    >
      <Loader2 className="h-6 w-6 animate-spin text-gold" />
      <p className="text-sm tracking-wide uppercase">{label}</p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-white/15 bg-background-secondary/50 px-6 py-16 text-center">
      <Inbox className="h-8 w-8 text-muted" />
      <h3 className="mt-4 font-heading text-xl text-white">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
      <span className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 shrink-0" />
        {message}
      </span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer border border-red-400/40 px-3 py-1 text-xs tracking-wide uppercase hover:bg-red-500/20"
        >
          Retry
        </button>
      )}
    </div>
  );
}
