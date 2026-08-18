import { Router } from "express";

import {
  widgetActionController,
} from "../controllers/widget.controller";

import { asyncHandler } from "../utils/async-handler";

export const widgetRouter =
  Router();

widgetRouter.post(
  "/widget-action",
  asyncHandler(
    widgetActionController,
  ),
);