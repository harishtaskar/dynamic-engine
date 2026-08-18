import { z } from "zod";

export const generateDashboardRequestSchema =
  z.object({
    prompt: z
      .string()
      .min(1)
      .max(1000),
  });

export type GenerateDashboardRequest =
  z.infer<
    typeof generateDashboardRequestSchema
  >;

export type DashboardGenerationEvent =
  | {
      type: "meta";
      dashboardId: string;
      name: string;
      prompt: string;
      layout: "grid-2-col" | "grid-3-col" | "grid-4-col";
      theme: "dark" | "light";
      headline: string;
      subtitle: string;
      contentCount: number;
    }
  | {
      type: "widget";
      widget: unknown;
    }
  | {
      type: "error";
      message: string;
    }
  | {
      type: "done";
    };