import { z } from "zod";

import type {
  DynamicFormField,
} from "../types/widget";

export function buildFormSchema(
  fields: DynamicFormField[],
) {
  const shape: Record<
    string,
    z.ZodType
  > = {};

  for (const field of fields) {
    shape[field.name] =
      buildFieldSchema(field);
  }

  return z.object(shape);
}

function buildFieldSchema(
  field: DynamicFormField,
): z.ZodType {
  if (field.type === "toggle") {
    return z.boolean();
  }

  if (
    field.type === "number" ||
    field.type === "slider"
  ) {
    let schema = z.number({
      error: `${field.label} must be a number`,
    });

    if (field.min !== undefined) {
      schema = schema.min(
        field.min,
        `${field.label} must be at least ${field.min}`,
      );
    }

    if (field.max !== undefined) {
      schema = schema.max(
        field.max,
        `${field.label} must be at most ${field.max}`,
      );
    }

    return schema;
  }

  let schema = z.string({
    error: `${field.label} must be text`,
  });

  if (field.required) {
    schema = schema.trim().min(
      1,
      `${field.label} is required`,
    );
  }

  if (field.minLength !== undefined) {
    schema = schema.min(
      field.minLength,
      `${field.label} must be at least ${field.minLength} characters`,
    );
  }

  if (field.maxLength !== undefined) {
    schema = schema.max(
      field.maxLength,
      `${field.label} must be at most ${field.maxLength} characters`,
    );
  }

  if (field.pattern) {
    const expression = safeRegExp(
      field.pattern,
    );

    if (expression) {
      schema = schema.regex(
        expression,
        field.patternMessage ??
          `${field.label} is not in the expected format`,
      );
    }
  }

  if (!field.required) {
    return z.union([
      z.literal(""),
      schema,
    ]);
  }

  return schema;
}

function safeRegExp(
  pattern: string,
): RegExp | null {
  try {
    return new RegExp(pattern);
  } catch {
    console.warn(
      "Ignoring invalid field pattern:",
      pattern,
    );

    return null;
  }
}
