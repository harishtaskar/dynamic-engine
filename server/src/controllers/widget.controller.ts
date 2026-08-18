import type {
  Request,
  Response,
} from "express";

import {
  widgetActionSchema,
} from "../schemas/widget-action.schema.js";

import {
  executeWidgetAction,
} from "../services/widget.service.js";

export async function widgetActionController(
  req: Request,
  res: Response,
) {
  const result =
    widgetActionSchema.safeParse(
      req.body,
    );

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid widget action",
      details: result.error.flatten(),
    });
  }

  const updated =
    await executeWidgetAction(
      result.data,
    );

  return res.json({
    success: true,
    data: updated,
  });
}