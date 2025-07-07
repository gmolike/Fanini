import type { BaseFieldProps } from '../../input/model/types';
import type { Option } from '../../types';
import type { Control, FieldPath, FieldValues, PathValue } from 'react-hook-form';

/**
 * Props for the Select controller hook
 */
export type ControllerProps<TFieldValues extends FieldValues = FieldValues, TValue = string> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  disabled?: boolean;
  required?: boolean;
  options: Option<TValue>[];
  placeholder?: string;
  label?: string;
};

/**
 * Return value of the Select controller hook
 */
export type ControllerResult<TFieldValues extends FieldValues = FieldValues> = {
  isDisabled: boolean;
  normalizedValue: string;
  displayValue: string | undefined;
  open: boolean;
  setOpen: (open: boolean) => void;
  onValueChange: (
    value: string,
    onChange: (newValue: PathValue<TFieldValues, FieldPath<TFieldValues>>) => void
  ) => void;
  ariaProps: Record<string, unknown>;
};

/**
 * Props for the Select component
 */
export type Props<
  TFieldValues extends FieldValues = FieldValues,
  TValue = string,
> = BaseFieldProps<TFieldValues> & {
  /**
   * Array of options
   */
  options: Option<TValue>[];

  /**
   * Whether to show clear button
   * @default true
   */
  showClear?: boolean;
};
