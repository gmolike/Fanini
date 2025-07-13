// frontend/src/form/actionButton/model/types.ts
import type { IconProps } from '../../types';
import type { ReactNode } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

/**
 * Props for the ActionButton controller hook
 */
export type ControllerProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>;
  onClick?: (values: TFieldValues) => void | Promise<void>;
  disabled?: boolean | ((values: TFieldValues) => boolean);
  loading?: boolean;
  watchFields?: FieldPath<TFieldValues>[];
};

/**
 * Return value of the ActionButton controller hook
 */
export type ControllerResult<TFieldValues extends FieldValues = FieldValues> = {
  isDisabled: boolean;
  isLoading: boolean;
  handleClick: () => void;
  ariaProps: Record<string, unknown>;
  formValues: TFieldValues;
  hasWatchedFieldsChanged: boolean;
};

/**
 * Props for the ActionButton component
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = IconProps & {
  /**
   * React Hook Form control object
   */
  control: Control<TFieldValues>;

  /**
   * Click handler with access to form values
   * Can be async for loading states
   */
  onClick?: (values: TFieldValues) => void | Promise<void>;

  /**
   * Button content
   * Can be a function that receives form values
   */
  children: ReactNode | ((values: TFieldValues) => ReactNode);

  /**
   * Button variant
   * @default 'outline'
   */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

  /**
   * Button size
   * @default 'default'
   */
  size?: 'default' | 'sm' | 'lg' | 'icon';

  /**
   * Whether button is disabled
   * Can be a function that receives form values
   */
  disabled?: boolean | ((values: TFieldValues) => boolean);

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Icon at start
   */
  startIcon?: IconProps['icon'];

  /**
   * Icon at end
   */
  endIcon?: IconProps['icon'];

  /**
   * Fields to watch for changes
   * Button will re-render when these fields change
   */
  watchFields?: FieldPath<TFieldValues>[];

  /**
   * Loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Loading text
   * @default 'Processing...'
   */
  loadingText?: string;

  /**
   * Full width button
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Test ID
   */
  testId?: string;

  /**
   * Button type
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
};
