import {
  Bookmark,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  MessageSquare,
  PanelLeftClose,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Telescope,
} from "lucide-react";

import clsx from "clsx";

import { useUiStore } from "../../stores/ui.store";

/*
  Each saved investigation is a stored question, and re-opening one re-runs it
  through the generator rather than replaying a cached board. The prompt is
  carried explicitly instead of reusing the label: the backend picks a template
  by keyword, and several of these titles share the word "risk", so leaning on
  the label would collapse half the menu onto one board.
*/
const investigations = [
  {
    label:
      "How many active customer accounts do we have?",
    prompt: "Web traffic and engagement",
  },
  {
    label: "High Risk Accounts Review",
    prompt: "High risk accounts review",
  },
  {
    label: "Customer Risk Distribution",
    prompt: "High risk accounts review",
  },
  {
    label: "Top Customers Analysis",
    prompt: "Sales performance overview",
  },
  {
    label: "Fraud Risk Monitoring",
    prompt: "Fraud monitoring dashboard",
  },
  {
    label: "Geographic Risk Exposure",
    prompt: "Real-time system analytics",
  },
];

/*
  Navigation is grouped rather than listed: a hairline between groups is enough
  separation, so the rows themselves carry no chrome until hovered.
*/
const navigationGroups = [
  [
    { label: "Chat with Data", icon: MessageSquare, expandable: true },
    { label: "Dashboards", icon: LayoutDashboard, expandable: true },
  ],
  [{ label: "Saved Reports", icon: Bookmark, expandable: true }],
  [
    { label: "Admin Console", icon: ShieldCheck, expandable: false },
    { label: "Settings", icon: Settings, expandable: false },
  ],
];

export function Sidebar() {
  const activeInvestigation = useUiStore(
    (state) => state.activeInvestigation,
  );

  const setActiveInvestigation = useUiStore(
    (state) => state.setActiveInvestigation,
  );

  return (
    <aside className="hidden w-60 shrink-0 flex-col rounded-2xl bg-surface md:flex">
      <div className="flex items-center justify-between px-4 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-fg text-sm font-bold text-canvas">
            Z
          </div>

          <span className="text-sm font-semibold text-fg">
            BI Portal
          </span>
        </div>

        <button
          type="button"
          aria-label="Collapse sidebar"
          className="flex size-7 items-center justify-center rounded-md text-muted transition hover:bg-elevated hover:text-fg"
        >
          <PanelLeftClose className="size-4" />
        </button>
      </div>

      <div className="flex gap-2 px-3">
        <button
          type="button"
          className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-elevated text-xs font-semibold text-fg transition hover:brightness-125"
        >
          <Plus className="size-3.5" />
          New investigation
        </button>

        <button
          type="button"
          aria-label="Search"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-elevated text-fg transition hover:brightness-125"
        >
          <Search className="size-4" />
        </button>
      </div>

      <div className="mt-3 flex-1 overflow-y-auto px-3 pb-4">
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-xl bg-elevated py-2 pl-2 pr-3 text-left"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-fg text-canvas">
            <Telescope className="size-4" />
          </span>

          <span className="flex-1 text-[13px] font-semibold text-fg">
            Investigations
          </span>

          <ChevronDown className="size-4 shrink-0 text-muted" />
        </button>

        <nav className="mt-2 space-y-0.5 pl-4">
          {investigations.map((item) => {
            const active =
              activeInvestigation === item.label;

            return (
              <button
                key={item.label}
                type="button"
                title={item.label}
                aria-current={
                  active ? "page" : undefined
                }
                onClick={() =>
                  setActiveInvestigation(item.label)
                }
                className={clsx(
                  "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-[13px] transition",
                  active
                    ? "bg-elevated font-semibold text-fg"
                    : "text-muted hover:bg-elevated hover:text-fg",
                )}
              >
                <span className="min-w-0 flex-1 truncate">
                  {item.label}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            className="block w-full truncate rounded-md px-3 py-1.5 text-left text-[13px] text-muted transition hover:bg-elevated hover:text-fg"
          >
            View All
          </button>
        </nav>

        {navigationGroups.map((group, groupIndex) => (
          <nav
            key={groupIndex}
            className={clsx(
              "mt-3 space-y-0.5",
              // The first group follows the investigation list directly; the
              // hairline only appears where one group ends and another starts.
              groupIndex > 0 &&
                "border-t border-border pt-3",
            )}
          >
            {group.map(({ label, icon: Icon, expandable }) => (
              <button
                key={label}
                type="button"
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-semibold text-fg transition hover:bg-elevated"
              >
                <Icon className="size-4 shrink-0 text-muted" />

                <span className="flex-1 truncate">
                  {label}
                </span>

                {expandable && (
                  <ChevronRight className="size-3.5 shrink-0 text-muted" />
                )}
              </button>
            ))}
          </nav>
        ))}
      </div>

      <div className="p-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg p-1 text-left transition hover:bg-elevated"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-elevated text-[11px] font-semibold text-fg">
            LN
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-fg">
              Lisa Nguyen
            </p>

            <p className="truncate text-[11px] text-muted">
              Manager
            </p>
          </div>

          <ChevronRight className="size-3.5 shrink-0 text-muted" />
        </button>
      </div>
    </aside>
  );
}
