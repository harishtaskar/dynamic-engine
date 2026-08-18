import type {
  Request,
  Response,
} from "express";

import {
  getAllDashboards,
  getDashboardById,
} from "../services/dashboard.service";

export async function getAllDashboardsController(
  _req: Request,
  res: Response,
) {
  const dashboards = await getAllDashboards();

  return res.json({
    success: true,
    data: dashboards,
  });
}

export async function getDashboardByIdController(
  req: Request,
  res: Response,
) {
  const id = req.params.id as string;  
  const dashboard =
    await getDashboardById(id);

  return res.json({
    success: true,
    data: dashboard,
  });
}