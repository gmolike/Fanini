import type { IconProps } from '../../types';
import type { ComponentProps } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

/**
 * Base field props shared by all form fields
 *
 * @template TFieldValues - Type of the form values
 */
export type BaseFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  /**
   * React Hook Form control object
   * Required to connect the field to the form
   */
  control: Control<TFieldValues>;

  /**
   * Field name in the form (must be a valid path in TFieldValues)
   * Examples: "email", "address.street", "users[0].name"
   */
  name: FieldPath<TFieldValues>;

  /**
   * Label text to display above the field
   * @optional If provided, renders a FormLabel component
   */
  label?: string;

  /**
   * Helper text to display below the field
   * @optional Provides additional context or instructions
   */
  description?: string;

  /**
   * Whether the field is required
   * @optional Used for validation and visual indicators
   */
  required?: boolean;

  /**
   * Whether the field is disabled
   * @optional Also disabled during form submission
   */
  disabled?: boolean;

  /**
   * Placeholder text for the field
   * @optional Shown when field is empty
   */
  placeholder?: string;

  /**
   * Additional CSS classes for the form item container
   * @optional Applied to the outermost FormItem element
   */
  className?: string;

  /**
   * Whether to show reset to default button
   * @default true
   * Button appears when field value differs from default
   */
  showReset?: boolean;

  /**
   * Test ID for testing
   * @optional Applied to the input element
   */
  testId?: string;
};

/**
 * Props for the Input controller hook
 *
 * @template TFieldValues - Type of the form values
 */
export type ControllerProps<TFieldValues extends FieldValues = FieldValues> = {
  /**
   * React Hook Form control object
   */
  control: Control<TFieldValues>;

  /**
   * Field name in the form
   */
  name: FieldPath<TFieldValues>;

  /**
   * Whether the field is disabled
   */
  disabled?: boolean;

  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * HTML input type
   */
  type?: InputHTMLType;

  /**
   * Label for accessibility
   */
  label?: string;
};

/**
 * Return value of the Input controller hook
 */
export type ControllerResult = {
  /**
   * Whether the field is disabled
   */
  isDisabled: boolean;

  /**
   * HTML input type
   */
  inputType: InputHTMLType;

  /**
   * ARIA props for accessibility
   */
  ariaProps: Record<string, unknown>;

  /**
   * Label props for the label element
   */
  labelProps: {
    id: string;
    htmlFor: string;
  };

  /**
   * Description props
   */
  descriptionProps: {
    id: string;
  };

  /**
   * Error props
   */
  errorProps: {
    id: string;
    role: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'aria-live': 'polite';
  };

  /**
   * Whether field has error
   */
  hasError: boolean;
};

/**
 * Supported HTML input types
 */
export type InputHTMLType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'month'
  | 'week'
  | 'color';

/**
 * Props for the Input component
 *
 * @template TFieldValues - Type of the form values
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = BaseFieldProps<TFieldValues> &
  IconProps & {
    /**
     * Additional CSS classes for the input element
     */
    inputClassName?: string;

    /**
     * Additional CSS classes for the input wrapper div
     */
    wrapperClassName?: string;

    /**
     * Icon to display at the start of the input
     */
    startIcon?: IconProps['icon'];

    /**
     * Icon to display at the end of the input
     */
    endIcon?: IconProps['icon'];

    /**
     * HTML input type
     * @default 'text'
     */
    type?: InputHTMLType;

    /**
     * Minimum value (for number inputs)
     */
    min?: number | string;

    /**
     * Maximum value (for number inputs)
     */
    max?: number | string;

    /**
     * Step value (for number inputs)
     */
    step?: number | string;

    /**
     * Pattern for validation
     */
    pattern?: string;

    /**
     * Whether to show clear button
     * @default false
     */
    showClear?: boolean;
  } & Omit<
    ComponentProps<'input'>,
    'name' | 'type' | 'required' | 'ref' | 'value' | 'onChange' | 'onBlur'
  >;
