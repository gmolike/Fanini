import type { BaseFieldProps } from '../../input/model/types';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

/**
 * Props for the Checkbox controller hook
 */
export type ControllerProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  disabled?: boolean;
  required?: boolean;
  side?: LabelSide;
  label?: string;
};

/**
 * Return value of the Checkbox controller hook
 */
export type ControllerResult = {
  isDisabled: boolean;
  groupClasses: string;
  ariaProps: Record<string, unknown>;
  labelProps: {
    id: string;
    htmlFor: string;
  };
};

/**
 * Label position relative to the checkbox
 */
export type LabelSide = 'top' | 'right' | 'bottom' | 'left';

/**
 * Props for the Checkbox component
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = BaseFieldProps<TFieldValues> & {
  /**
   * Position of the label relative to the checkbox
   * @default 'right'
   */
  side?: LabelSide;

  /**
   * Headline above the checkbox group
   */
  headline?: string;

  /**
   * Whether to show clear button (unchecks the checkbox)
   * @default false
   */
  showClear?: boolean;
};
