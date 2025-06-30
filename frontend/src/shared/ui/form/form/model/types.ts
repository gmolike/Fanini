import type { ReactNode } from 'react';
import type {
  CriteriaMode,
  DefaultValues,
  FieldValues,
  Mode,
  SubmitHandler,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form';
import type { ZodType } from 'zod';

/**
 * Props for the Form controller hook
 */
export type ControllerProps<TFieldValues extends FieldValues = FieldValues> = {
  form?: UseFormReturn<TFieldValues>;
  schema?: ZodType<TFieldValues>;
  defaultValues?: DefaultValues<TFieldValues>;
  mode?: Mode;
  reValidateMode?: Exclude<Mode, 'onTouched' | 'all'>;
  criteriaMode?: CriteriaMode;
  resetOptions?: UseFormProps<TFieldValues>['resetOptions'];
  shouldFocusError?: boolean;
  shouldUnregister?: boolean;
  shouldUseNativeValidation?: boolean;
  progressive?: boolean;
  delayError?: number;
};

/**
 * Return value of the Form controller hook
 */
export type ControllerResult<TFieldValues extends FieldValues = FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  isInternalForm: boolean;
};

/**
 * Props for the Form component
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = {
  onSubmit: SubmitHandler<TFieldValues>;
  onError?: (errors: FieldValues) => void;
  children: ReactNode | ((form: UseFormReturn<TFieldValues>) => ReactNode);
  className?: string;
  id?: string;
  noValidate?: boolean;
  onReset?: () => void;
} & (
  | {
      // External form mode
      form: UseFormReturn<TFieldValues>;
      schema?: never;
      defaultValues?: never;
      mode?: never;
      reValidateMode?: never;
      criteriaMode?: never;
      resetOptions?: never;
      shouldFocusError?: never;
      shouldUnregister?: never;
      shouldUseNativeValidation?: never;
      progressive?: never;
      delayError?: never;
    }
  | {
      // Internal form mode
      form?: never;
      schema: ZodType<TFieldValues>;
      defaultValues?: DefaultValues<TFieldValues>;
      mode?: Mode;
      reValidateMode?: Exclude<Mode, 'onTouched' | 'all'>;
      criteriaMode?: CriteriaMode;
      resetOptions?: UseFormProps<TFieldValues>['resetOptions'];
      shouldFocusError?: boolean;
      shouldUnregister?: boolean;
      shouldUseNativeValidation?: boolean;
      progressive?: boolean;
      delayError?: number;
    }
);
