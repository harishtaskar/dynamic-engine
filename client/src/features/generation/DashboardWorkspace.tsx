import { useEffect, useRef, useState } from "react";

import {
  getDashboardById,
  getDashboards,
} from "../../api/dashboard.api";

import { AppShell } from "../../components/layout/AppShell";
import { Sidebar } from "../../components/layout/Sidebar";
import { HistoryPanel } from "../../components/layout/HistoryPanel";
import { InvestigationHeader } from "../../components/investigation/InvestigationHeader";

import { WidgetRenderer } from "../../registry/WidgetRenderer";
import { WidgetSkeleton } from "../../components/skeletons/WidgetSkeleton";
import { PromptBar } from "./PromptBar";

import {
  useGenerateDashboard,
} from "../../hooks/use-generate-dashboard";

import {
  useDashboardStore,
} from "../../stores/dashboard.store";

import { useUiStore } from "../../stores/ui.store";

import type {
  RenderableWidget,
} from "../../types/widget";

const typeOrder: Record<string, number> = {
  METRIC_CARD: 0,
  DATA_TABLE: 1,
  COMMAND_PANEL: 2,
  BAR_CHART: 3,
  DYNAMIC_FORM: 4,
};

const spanByType: Record<string, string> = {
  METRIC_CARD: "",
  DATA_TABLE: "col-span-full",
  COMMAND_PANEL: "sm:col-span-2",
  BAR_CHART: "sm:col-span-2",
  DYNAMIC_FORM: "sm:col-span-2",
};

function spanClass(type: string) {
  return spanByType[type] ?? "sm:col-span-2";
}

function spanForIndex(index: number) {
  if (index === 4) {
    return "col-span-full";
  }

  if (index === 5 || index === 6) {
    return "sm:col-span-2";
  }

  return "";
}

function readingOrder(
  widgets: RenderableWidget[],
) {
  return [...widgets]
    .map((widget, index) => ({
      widget,
      index,
    }))
    .sort((a, b) => {
      const rank =
        (typeOrder[a.widget.type] ?? 99) -
        (typeOrder[b.widget.type] ?? 99);

      return rank !== 0
        ? rank
        : a.index - b.index;
    })
    .map((entry) => entry.widget);
}

const DEMO_PROMPT = "High risk accounts review";

export function DashboardWorkspace() {
  const {
    isGenerating,
    error,
    generate,
  } = useGenerateDashboard();

  const dashboard =
    useDashboardStore(
      (state) => state.dashboard,
    );

  const setDashboard =
    useDashboardStore(
      (state) => state.setDashboard,
    );

  const setActiveInvestigation = useUiStore(
    (state) => state.setActiveInvestigation,
  );

  const didRequest = useRef(false);

  const [bootstrapping, setBootstrapping] =
    useState(true);

  useEffect(() => {
    if (didRequest.current) {
      return;
    }

    didRequest.current = true;

    const bootstrap = async () => {
      try {
        const existing =
          await getDashboards();

        if (existing.length > 0) {
          const preferred =
            existing.find(
              (item) =>
                item.prompt.toLowerCase() ===
                DEMO_PROMPT.toLowerCase(),
            ) ?? existing[0];

          const latest =
            await getDashboardById(
              preferred.id,
            );

          setDashboard(latest);

          if (
            preferred.prompt.toLowerCase() !==
            DEMO_PROMPT.toLowerCase()
          ) {
            setActiveInvestigation(null);
          }
        } else {
          await generate(DEMO_PROMPT);
        }
      } catch {
        await generate(DEMO_PROMPT);
      } finally {
        setBootstrapping(false);
      }
    };

    void bootstrap();
  }, [
    generate,
    setDashboard,
    setActiveInvestigation,
  ]);

  const widgets =
    dashboard?.widgets ?? [];

  const dashboardId =
    dashboard?.id ?? "";

  const content = readingOrder(widgets);

  const generateFromPrompt = async (
    prompt: string,
  ) => {
    setActiveInvestigation(null);

    await generate(prompt);
  };

  const loading =
    isGenerating || bootstrapping;

  const skeletonCount = loading
    ? Math.max(
        0,
        (dashboard?.contentCount ?? 8) -
          content.length,
      )
    : 0;

  return (
    <AppShell
      sidebar={
        <Sidebar
          onSelectInvestigation={generate}
          isGenerating={loading}
        />
      }
      history={<HistoryPanel />}
      prompt={
        <PromptBar
          onSubmit={generateFromPrompt}
          isGenerating={isGenerating}
        />
      }
    >
      <div className="w-full px-8 pt-4 pb-40">
        <InvestigationHeader />

        {error && (
          <div className="mt-4 rounded-xl border border-danger/40 bg-danger/10 p-4 text-sm text-danger">
            {error}
          </div>
        )}

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {content.map((widget) => (
            <div
              key={widget.id}
              className={`min-w-0 ${spanClass(
                widget.type,
              )}`}
            >
              <WidgetRenderer
                dashboardId={dashboardId}
                widget={widget}
              />
            </div>
          ))}

          {Array.from({
            length: skeletonCount,
          }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className={spanForIndex(
                content.length + index,
              )}
            >
              <WidgetSkeleton />
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
