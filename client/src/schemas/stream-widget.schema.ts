import { z } from "zod";

import {
  dashboardWidgetSchema,
} from "./widget.schema";

export interface UnknownStreamWidget {
  id: string;
  type: string;
  title?: string;
}

export const streamWidgetSchema =
  z.object({
    id: z.string(),
    type: z.string(),
    title: z.string().optional(),
  });

export function parseStreamWidget(
  value: unknown,
) {
  const basicResult =
    streamWidgetSchema.safeParse(value);

  if (!basicResult.success) {
    return {
      type: "invalid" as const,
      error: basicResult.error,
    };
  }

  const knownResult =
    dashboardWidgetSchema.safeParse(
      value,
    );

  if (knownResult.success) {
    return {
      type: "known" as const,
      widget: knownResult.data,
    };
  }

  return {
    type: "unknown" as const,
    widget: basicResult.data,
  };
}