import { z } from 'zod';

import { useFieldAccessibility, useFormFieldState } from '../../hooks';

import type { ControllerProps, ControllerResult, InputHTMLType } from './types';
import type { Control,FieldValues } from 'react-hook-form';

/**
 * Type for resolver with Zod schema
 * @internal
 */
type ResolverWithSchema = {
  zodSchema?: z.ZodObject<z.ZodRawShape>;
};

/**
 * Type for control options
 * @internal
 */
type ControlOptions = {
  resolver?: ResolverWithSchema;
};

/**
 * Extract schema metadata from the form's resolver
 * @internal
 */
const getFieldSchema = <TFieldValues extends FieldValues>(
  control: Control<TFieldValues>,
  fieldName: string
): z.ZodTypeAny | undefined => {
  try {
    // Type-safe access to resolver
    const options = control._options as ControlOptions | undefined;
    const resolver = options?.resolver;

    if (!resolver?.zodSchema) return undefined;

    const schema = resolver.zodSchema;
    // Navigate through nested schema
    const fieldParts = fieldName.split('.');
    let currentSchema: unknown = schema.shape;

    for (const part of fieldParts) {
      if (
        currentSchema !== undefined &&
        currentSchema !== null &&
        typeof currentSchema === 'object' &&
        part in (currentSchema as Record<string, unknown>)
      ) {
        currentSchema = (currentSchema as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }

    return currentSchema as z.ZodTypeAny;
  } catch {
    return undefined;
  }
};

/**
 * Infer input type from Zod schema
 * @internal
 */
const inferInputType = (schema: z.ZodTypeAny): InputHTMLType => {
  // Unwrap optional/nullable/default
  let baseSchema = schema;
  while (
    baseSchema instanceof z.ZodOptional ||
    baseSchema instanceof z.ZodNullable ||
    baseSchema instanceof z.ZodDefault
  ) {
    baseSchema = baseSchema._def.innerType as z.ZodTypeAny;
  }

  // Check for string with specific checks
  if (baseSchema instanceof z.ZodString) {
    const { checks } = baseSchema._def;
    for (const check of checks) {
      if (check.kind === 'email') return 'email';
      if (check.kind === 'url') return 'url';
    }
    return 'text';
  }

  // Check for number
  if (baseSchema instanceof z.ZodNumber) {
    return 'number';
  }

  // Check for date
  if (baseSchema instanceof z.ZodDate) {
    return 'date';
  }

  return 'text';
};

/**
 * Hook for Input controller logic
 *
 * @template TFieldValues - Type of the form values
 *
 * @param props - Controller props
 * @returns Controller result with state and props
 */
export const useController = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  disabled,
  required,
  type: explicitType,
  label,
}: ControllerProps<TFieldValues>): ControllerResult => {
  const { isDisabled } = useFormFieldState(control, disabled);
  const { ariaProps, labelProps, descriptionProps, errorProps, hasError } = useFieldAccessibility(
    control,
    name,
    required,
    isDisabled,
    label
  );

  // Get field schema for type inference
  const fieldSchema = getFieldSchema(control, name as string);

  // Determine input type
  const inputType = explicitType ?? (fieldSchema ? inferInputType(fieldSchema) : 'text');

  return {
    isDisabled,
    inputType,
    ariaProps,
    labelProps,
    descriptionProps,
    errorProps,
    hasError,
  };
};
