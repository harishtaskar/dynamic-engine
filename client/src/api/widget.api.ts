import axios from "axios";

import { apiClient } from "./client.api";

export type WidgetAction =
  | "UPDATE_FIELDS"
  | "EXECUTE_COMMAND";

export interface WidgetActionPayload {
  dashboardId: string;
  widgetId: string;
  action: WidgetAction;
  payload: Record<string, unknown>;
}

export interface WidgetActionResponse {
  dashboardId: string;
  widget: unknown;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function executeWidgetAction(
  payload: WidgetActionPayload,
) {
  const response =
    await apiClient.post<
      ApiResponse<WidgetActionResponse>
    >("/widget-action", payload);

  return response.data.data;
}

export function extractFieldErrors(
  error: unknown,
): Record<string, string> | null {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const fieldErrors = (
    error.response?.data as
      | {
          fieldErrors?: Record<
            string,
            string
          >;
        }
      | undefined
  )?.fieldErrors;

  return fieldErrors ?? null;
}
