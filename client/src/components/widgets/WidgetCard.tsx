import type { ReactNode } from "react";

import {
  CircleCheck,
  MoreVertical,
} from "lucide-react";

import clsx from "clsx";

interface WidgetCardProps {
  className?: string;
  children: ReactNode;
}

export function WidgetCard({
  className,
  children,
}: WidgetCardProps) {
  return (
    <div
      className={clsx(
        "flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card text-fg",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface WidgetCardHeaderProps {
  title: string;
  action?: ReactNode;
}

export function WidgetCardHeader({
  title,
  action,
}: WidgetCardHeaderProps) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-3 px-5 pt-5 pb-1">
      <h2 className="min-w-0 truncate text-[13px] font-semibold">
        {title}
      </h2>

      <div className="flex shrink-0 items-center gap-2">
        {action}

        <CircleCheck
          aria-hidden="true"
          className="size-4 text-success"
        />

        <button
          type="button"
          aria-label={`Options for ${title}`}
          className="flex size-5 items-center justify-center rounded text-muted transition hover:text-fg"
        >
          <MoreVertical className="size-4" />
        </button>
      </div>
    </div>
  );
}
