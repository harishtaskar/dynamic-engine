import {
  lazy,
  type ComponentType,
} from "react";

import type {
  DashboardWidget,
  WidgetType,
} from "../types/widget";

export interface WidgetComponentProps {
  dashboardId: string;
  widget: DashboardWidget;
}

type WidgetComponent =
  ComponentType<WidgetComponentProps>;

const MetricCard = lazy(async () => ({
  default: (
    await import(
      "../components/widgets/MetricCard"
    )
  ).MetricCard,
}));

const DataTable = lazy(async () => ({
  default: (
    await import(
      "../components/widgets/DataTable"
    )
  ).DataTable,
}));

const BarChart = lazy(async () => ({
  default: (
    await import(
      "../components/widgets/BarChart"
    )
  ).BarChart,
}));

function asWidgetComponent(
  Component: unknown,
): WidgetComponent {
  return Component as WidgetComponent;
}

export const widgetRegistry: Partial<
  Record<WidgetType, WidgetComponent>
> = {
  METRIC_CARD:
    asWidgetComponent(MetricCard),

  DATA_TABLE:
    asWidgetComponent(DataTable),

  BAR_CHART:
    asWidgetComponent(BarChart),
};
