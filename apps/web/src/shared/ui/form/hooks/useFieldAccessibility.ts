/* eslint-disable @typescript-eslint/naming-convention */
import { useId } from 'react';
import { type Control, type FieldPath, type FieldValues, useFormState } from 'react-hook-form';

/**
 * Hook to generate accessibility props for form fields
 * Provides consistent ARIA attributes across all form components
 *
 * @param control - React Hook Form control object
 * @param name - Field name in the form
 * @param required - Whether the field is required
 * @param disabled - Whether the field is disabled
 * @param label - Label text for screen readers
 * @returns Object with ARIA props and IDs
 *
 * @example
 * ```tsx
 * const { ariaProps, ids } = useFieldAccessibility(control, name, required);
 *
 * <input {...ariaProps} id={ids.field} />
 * ```
 */
export const useFieldAccessibility = <TFieldValues extends FieldValues = FieldValues>(
  control: Control<TFieldValues>,
  name: FieldPath<TFieldValues>,
  required?: boolean,
  disabled?: boolean,
  label?: string
) => {
  const { errors, isValidating } = useFormState({ control });
  const fieldError = errors[name];
  const uniqueId = useId();

  // Generate consistent IDs based on unique React ID
  const baseId = `${uniqueId}-${name.replace(/\./g, '-').replace(/\[/g, '-').replace(/\]/g, '')}`;

  const ids = {
    field: `field-${baseId}`,
    label: `label-${baseId}`,
    description: `desc-${baseId}`,
    error: `error-${baseId}`,
  };

  const ariaDescribedBy =
    [ids.description, fieldError ? ids.error : null].filter(Boolean).join(' ') || undefined;

  const ariaProps = {
    id: ids.field,
    'aria-invalid': !!fieldError,
    'aria-required': !!required,
    'aria-disabled': !!disabled,
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ids.label,
    'aria-busy': isValidating,
    'aria-label': label,
  } as const;

  const errorProps = {
    id: ids.error,
    role: 'alert',
    'aria-live': 'polite' as const,
  } as const;

  const labelProps = {
    id: ids.label,
    htmlFor: ids.field,
  };

  const descriptionProps = {
    id: ids.description,
  };

  return {
    /**
     * ARIA props to spread on the input element
     */
    ariaProps,

    /**
     * Props to spread on the label element
     */
    labelProps,

    /**
     * Props to spread on the description element
     */
    descriptionProps,

    /**
     * Props to spread on the error element
     */
    errorProps,

    /**
     * Consistent IDs for label, description, error
     */
    ids,

    /**
     * Whether the field has an error
     */
    hasError: !!fieldError,

    /**
     * Whether the field is being validated
     */
    isValidating,
  };
};
