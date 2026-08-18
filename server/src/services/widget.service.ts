import { isValidObjectId } from "mongoose";

import { DashboardModel } from "../models/dashboard.model.js";

import type {
  WidgetActionInput,
} from "../schemas/widget-action.schema.js";

import { AppError } from "../utils/app-error.js";
import { validateFormValues } from "../utils/validate-form-values.js";

export async function executeWidgetAction(
  input: WidgetActionInput,
) {
  if (
    !isValidObjectId(input.dashboardId)
  ) {
    throw new AppError(
      "Invalid dashboard ID",
      400,
    );
  }

  const dashboard =
    await DashboardModel.findById(
      input.dashboardId,
    );

  if (!dashboard) {
    throw new AppError(
      "Dashboard not found",
      404,
    );
  }

  const widget = dashboard.widgets.find(
    (item) => item.id === input.widgetId,
  );

  if (!widget) {
    throw new AppError(
      "Widget not found",
      404,
    );
  }

  switch (input.action) {

    case "UPDATE_FIELDS": {
      const values =
        input.payload.values as Record<
          string,
          unknown
        >;

      if (
        !values ||
        typeof values !== "object" ||
        Array.isArray(values)
      ) {
        throw new AppError(
          "Values object is required",
          400,
        );
      }

      if (
        widget.type !== "DYNAMIC_FORM"
      ) {
        throw new AppError(
          "UPDATE_FIELDS is only supported for DYNAMIC_FORM widgets",
          400,
        );
      }

      const fields =
        Array.isArray(
          widget.data?.fields,
        )
          ? widget.data.fields
          : [];

      const fieldErrors =
        validateFormValues(
          fields,
          values,
        );

      if (
        Object.keys(fieldErrors).length > 0
      ) {
        throw new AppError(
          "Validation failed",
          422,
          fieldErrors,
        );
      }

      for (const field of fields) {
        if (
          Object.prototype.hasOwnProperty.call(
            values,
            field.name,
          )
        ) {
          field.default =
            values[field.name];
        }
      }

      widget.markModified("data");

      break;
    }

    // ======================================
    // EXECUTE_COMMAND
    // ======================================

    case "EXECUTE_COMMAND": {
      const command =
        input.payload.command;

      if (
        typeof command !== "string" ||
        command.trim().length === 0
      ) {
        throw new AppError(
          "Command is required",
          400,
        );
      }

      if (
        widget.type !== "COMMAND_PANEL"
      ) {
        throw new AppError(
          "EXECUTE_COMMAND is only supported for COMMAND_PANEL widgets",
          400,
        );
      }

      widget.data = {
        ...(widget.data as Record<
          string,
          unknown
        >),

        lastExecutedCommand:
          command,

        lastExecutedAt:
          new Date().toISOString(),
      };

      widget.markModified("data");

      break;
    }

    default: {
      throw new AppError(
        "Unsupported widget action",
        400,
      );
    }
  }

  // ----------------------------------------
  // 5. Persist changes
  // ----------------------------------------

  await dashboard.save();

  // ----------------------------------------
  // 6. Get updated widget
  // ----------------------------------------

  const updatedWidget =
    dashboard.widgets.find(
      (item) => item.id === input.widgetId,
    );

  if (!updatedWidget) {
    throw new AppError(
      "Updated widget not found",
      404,
    );
  }

  return {
    dashboardId:
      dashboard._id.toString(),

    widget: updatedWidget,

    updatedAt:
      dashboard.updatedAt,
  };
}