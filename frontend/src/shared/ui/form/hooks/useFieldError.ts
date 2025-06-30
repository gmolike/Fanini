import {
  type Control,
  type FieldError,
  type FieldPath,
  type FieldValues,
  get,
  useFormState,
} from 'react-hook-form';

/**
 * Hook to manage form field error state
 * Provides error information and helper methods
 *
 * @param control - React Hook Form control object
 * @param name - Field name in the form
 * @returns Object with error information
 *
 * @example
 * ```tsx
 * const { error, errorMessage, hasError } = useFieldError(control, name);
 *
 * {hasError && <span className="error">{errorMessage}</span>}
 * ```
 */
export const useFieldError = <TFieldValues extends FieldValues = FieldValues>(
  control: Control<TFieldValues>,
  name: FieldPath<TFieldValues>
) => {
  const { errors, touchedFields, dirtyFields } = useFormState({ control });

  const fieldError = get(errors, name) as FieldError | undefined;
  const isTouched = get(touchedFields, name) as boolean | undefined;
  const isDirty = get(dirtyFields, name) as boolean | undefined;

  return {
    error: fieldError,
    errorMessage: fieldError?.message ?? '',
    hasError: !!fieldError,
    errorType: fieldError?.type,
    isTouched: !!isTouched,
    isDirty: !!isDirty,
    shouldShowError: !!fieldError && !!isTouched,
  };
};
