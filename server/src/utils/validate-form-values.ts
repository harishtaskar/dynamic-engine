export interface FormFieldRule {
  name: string;
  label: string;
  type: string;

  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
}

/**
 * Re-checks submitted values against the rules the widget shipped with.
 *
 * The client compiles the same rules into a Zod schema, but the client is only
 * the first gate a request can reach this endpoint without ever passing
 * through the form.
 */
export function validateFormValues(
  fields: FormFieldRule[],
  values: Record<string, unknown>,
): Record<string, string> {
  const errors: Record<string, string> = {};

  const fieldsByName = new Map(
    fields.map((field) => [
      field.name,
      field,
    ]),
  );

  for (const key of Object.keys(values)) {
    if (!fieldsByName.has(key)) {
      errors[key] =
        "Unknown field for this widget";
    }
  }

  for (const field of fields) {
    if (
      !Object.prototype.hasOwnProperty.call(
        values,
        field.name,
      )
    ) {
      continue;
    }

    const error = validateField(
      field,
      values[field.name],
    );

    if (error) {
      errors[field.name] = error;
    }
  }

  return errors;
}

function validateField(
  field: FormFieldRule,
  value: unknown,
): string | null {
  if (field.type === "toggle") {
    return typeof value === "boolean"
      ? null
      : `${field.label} must be true or false`;
  }

  if (
    field.type === "number" ||
    field.type === "slider"
  ) {
    if (
      typeof value !== "number" ||
      !Number.isFinite(value)
    ) {
      return `${field.label} must be a number`;
    }

    if (
      field.min !== undefined &&
      value < field.min
    ) {
      return `${field.label} must be at least ${field.min}`;
    }

    if (
      field.max !== undefined &&
      value > field.max
    ) {
      return `${field.label} must be at most ${field.max}`;
    }

    return null;
  }

  if (typeof value !== "string") {
    return `${field.label} must be text`;
  }

  const trimmed = value.trim();

  if (field.required && trimmed.length === 0) {
    return `${field.label} is required`;
  }

  if (trimmed.length === 0) {
    return null;
  }

  if (
    field.minLength !== undefined &&
    trimmed.length < field.minLength
  ) {
    return `${field.label} must be at least ${field.minLength} characters`;
  }

  if (
    field.maxLength !== undefined &&
    trimmed.length > field.maxLength
  ) {
    return `${field.label} must be at most ${field.maxLength} characters`;
  }

  if (field.pattern) {
    const expression = safeRegExp(
      field.pattern,
    );

    if (
      expression &&
      !expression.test(trimmed)
    ) {
      return (
        field.patternMessage ??
        `${field.label} is not in the expected format`
      );
    }
  }

  return null;
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
