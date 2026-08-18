import type {
  ErrorRequestHandler,
} from "express";

import { AppError } from "../utils/app-error";

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  console.error(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      ...(error.fieldErrors && {
        fieldErrors: error.fieldErrors,
      }),
    });
  }

  return res.status(500).json({
    success: false,
    error: "Internal server error",
  });
};