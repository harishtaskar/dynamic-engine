import { create } from "zustand";

import type { Dashboard } from "../types/dashboard";
import type { RenderableWidget } from "../types/widget";

interface DashboardState {
  dashboard: Dashboard | null;

  setDashboard: (
    dashboard: Dashboard,
  ) => void;

  resetDashboard: () => void;

  addWidget: (
    widget: RenderableWidget,
  ) => void;

  getWidget: (
    widgetId: string,
  ) => RenderableWidget | undefined;

  updateWidget: (
    widgetId: string,
    updater: (
      widget: RenderableWidget,
    ) => RenderableWidget,
  ) => void;

  replaceWidget: (
    widget: RenderableWidget,
  ) => void;
}

export const useDashboardStore =
  create<DashboardState>((set, get) => ({
    dashboard: null,

    setDashboard: (dashboard) =>
      set({
        dashboard,
      }),

    resetDashboard: () =>
      set({
        dashboard: null,
      }),

    addWidget: (widget) =>
      set((state) => {
        if (!state.dashboard) {
          return state;
        }

        return {
          dashboard: {
            ...state.dashboard,

            widgets: [
              ...state.dashboard.widgets,
              widget,
            ],
          },
        };
      }),

    getWidget: (widgetId) => {
      return get().dashboard?.widgets.find(
        (widget) => widget.id === widgetId,
      );
    },

    updateWidget: (
      widgetId,
      updater,
    ) =>
      set((state) => {
        if (!state.dashboard) {
          return state;
        }

        return {
          dashboard: {
            ...state.dashboard,

            widgets:
              state.dashboard.widgets.map(
                (widget) =>
                  widget.id === widgetId
                    ? updater(widget)
                    : widget,
              ),
          },
        };
      }),

    replaceWidget: (updatedWidget) =>
      set((state) => {
        if (!state.dashboard) {
          return state;
        }

        return {
          dashboard: {
            ...state.dashboard,

            widgets:
              state.dashboard.widgets.map(
                (widget) =>
                  widget.id ===
                  updatedWidget.id
                    ? updatedWidget
                    : widget,
              ),
          },
        };
      }),
  }));
