import { Router } from "express";

import {
  getAllDashboardsController,
  getDashboardByIdController,
} from "../controllers/dashboard.controller";

import { asyncHandler } from "../utils/async-handler";
import { generateDashboardController } from "../controllers/dashboard-generation.controller";

export const dashboardRouter =
  Router();

dashboardRouter.get(
  "/dashboards",
  asyncHandler(
    getAllDashboardsController,
  ),
);

dashboardRouter.get(
  "/dashboards/:id",
  asyncHandler(
    getDashboardByIdController,
  ),
);

dashboardRouter.post(
  "/generate-dashboard",
  asyncHandler(
    generateDashboardController,
  ),
);