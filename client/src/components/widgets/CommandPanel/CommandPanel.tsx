import { useState } from "react";

import {
  CircleCheck,
  Loader2,
} from "lucide-react";

import clsx from "clsx";
import { motion } from "framer-motion";

import type {
  CommandPanelWidget,
} from "../../../types/widget";

import { useOptimisticAction } from "../../../hooks/use-optimistic-action";

import {
  WidgetCard,
  WidgetCardHeader,
} from "../WidgetCard";

interface CommandPanelProps {
  dashboardId: string;
  widget: CommandPanelWidget;
}

export function CommandPanel({
  dashboardId,
  widget,
}: CommandPanelProps) {
  const { run } =
    useOptimisticAction(dashboardId);

  const [pendingId, setPendingId] =
    useState<string | null>(null);

  const lastExecuted =
    widget.data.lastExecutedCommand;

  const executeCommand = async (
    command: string,
    label: string,
  ) => {
    setPendingId(command);

    try {
      await run({
        widgetId: widget.id,
        action: "EXECUTE_COMMAND",
        payload: { command },

        optimistic: (current) => {
          if (
            current.type !==
            "COMMAND_PANEL"
          ) {
            return current;
          }

          const panel =
            current as CommandPanelWidget;

          return {
            ...panel,

            data: {
              ...panel.data,
              lastExecutedCommand:
                command,
            },
          };
        },

        successMessage: `${label} executed.`,
        errorMessage: `${label} failed.`,
      });
    } catch {
      return;
    } finally {
      setPendingId(null);
    }
  };

  return (
    <WidgetCard>
      <WidgetCardHeader title={widget.title} />

      <div className="flex-1 px-3 pt-1 pb-3">
        {widget.data.actions.map(
          (action) => {
            const pending =
              pendingId === action.id;

            const done =
              lastExecuted === action.id;

            return (
              <motion.button
                key={action.id}
                type="button"
                whileTap={{ scale: 0.995 }}
                disabled={pendingId !== null}
                onClick={() =>
                  executeCommand(
                    action.id,
                    action.label,
                  )
                }
                className={clsx(
                  "group flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left leading-5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60",
                  action.variant === "danger"
                    ? "hover:bg-danger/10"
                    : "hover:bg-elevated",
                )}
              >
                {pending ? (
                  <Loader2 className="size-4 shrink-0 animate-spin text-muted" />
                ) : (
                  <CircleCheck
                    className={clsx(
                      "size-4 shrink-0 transition-colors",
                      done ? "text-success" : "text-muted",
                    )}
                  />
                )}

                <span className="min-w-0 flex-1 truncate">
                  <span
                    className={clsx(
                      "text-[13px] font-semibold text-fg transition-colors",
                      action.variant === "danger" &&
                        "group-hover:text-danger",
                    )}
                  >
                    {action.label}
                  </span>

                  {action.description && (
                    <span className="mt-0.5 block truncate text-[11px] font-normal text-muted">
                      {action.description}
                    </span>
                  )}
                </span>
              </motion.button>
            );
          },
        )}
      </div>
    </WidgetCard>
  );
}
