import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { getAllDashboardsController, getDashboardByIdController } from "../controllers/dashboard.controller";

export const dashboardRouter =
  Router();

dashboardRouter.get(
  "/dashboards",
  asyncHandler(getAllDashboardsController)
);

dashboardRouter.get(
  "/dashboards/:id",
  asyncHandler(getDashboardByIdController)
);  