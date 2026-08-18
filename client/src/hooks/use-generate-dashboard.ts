import { useState } from "react";

import {
  generateDashboard,
} from "../api/dashboard-generation.api";

import {
  parseStreamWidget,
} from "../schemas/stream-widget.schema";

import {
  useDashboardStore,
} from "../stores/dashboard.store";

import type {
  DashboardLayout,
} from "../types/dashboard";

import type {
  DashboardWidget,
} from "../types/widget";

const columnsByLayout: Record<
  string,
  number
> = {
  "grid-2-col": 2,
  "grid-3-col": 3,
  "grid-4-col": 4,
};

function toLayout(
  layout: string | undefined,
): DashboardLayout {
  return {
    type: "grid",
    columns:
      columnsByLayout[layout ?? ""] ?? 3,
    gap: "md",
  };
}

export function useGenerateDashboard() {
  const [isGenerating, setIsGenerating] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const setDashboard =
    useDashboardStore(
      (state) => state.setDashboard,
    );

  const addWidget =
    useDashboardStore(
      (state) => state.addWidget,
    );

  const resetDashboard =
    useDashboardStore(
      (state) => state.resetDashboard,
    );

  const generate = async (
    prompt: string,
  ) => {
    setError(null);
    setIsGenerating(true);
    resetDashboard();

    try {
      await generateDashboard(
        prompt,
        (event) => {
          if (
            event.type === "meta" &&
            event.dashboardId
          ) {
            setDashboard({
              id: event.dashboardId,

              name:
                event.name ??
                "Generated Dashboard",

              prompt:
                event.prompt ?? prompt,

              headline:
                event.headline,

              subtitle:
                event.subtitle,

              contentCount:
                event.contentCount,

              layout: toLayout(
                event.layout,
              ),

              widgets: [],
            });

            return;
          }

          if (
            event.type === "widget"
          ) {
            const result =
              parseStreamWidget(
                event.widget,
              );

            if (
              result.type === "invalid"
            ) {
              console.error(
                "Invalid widget:",
                result.error,
              );

              return;
            }

            if (
              result.type === "known"
            ) {
              addWidget(
                result.widget as unknown as DashboardWidget,
              );

              return;
            }

            addWidget(result.widget);

            return;
          }

          if (
            event.type === "error"
          ) {
            setError(
              event.message ??
                "Generation failed.",
            );
          }
        },
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Generation failed.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    error,
    generate,
  };
}
