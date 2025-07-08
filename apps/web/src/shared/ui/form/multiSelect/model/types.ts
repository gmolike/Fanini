import type { BaseFieldProps } from '../../input/model/types';
import type { Option } from '../../types';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

/**
 * Props for the MultiSelect controller hook
 */
export type ControllerProps<TFieldValues extends FieldValues = FieldValues, TValue = string> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  disabled?: boolean;
  required?: boolean;
  options: Option<TValue>[];
  max?: number;
  label?: string;
};

/**
 * Return value of the MultiSelect controller hook
 */
export type ControllerResult<TValue = string> = {
  isDisabled: boolean;
  selectedOptions: Option<TValue>[];
  availableOptions: Option<TValue>[];
  canAddMore: boolean;
  toggleOption: (option: Option<TValue>) => void;
  removeOption: (option: Option<TValue>) => void;
  clearAll: () => void;
  ariaProps: Record<string, unknown>;
};

/**
 * Props for the MultiSelect component
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
   * Maximum number of selections allowed
   */
  max?: number;

  /**
   * Whether to show selected count
   * @default true
   */
  showCount?: boolean;

  /**
   * Whether to show clear all button
   * @default true
   */
  showClearAll?: boolean;
};
