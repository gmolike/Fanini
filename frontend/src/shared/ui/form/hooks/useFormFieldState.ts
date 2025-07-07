import { type  Control,type  FieldValues,useFormState  } from 'react-hook-form';


/**
 * Hook to manage form field disabled state
 * Combines explicit disabled prop with form submission state
 *
 * @param control - React Hook Form control object
 * @param disabled - Explicit disabled state
 * @returns Object with disabled state and form state info
 *
 * @example
 * ```tsx
 * const { isDisabled, isSubmitting } = useFormFieldState(control, props.disabled);
 * ```
 */
export const useFormFieldState = <TFieldValues extends FieldValues = FieldValues>(
  control: Control<TFieldValues>,
  disabled?: boolean
) => {
  const { isSubmitting, isDirty, isValid } = useFormState({ control });

  return {
    /**
     * Whether the field should be disabled
     * True if explicitly disabled OR form is submitting
     */
    isDisabled: disabled ?? isSubmitting,

    /**
     * Whether the form is currently submitting
     */
    isSubmitting,

    /**
     * Whether any form field has been modified
     */
    isDirty,

    /**
     * Whether all form validations pass
     */
    isValid,
  };
};
