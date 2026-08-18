import {
  ChevronDown,
  Globe,
  MoreHorizontal,
  PanelRight,
  Share,
} from "lucide-react";

import { ThemeToggle } from "../theme/ThemeToggle";

import {
  useDashboardStore,
} from "../../stores/dashboard.store";

import { useUiStore } from "../../stores/ui.store";

const pillClass =
  "flex h-8 items-center gap-1.5 rounded-full bg-elevated px-3 text-xs font-semibold text-fg transition hover:brightness-125";

const iconButtonClass =
  "flex size-8 items-center justify-center rounded-full bg-elevated text-fg transition hover:brightness-125";

export function TopBar() {
  const name = useDashboardStore(
    (state) => state.dashboard?.name,
  );

  const collapsed = useUiStore(
    (state) => state.historyCollapsed,
  );

  const toggleHistory = useUiStore(
    (state) => state.toggleHistory,
  );

  return (
    <header className="flex h-16 shrink-0 items-center justify-between px-1">
      <div className="flex min-w-0 items-center gap-1.5 text-xs">
        <span className="text-muted">
          Investigation
        </span>

        <span className="text-muted">
          /
        </span>

        <span className="truncate font-semibold text-fg">
          {name ?? "New investigation"}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className={pillClass}
        >
          <span className="size-1.5 rounded-full bg-success" />
          <span>neonDB</span>
          <ChevronDown className="size-3 text-muted" />
        </button>

        <button
          type="button"
          className={pillClass}
        >
          <Globe className="size-3.5" />
          <span>EN</span>
          <ChevronDown className="size-3 text-muted" />
        </button>

        <ThemeToggle />

        {/*
          History is collapsed from its own header chevron, so the way back in
          only needs to exist once it is gone.
        */}
        {collapsed && (
          <button
            type="button"
            onClick={toggleHistory}
            aria-label="Show investigation history"
            className={`${iconButtonClass} hidden xl:flex`}
          >
            <PanelRight className="size-4" />
          </button>
        )}

        <button
          type="button"
          aria-label="Share investigation"
          className={iconButtonClass}
        >
          <Share className="size-3.5" />
        </button>

        <button
          type="button"
          aria-label="More options"
          className={iconButtonClass}
        >
          <MoreHorizontal className="size-4" />
        </button>
      </div>
    </header>
  );
}
