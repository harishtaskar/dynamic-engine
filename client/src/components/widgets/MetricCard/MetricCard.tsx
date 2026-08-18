import type {
  DashboardWidget,
} from "../../../types/widget";

interface MetricCardProps {
  dashboardId: string;
  widget: DashboardWidget;
}

export function MetricCard({
  widget,
}: MetricCardProps) {
  if (widget.type !== "METRIC_CARD") {
    return null;
  }

  const {
    value,
    unit,
    trend,
    caption,
  } = widget.data;

  const display =
    typeof value === "number"
      ? value.toLocaleString()
      : value;

  const isDown =
    typeof trend === "string" &&
    trend.trim().startsWith("-");

  // The chip repeats the direction as a glyph so the trend never rests on
  // colour alone, and the sign is dropped because the arrow already carries it.
  const magnitude =
    trend?.replace(/^[+-]/, "") ?? "";

  return (
    <div className="min-w-0 rounded-xl border border-border bg-card px-5 py-[18px] text-fg transition-colors hover:border-elevated">
      <p className="truncate text-[10px] font-medium uppercase tracking-[0.08em] text-muted">
        {widget.title}
      </p>

      <p className="mt-1.5 min-w-0 truncate text-[26px] font-bold leading-none tracking-tight">
        {display}

        {unit && (
          <span className="ml-1 text-sm font-medium text-muted">
            {unit}
          </span>
        )}
      </p>

      <div className="mt-2 h-3.5">
        {trend ? (
          <span
            className={`flex items-center gap-1 text-[11px] font-semibold ${
              isDown ? "text-danger" : "text-success"
            }`}
          >
            <span aria-hidden="true">
              {isDown ? "▼" : "▲"}
            </span>

            {magnitude}
          </span>
        ) : (
          caption && (
            <span className="text-[11px] text-muted">
              {caption}
            </span>
          )
        )}
      </div>
    </div>
  );
}
