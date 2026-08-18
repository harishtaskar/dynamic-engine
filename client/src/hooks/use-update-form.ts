import { useOptimisticAction } from "./use-optimistic-action";

import {
  useDashboardStore,
} from "../stores/dashboard.store";

import type {
  DynamicFormWidget,
} from "../types/widget";

export function useUpdateForm(
  dashboardId: string,
  widgetId: string,
) {
  const { run, isPending } =
    useOptimisticAction(dashboardId);

  const getWidget =
    useDashboardStore(
      (state) => state.getWidget,
    );

  const updateForm = async (
    values: Record<string, unknown>,
  ) => {
    const current =
      getWidget(widgetId);

    if (
      !current ||
      current.type !== "DYNAMIC_FORM"
    ) {
      throw new Error(
        "Dynamic form widget not found",
      );
    }

    await run({
      widgetId,
      action: "UPDATE_FIELDS",
      payload: { values },

      optimistic: (widget) => {
        if (
          widget.type !==
          "DYNAMIC_FORM"
        ) {
          return widget;
        }

        const formWidget =
          widget as DynamicFormWidget;

        return {
          ...formWidget,

          data: {
            ...formWidget.data,

            fields:
              formWidget.data.fields.map(
                (field) =>
                  Object.prototype.hasOwnProperty.call(
                    values,
                    field.name,
                  )
                    ? {
                        ...field,
                        default:
                          values[
                            field.name
                          ],
                      }
                    : field,
              ),
          },
        };
      },

      successMessage:
        "Changes applied.",
      errorMessage:
        "Failed to apply changes.",
    });
  };

  return {
    updateForm,
    isPending,
  };
}
