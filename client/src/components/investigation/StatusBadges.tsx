import {
  ChevronDown,
  CircleCheck,
  Database,
  ShieldCheck,
} from "lucide-react";

export function StatusBadges() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-[11px] font-semibold text-fg">
        <CircleCheck className="size-3.5 text-success" />
        High Confidence
      </span>

      <button
        type="button"
        className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-[11px] font-semibold text-fg transition hover:bg-elevated"
      >
        <Database className="size-3.5 text-muted" />
        Sourced from customers_db · 4 tables
        <ChevronDown className="size-3 text-muted" />
      </button>

      <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-[11px] font-semibold text-fg">
        <ShieldCheck className="size-3.5 text-muted" />
        Audit-logged
      </span>
    </div>
  );
}
