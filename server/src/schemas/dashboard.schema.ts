import { z } from "zod";

const metricCardSchema = z.object({
  id: z.string(),
  type: z.literal("METRIC_CARD"),
  title: z.string(),

  data: z.object({
    value: z.union([
      z.string(),
      z.number(),
    ]),
    unit: z.string().optional(),
    trend: z.string().optional(),
    caption: z.string().optional(),
    status: z.enum([
      "success",
      "warning",
      "error",
    ]),
    sparkline: z.array(z.number()),
  }),
});

const dataTableSchema = z.object({
  id: z.string(),
  type: z.literal("DATA_TABLE"),
  title: z.string(),

  data: z.object({
    columns: z.array(
      z.object({
        key: z.string(),
        label: z.string(),
      }),
    ),

    rows: z.array(
      z.record(z.string(), z.unknown()),
    ),
  }),
});

const dynamicFormFieldSchema = z.object({
  name: z.string(),
  label: z.string(),

  type: z.enum([
    "text",
    "number",
    "slider",
    "toggle",
    "select",
  ]),

  // Validation rules travel with the field. The client compiles them into a
  // Zod schema for the form, and widget.service re-checks them on submit.
  required: z.boolean().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
  patternMessage: z.string().optional(),
  helpText: z.string().optional(),
  placeholder: z.string().optional(),

  default: z.unknown(),
});

const dynamicFormSchema = z.object({
  id: z.string(),
  type: z.literal("DYNAMIC_FORM"),
  title: z.string(),

  data: z.object({
    fields: z.array(dynamicFormFieldSchema),
    actionEndpoint: z.string(),
  }),
});

const commandPanelSchema = z.object({
  id: z.string(),
  type: z.literal("COMMAND_PANEL"),
  title: z.string(),

  data: z.object({
    actions: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        description: z.string().optional(),
        variant: z.enum([
          "default",
          "danger",
        ]),
      }),
    ),

    actionEndpoint: z.string(),
  }),
});

const barChartSchema = z.object({
  id: z.string(),
  type: z.literal("BAR_CHART"),
  title: z.string(),

  data: z.object({
    unit: z.string().optional(),
    bars: z.array(
      z.object({
        label: z.string(),
        value: z.number(),
      }),
    ),
  }),
});

export const widgetSchema = z.discriminatedUnion(
  "type",
  [
    metricCardSchema,
    dataTableSchema,
    dynamicFormSchema,
    commandPanelSchema,
    barChartSchema,
  ],
);

export const dashboardSchema = z.object({
  name: z.string(),

  prompt: z.string(),
  headline: z.string().optional(),
  subtitle: z.string().optional(),

  layout: z.enum([
    "grid-2-col",
    "grid-3-col",
    "grid-4-col",
  ]),

  theme: z.enum([
    "dark",
    "light",
  ]),

  widgets: z.array(widgetSchema),
});

export type Dashboard = z.infer<
  typeof dashboardSchema
>;

export type DashboardWidget = z.infer<
  typeof widgetSchema
>;