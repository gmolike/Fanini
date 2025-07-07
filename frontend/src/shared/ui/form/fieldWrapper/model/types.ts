import type { ReactElement, RefCallback } from 'react';
import type { Control, FieldPath, FieldValues, PathValue } from 'react-hook-form';

/**
 * Props for the FieldWrapper controller hook
 */
export type ControllerProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  showReset?: boolean;
};

/**
 * Return value of the FieldWrapper controller hook
 */
export type ControllerResult<TFieldValues extends FieldValues = FieldValues> = {
  isDifferentFromDefault: boolean;
  handleReset: () => void;
  currentValue: PathValue<TFieldValues, FieldPath<TFieldValues>>;
  hasError: boolean;
  errorMessage: string;
  labelProps: {
    id: string;
    htmlFor: string;
  };
  descriptionProps: {
    id: string;
  };
  errorProps: {
    id: string;
    role: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'aria-live': 'polite';
  };
};

/**
 * Field render props from React Hook Form
 */
export type FieldRenderProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  onChange: (value: PathValue<TFieldValues, TName>) => void;
  onBlur: () => void;
  value: PathValue<TFieldValues, TName>;
  name: string;
  ref: RefCallback<HTMLElement>;
};

/**
 * Props for the FormFieldWrapper component
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
  required?: boolean;
  className?: string;
  showReset?: boolean;
  render: (field: FieldRenderProps<TFieldValues, FieldPath<TFieldValues>>) => ReactElement;
};
