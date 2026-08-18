import { useWidgetAction } from "./use-widget-action";

import {
  useDashboardStore,
} from "../stores/dashboard.store";

import {
  useToastStore,
} from "../stores/toast.store";

import type {
  WidgetAction,
} from "../api/widget.api";

import type {
  RenderableWidget,
} from "../types/widget";

interface RunArgs {
  widgetId: string;
  action: WidgetAction;
  payload: Record<string, unknown>;
  optimistic: (
    widget: RenderableWidget,
  ) => RenderableWidget;
  successMessage?: string;
  errorMessage?: string;
}

export function useOptimisticAction(
  dashboardId: string,
) {
  const widgetAction =
    useWidgetAction();

  const getWidget =
    useDashboardStore(
      (state) => state.getWidget,
    );

  const updateWidget =
    useDashboardStore(
      (state) => state.updateWidget,
    );

  const replaceWidget =
    useDashboardStore(
      (state) => state.replaceWidget,
    );

  const addToast = useToastStore(
    (state) => state.addToast,
  );

  const run = async ({
    widgetId,
    action,
    payload,
    optimistic,
    successMessage,
    errorMessage,
  }: RunArgs) => {
    const current =
      getWidget(widgetId);

    if (!current) {
      throw new Error(
        "Widget not found",
      );
    }

    const previous =
      structuredClone(current);

    updateWidget(
      widgetId,
      optimistic,
    );

    try {
      const result =
        await widgetAction.mutateAsync(
          {
            dashboardId,
            widgetId,
            action,
            payload,
          },
        );

      if (successMessage) {
        addToast({
          variant: "success",
          message: successMessage,
        });
      }

      return result;
    } catch (error) {
      replaceWidget(previous);

      addToast({
        variant: "error",
        message:
          errorMessage ??
          "Action failed.",
      });

      throw error;
    }
  };

  return {
    run,
    isPending:
      widgetAction.isPending,
  };
}
