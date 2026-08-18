import { z } from "zod";

const updateFieldsSchema = z.object({
  dashboardId: z.string().min(1),

  widgetId: z.string().min(1),

  action: z.literal("UPDATE_FIELDS"),

  payload: z.object({
    values: z.record(
      z.string(),
      z.unknown(),
    ),
  }),
});

const executeCommandSchema = z.object({
  dashboardId: z.string().min(1),

  widgetId: z.string().min(1),

  action: z.literal("EXECUTE_COMMAND"),

  payload: z.object({
    command: z.string().min(1),
  }),
});

export const widgetActionSchema =
  z.discriminatedUnion("action", [
    updateFieldsSchema,
    executeCommandSchema,
  ]);

export type WidgetActionInput =
  z.infer<typeof widgetActionSchema>;