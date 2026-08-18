import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";

import type {
  DynamicFormField,
  DynamicFormWidget,
} from "../../../types/widget";

import {
  WidgetCard,
  WidgetCardHeader,
} from "../WidgetCard";

import { buildFormSchema } from "../../../schemas/dynamic-form.schema";
import { extractFieldErrors } from "../../../api/widget.api";
import { useUpdateForm } from "../../../hooks/use-update-form";

interface DynamicFormProps {
  dashboardId: string;
  widget: DynamicFormWidget;
}

const inputClass =
  "w-full rounded-lg border border-border bg-panel px-3 py-2 text-[13px] text-fg outline-none transition focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-danger";

export function DynamicForm({
  dashboardId,
  widget,
}: DynamicFormProps) {
  const fields = widget.data.fields;

  const defaultValues = useMemo(() => {
    return Object.fromEntries(
      fields.map((field) => [
        field.name,
        field.default,
      ]),
    );
  }, [fields]);

  const resolver = useMemo(() => {
    return zodResolver(
      buildFormSchema(fields),
    );
  }, [fields]);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<Record<string, unknown>>({
    defaultValues,
    resolver,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const {
    updateForm,
    isPending,
  } = useUpdateForm(
    dashboardId,
    widget.id,
  );

  const onSubmit = async (
    values: Record<string, unknown>,
  ) => {
    try {
      await updateForm(values);
    } catch (error) {
      const fieldErrors =
        extractFieldErrors(error);

      if (!fieldErrors) {
        return;
      }

      for (const [
        name,
        message,
      ] of Object.entries(fieldErrors)) {
        setError(name, {
          type: "server",
          message,
        });
      }
    }
  };

  const describedBy = (
    field: DynamicFormField,
  ) => {
    const ids = [
      errors[field.name] &&
        `${field.name}-error`,
      field.helpText &&
        `${field.name}-help`,
    ].filter(Boolean);

    return ids.length > 0
      ? ids.join(" ")
      : undefined;
  };

  const renderField = (
    field: DynamicFormField,
  ) => {
    const invalid = Boolean(
      errors[field.name],
    );

    switch (field.type) {
      case "slider":
        return (
          <>
            <label
              htmlFor={field.name}
              className="mb-2 flex items-center justify-between text-[13px] font-semibold"
            >
              <span>{field.label}</span>

              <span className="tabular-nums text-muted">
                {String(
                  watch(field.name) ?? "",
                )}
              </span>
            </label>

            <input
              id={field.name}
              {...register(field.name, {
                valueAsNumber: true,
              })}
              type="range"
              min={field.min}
              max={field.max}
              step={field.step ?? 0.01}
              aria-invalid={invalid}
              aria-describedby={describedBy(
                field,
              )}
              className="h-2 w-full cursor-pointer accent-accent"
            />
          </>
        );

      case "toggle":
        return (
          <label
            htmlFor={field.name}
            className="flex cursor-pointer items-center justify-between"
          >
            <span className="text-[13px] font-semibold">
              {field.label}
            </span>

            <input
              id={field.name}
              {...register(field.name)}
              type="checkbox"
              className="size-4 cursor-pointer accent-accent"
            />
          </label>
        );

      case "number":
        return (
          <>
            <label
              htmlFor={field.name}
              className="mb-2 block text-[13px] font-semibold"
            >
              {field.label}
            </label>

            <input
              id={field.name}
              {...register(field.name, {
                valueAsNumber: true,
              })}
              type="number"
              min={field.min}
              max={field.max}
              step={field.step}
              placeholder={field.placeholder}
              aria-invalid={invalid}
              aria-describedby={describedBy(
                field,
              )}
              className={inputClass}
            />
          </>
        );

      case "text":
        return (
          <>
            <label
              htmlFor={field.name}
              className="mb-2 block text-[13px] font-semibold"
            >
              {field.label}
            </label>

            <input
              id={field.name}
              {...register(field.name)}
              type="text"
              maxLength={field.maxLength}
              placeholder={field.placeholder}
              aria-invalid={invalid}
              aria-describedby={describedBy(
                field,
              )}
              className={inputClass}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <WidgetCard>
      <WidgetCardHeader title={widget.title} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-5 px-5 pt-3 pb-5"
      >
        {fields.map((field) => {
          const content =
            renderField(field);

          if (!content) {
            return null;
          }

          const message = errors[
            field.name
          ]?.message as
            | string
            | undefined;

          return (
            <div key={field.name}>
              {content}

              {field.helpText &&
                !message && (
                  <p
                    id={`${field.name}-help`}
                    className="mt-1.5 text-xs text-muted"
                  >
                    {field.helpText}
                  </p>
                )}

              <AnimatePresence
                initial={false}
              >
                {message && (
                  <motion.p
                    id={`${field.name}-error`}
                    role="alert"
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                    }}
                    transition={{
                      duration: 0.15,
                    }}
                    className="mt-1.5 overflow-hidden text-xs text-danger"
                  >
                    {message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        <motion.button
          type="submit"
          whileTap={{ scale: 0.99 }}
          disabled={isPending}
          className="rounded-lg bg-elevated px-4 py-2 text-[13px] font-semibold text-fg transition hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending
            ? "Applying..."
            : "Apply Changes"}
        </motion.button>
      </form>
    </WidgetCard>
  );
}
