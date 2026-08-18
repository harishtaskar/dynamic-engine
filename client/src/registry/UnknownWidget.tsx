interface UnknownWidgetProps {
  id: string;
  type: string;
  title?: string;
  [key: string]: unknown;
}

export function UnknownWidget({
  type,
}: UnknownWidgetProps) {
  return (
    <div className="h-full rounded-xl border border-dashed border-border bg-card p-5 text-fg">
      <div className="text-[13px] font-semibold">
        Unsupported Widget
      </div>

      <div className="mt-1 text-xs text-muted">
        Widget type "{type}" is not
        supported by this version.
      </div>
    </div>
  );
}
