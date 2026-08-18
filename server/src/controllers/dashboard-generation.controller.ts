import type { Request, Response } from "express";

import {
  generateDashboardRequestSchema,
} from "../schemas/dashboard-generation.schema.js";

import {
  generateDashboard,
} from "../services/dashboard-generation.service.js";

export async function generateDashboardController(
  req: Request,
  res: Response,
) {
  const result =
    generateDashboardRequestSchema.safeParse(
      req.body,
    );

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid prompt",
    });
  }

  res.status(200);

  res.setHeader(
    "Content-Type",
    "application/x-ndjson",
  );

  res.setHeader(
    "Cache-Control",
    "no-cache",
  );

  res.setHeader(
    "Connection",
    "keep-alive",
  );

  res.setHeader(
    "X-Accel-Buffering",
    "no",
  );

  try {
    for await (
      const event of generateDashboard(
        result.data.prompt,
      )
    ) {
      res.write(
        JSON.stringify(event) +
          "\n",
      );
    }
  } catch (error) {
    res.write(
      JSON.stringify({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Generation failed",
      }) + "\n",
    );
  } finally {
    res.end();
  }
}