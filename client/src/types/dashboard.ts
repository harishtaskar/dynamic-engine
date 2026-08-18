import type {
  RenderableWidget,
} from "./widget";

export interface DashboardLayout {
  type: "grid";
  columns: number;
  gap: "sm" | "md" | "lg";
}

export interface Dashboard {
  id: string;
  name: string;
  prompt: string;
  headline?: string;
  subtitle?: string;
  contentCount?: number;
  layout: DashboardLayout;
  widgets: RenderableWidget[];
}