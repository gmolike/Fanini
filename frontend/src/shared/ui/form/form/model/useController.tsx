import { useMemo } from 'react';
import { type  FieldValues,useForm as useRHFForm  } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import type { ControllerProps, ControllerResult } from './types';

/**
 * Hook for Form controller logic
 * Handles both external and internal form instances
 *
 * @template TFieldValues - Type of the form values
 *
 * @param props - Controller props
 * @returns Controller result with form instance and metadata
 */
export const useController = <TFieldValues extends FieldValues = FieldValues>({
  form: externalForm,
  schema,
  defaultValues,
  mode = 'onChange',
  reValidateMode = 'onChange',
  criteriaMode = 'all',
  resetOptions,
  shouldFocusError = true,
  shouldUnregister = false,
  shouldUseNativeValidation = false,
  progressive = false,
  delayError,
}: ControllerProps<TFieldValues>): ControllerResult<TFieldValues> => {
  // Create internal form if no external form provided
  const internalForm = useRHFForm<TFieldValues>(
    externalForm
      ? {} // Dummy config when using external form
      : {
          resolver: schema ? zodResolver(schema) : undefined,
          defaultValues,
          mode,
          reValidateMode,
          criteriaMode,
          resetOptions,
          shouldFocusError,
          shouldUnregister,
          shouldUseNativeValidation,
          progressive,
          delayError,
        }
  );

  // Determine which form to use
  const result = useMemo(() => {
    if (externalForm) {
      return {
        form: externalForm,
        isInternalForm: false,
      };
    }

    if (!schema) {
      throw new Error(
        'Form component requires either a form instance or a schema. ' +
          'Use <Form form={form}> or <Form schema={schema}>'
      );
    }

    return {
      form: internalForm,
      isInternalForm: true,
    };
  }, [externalForm, internalForm, schema]);

  return result;
};
