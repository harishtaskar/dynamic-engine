export interface BaseWidget {
  id: string;
  type: string;
  title: string;
  layout?: {
    width?: "full" | "half" | "third" | "quarter";
  };
}

export type WidgetType =
  | "METRIC_CARD"
  | "DATA_TABLE"
  | "DYNAMIC_FORM"
  | "COMMAND_PANEL"
  | "BAR_CHART";

export type WidgetStatus =
  | "success"
  | "warning"
  | "error";

export interface MetricCardData {
  value: string | number;
  unit?: string;
  trend?: string;
  caption?: string;
  status: WidgetStatus;
  sparkline?: number[];
}

export interface MetricCardWidget {
  id: string;
  type: "METRIC_CARD";
  title: string;
  data: MetricCardData;
}

export interface DataTableColumn {
  key: string;
  label: string;
}

export interface DataTableData {
  columns: DataTableColumn[];
  rows: Record<string, unknown>[];
}

export interface DataTableWidget {
  id: string;
  type: "DATA_TABLE";
  title: string;
  data: DataTableData;
}

export type DynamicFieldType =
  | "text"
  | "number"
  | "slider"
  | "toggle"
  | "select";

export interface DynamicFormField {
  name: string;
  label: string;
  type: DynamicFieldType;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
  helpText?: string;
  placeholder?: string;

  default: unknown;
}

export interface DynamicFormWidget {
  id: string;
  type: "DYNAMIC_FORM";
  title: string;
  data: {
    fields: DynamicFormField[];
    actionEndpoint: string;
  };
}

export interface CommandAction {
  id: string;
  label: string;
  description?: string;
  variant: "default" | "danger";
}

export interface CommandPanelWidget {
  id: string;
  type: "COMMAND_PANEL";
  title: string;
  data: {
    actions: CommandAction[];
    actionEndpoint: string;
    lastExecutedCommand?: string;
    lastExecutedAt?: string;
  };
}

export interface BarChartBar {
  label: string;
  value: number;
}

export interface BarChartWidget {
  id: string;
  type: "BAR_CHART";
  title: string;
  data: {
    unit?: string;
    bars: BarChartBar[];
  };
}

export type DashboardWidget =
  | MetricCardWidget
  | DataTableWidget
  | DynamicFormWidget
  | CommandPanelWidget
  | BarChartWidget

export interface UnknownWidget {
  id: string;
  type: string;
  title?: string;
}

export type RenderableWidget =
  | DashboardWidget
  | UnknownWidget;