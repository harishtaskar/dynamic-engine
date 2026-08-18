import { isValidObjectId } from "mongoose";

import { DashboardModel } from "../models/dashboard.model.js";
import {
  dashboardSchema,
  type Dashboard,
} from "../schemas/dashboard.schema.js";
import { AppError } from "../utils/app-error.js";

export async function getAllDashboards() {
  const dashboards = await DashboardModel
    .find()
    .sort({ createdAt: -1 })
    .lean();

  return dashboards.map((dashboard) => ({
    id: dashboard._id.toString(),
    name: dashboard.name,
    prompt: dashboard.prompt,
    headline: dashboard.headline,
    subtitle: dashboard.subtitle,
    layout: dashboard.layout,
    theme: dashboard.theme,
    widgets: dashboard.widgets,
    createdAt: dashboard.createdAt,
    updatedAt: dashboard.updatedAt,
  }));
}

export async function getDashboardById(
  dashboardId: string,
): Promise<Dashboard & { id: string }> {
  if (!isValidObjectId(dashboardId)) {
    throw new AppError(
      "Invalid dashboard ID",
      400,
    );
  }

  const dashboard = await DashboardModel
    .findById(dashboardId)
    .lean();

  if (!dashboard) {
    throw new AppError(
      "Dashboard not found",
      404,
    );
  }

  const parsedDashboard =
    dashboardSchema.parse({
      name: dashboard.name,
      prompt: dashboard.prompt,
      headline: dashboard.headline,
      subtitle: dashboard.subtitle,
      layout: dashboard.layout,
      theme: dashboard.theme,
      widgets: dashboard.widgets,
    });

  return {
    id: dashboard._id.toString(),
    ...parsedDashboard,
  };
}