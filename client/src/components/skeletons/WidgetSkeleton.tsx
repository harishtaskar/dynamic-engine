export function WidgetSkeleton() {
  return (
    <div className="h-full animate-pulse rounded-xl border border-border bg-card p-5">
      <div className="h-3 w-24 rounded bg-elevated" />

      <div className="mt-4 h-7 w-20 rounded bg-elevated" />

      <div className="mt-4 h-3 w-14 rounded bg-elevated" />
    </div>
  );
}
