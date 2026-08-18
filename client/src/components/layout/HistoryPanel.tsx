import {
  ChevronRight,
  Clock,
  MessageSquare,
  MoreVertical,
} from "lucide-react";

import clsx from "clsx";
import { motion } from "framer-motion";

import { useUiStore } from "../../stores/ui.store";

const historyItems = [
  {
    title:
      "Which accounts are high-risk and need review?",
    time: "just now",
    active: true,
  },
  {
    title:
      "How many accounts are we worried about right now?",
    time: "11 min ago",
  },
  {
    title:
      "I want to review our risk exposure.",
    time: "23 min ago",
  },
];

export function HistoryPanel() {
  const collapsed = useUiStore(
    (state) => state.historyCollapsed,
  );

  const toggleHistory = useUiStore(
    (state) => state.toggleHistory,
  );

  return (
    <motion.aside
      initial={false}
      animate={{
        width: collapsed ? 0 : 288,
        marginLeft: collapsed ? -20 : 0,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className={clsx(
        "hidden shrink-0 overflow-hidden rounded-2xl xl:block",
        !collapsed && "bg-surface",
      )}
    >
      <div className="flex h-full w-72 flex-col">
        <div className="flex items-center gap-2 px-4 pt-5 pb-3">
          <Clock className="size-3.5 shrink-0 text-muted" />

          <h2 className="flex-1 text-sm font-semibold text-fg">
            Investigation History
          </h2>

          <button
            type="button"
            onClick={toggleHistory}
            aria-label="Collapse history"
            className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted transition hover:bg-elevated hover:text-fg"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto px-3 pb-3">
          {historyItems.map((item) =>
            /*
              The current investigation gets a raised card and drops its icon
              onto its own line, so the question itself gets the full width —
              the rest stay flush rows that read as a list.
            */
            item.active ? (
              <div
                key={item.title}
                className="rounded-xl bg-elevated p-3"
              >
                <div className="flex items-start justify-between">
                  <MessageSquare className="size-3.5 text-muted" />

                  <MoreVertical className="size-3.5 text-muted" />
                </div>

                <p className="mt-2.5 text-[13px] leading-5 text-fg">
                  {item.title}
                </p>

                <p className="mt-2 text-[11px] font-medium text-muted">
                  {item.time}
                </p>
              </div>
            ) : (
              <button
                key={item.title}
                type="button"
                className="group flex w-full gap-2.5 rounded-xl p-3 text-left transition hover:bg-elevated"
              >
                <MessageSquare className="mt-0.5 size-3.5 shrink-0 text-muted" />

                <div className="min-w-0 flex-1">
                  <p className="text-[13px] leading-5 text-fg">
                    {item.title}
                  </p>

                  <p className="mt-1.5 text-[11px] font-medium text-muted">
                    {item.time}
                  </p>
                </div>

                <MoreVertical className="mt-0.5 size-3.5 shrink-0 text-muted opacity-0 transition group-hover:opacity-100" />
              </button>
            ),
          )}
        </div>
      </div>
    </motion.aside>
  );
}
