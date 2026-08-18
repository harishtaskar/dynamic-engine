import { z } from "zod";

const metricCardSchema = z.object({
  id: z.string(),
  type: z.literal("METRIC_CARD"),
  title: z.string(),

  data: z.object({
    value: z.number(),
    unit: z.string().optional(),
    trend: z.string().optional(),
    caption: z.string().optional(),
    status: z.string().optional(),
    sparkline: z.array(z.number()).optional(),
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
      z.record(
        z.string(),
        z.unknown(),
      ),
    ),
  }),
});

const validationRules = {
  required: z.boolean().optional(),
  step: z.number().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
  patternMessage: z.string().optional(),
  helpText: z.string().optional(),
  placeholder: z.string().optional(),
};

const dynamicFormFieldSchema =
  z.discriminatedUnion("type", [
    z.object({
      name: z.string(),
      label: z.string(),
      type: z.literal("slider"),
      min: z.number(),
      max: z.number(),
      default: z.number(),
      ...validationRules,
    }),

    z.object({
      name: z.string(),
      label: z.string(),
      type: z.literal("toggle"),
      default: z.boolean(),
      ...validationRules,
    }),

    z.object({
      name: z.string(),
      label: z.string(),
      type: z.literal("number"),
      min: z.number().optional(),
      max: z.number().optional(),
      default: z.number(),
      ...validationRules,
    }),

    z.object({
      name: z.string(),
      label: z.string(),
      type: z.literal("text"),
      default: z.string(),
      ...validationRules,
    }),
  ]);

const dynamicFormSchema = z.object({
  id: z.string(),
  type: z.literal("DYNAMIC_FORM"),
  title: z.string(),

  data: z.object({
    fields: z.array(
      dynamicFormFieldSchema,
    ),
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
        variant: z.string().optional(),
      }),
    ),
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

export const dashboardWidgetSchema =
  z.discriminatedUnion("type", [
    metricCardSchema,
    dataTableSchema,
    dynamicFormSchema,
    commandPanelSchema,
    barChartSchema,
  ]);

export type ParsedDashboardWidget =
  z.infer<
    typeof dashboardWidgetSchema
  >;
