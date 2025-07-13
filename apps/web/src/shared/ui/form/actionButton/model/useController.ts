/* eslint-disable @typescript-eslint/naming-convention */
// frontend/src/form/actionButton/model/useController.ts
import { useCallback, useMemo, useState } from 'react';
import { type FieldPath, type FieldValues, useFormContext, useWatch } from 'react-hook-form';

import type { ControllerProps, ControllerResult } from './types';

/**
 * Hook for ActionButton controller logic
 *
 * @template TFieldValues - Type of the form values
 */
export const useController = <TFieldValues extends FieldValues = FieldValues>({
  control,
  onClick,
  disabled,
  loading = false,
  watchFields = [],
}: ControllerProps<TFieldValues>): ControllerResult<TFieldValues> => {
  const form = useFormContext<TFieldValues>();
  const [isProcessing, setIsProcessing] = useState(false);

  // Watch specific fields or entire form
  const watchedValues = useWatch({
    control,
    name: watchFields as readonly FieldPath<TFieldValues>[],
  });

  // Get all form values
  const formValues = form.getValues();

  // Check if watched fields have changed from default
  const hasWatchedFieldsChanged = useMemo(() => {
    if (watchFields.length === 0) return false;

    const { defaultValues } = form.formState;
    if (!defaultValues) return false;

    return watchFields.some(field => {
      const currentValue = form.getValues(field);
      const defaultValue = defaultValues[field];
      return currentValue !== defaultValue;
    });
  }, [watchFields, form, watchedValues]); // Include watchedValues to trigger re-evaluation

  // Calculate disabled state
  const isDisabled = useMemo(() => {
    if (loading || isProcessing) return true;
    if (typeof disabled === 'function') {
      return disabled(formValues);
    }
    return disabled ?? false;
  }, [disabled, loading, isProcessing, formValues]);

  // Handle click with async support
  const handleClick = useCallback(async () => {
    if (!onClick || isDisabled) return;

    const currentValues = form.getValues();

    try {
      setIsProcessing(true);
      await onClick(currentValues);
    } catch (error) {
      console.error('ActionButton onClick error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [onClick, isDisabled, form]);

  // ARIA props for accessibility
  const ariaProps = useMemo(
    () => ({
      'aria-busy': loading || isProcessing,
      'aria-disabled': isDisabled,
    }),
    [loading, isProcessing, isDisabled]
  );

  return {
    isDisabled,
    isLoading: loading || isProcessing,
    handleClick: () => {
      void handleClick();
    },
    ariaProps,
    formValues,
    hasWatchedFieldsChanged,
  };
};
