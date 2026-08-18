import { apiClient } from "./client.api";

import type {
  Dashboard,
} from "../types/dashboard";

import type {
  RenderableWidget,
} from "../types/widget";

interface ApiDashboard {
  id: string;
  name: string;
  prompt: string;
  headline?: string;
  subtitle?: string;
  layout: string;
  theme: string;
  widgets: RenderableWidget[];
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const columnsByLayout: Record<
  string,
  number
> = {
  "grid-2-col": 2,
  "grid-3-col": 3,
  "grid-4-col": 4,
};

function toDashboard(
  dashboard: ApiDashboard,
): Dashboard {
  return {
    id: dashboard.id,
    name: dashboard.name,
    prompt: dashboard.prompt,
    headline: dashboard.headline,
    subtitle: dashboard.subtitle,

    layout: {
      type: "grid",
      columns:
        columnsByLayout[
          dashboard.layout
        ] ?? 3,
      gap: "md",
    },

    widgets: dashboard.widgets,
  };
}

export async function getDashboards(): Promise<
  Dashboard[]
> {
  const response =
    await apiClient.get<
      ApiResponse<ApiDashboard[]>
    >("/dashboards");

  return response.data.data.map(
    toDashboard,
  );
}

export async function getDashboardById(
  id: string,
): Promise<Dashboard> {
  const response =
    await apiClient.get<
      ApiResponse<ApiDashboard>
    >(`/dashboards/${id}`);

  return toDashboard(
    response.data.data,
  );
}
