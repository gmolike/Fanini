import type { BaseFieldProps } from '../../input/model/types';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

/**
 * Props for the TextArea controller hook
 */
export type ControllerProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  label?: string;
};

/**
 * Return value of the TextArea controller hook
 */
export type ControllerResult = {
  isDisabled: boolean;
  rows: number;
  ariaProps: Record<string, unknown>;
  currentLength: number;
  maxLength?: number;
};

/**
 * Props for the TextArea component
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = BaseFieldProps<TFieldValues> & {
  /**
   * Number of visible text rows
   * @default 3
   */
  rows?: number;

  /**
   * Maximum character length
   */
  maxLength?: number;

  /**
   * Whether to show character count
   * @default false
   */
  showCount?: boolean;

  /**
   * Whether to auto-resize based on content
   * @default false
   */
  autoResize?: boolean;

  /**
   * Minimum rows for auto-resize
   * @default 3
   */
  minRows?: number;

  /**
   * Maximum rows for auto-resize
   * @default 10
   */
  maxRows?: number;
};
