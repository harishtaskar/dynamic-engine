import type {
  ComponentType,
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

export const widgetRegistry: Partial<
  Record<WidgetType, WidgetComponent>
> = {};
