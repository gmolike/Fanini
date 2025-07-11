import type { LucideIcon } from 'lucide-react';

/**
 * Common icon props used across form components
 */
export type IconProps = {
  /**
   * Icon component to display
   * Uses LucideIcon for consistency
   */
  icon?: LucideIcon;

  /**
   * Size of the icon
   * @default 'default' (h-4 w-4)
   */
  iconSize?: 'sm' | 'default' | 'lg';
};

/**
 * Option type for select-like components
 */
export type Option<TValue = string> = {
  /**
   * The actual value stored in form
   */
  value: TValue;

  /**
   * Display label for the option
   */
  label: string;

  /**
   * Optional description
   */
  description?: string;

  /**
   * Whether this option is disabled
   */
  disabled?: boolean;

  /**
   * Icon to display with option
   */
  icon?: LucideIcon;
};

/**
 * Common loading states
 */
export type LoadingState = {
  /**
   * Whether data is being loaded
   */
  isLoading?: boolean;

  /**
   * Loading message to display
   */
  loadingText?: string;

  /**
   * Whether field is validating
   */
  isValidating?: boolean;
};

/**
 * Common placeholder text props
 */
export type PlaceholderProps = {
  /**
   * Placeholder text when empty
   */
  placeholder?: string;

  /**
   * Text to show when no value selected
   * @deprecated Use placeholder instead
   */
  emptyText?: string;
};

// frontend/src/shared/ui/form/types.ts
/**
 * Helper type to handle optional props with exactOptionalPropertyTypes
 * Converts T | undefined to T for required controller props
 */
export type WithDefaults<T> = {
  [K in keyof T]-?: T[K];
};

/**
 * Extract required props from optional ones
 */
export type ExtractRequired<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

/**
 * Extract optional props and make them truly optional
 */
export type ExtractOptional<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]?: Exclude<T[K], undefined>;
};

/**
 * Combine required and optional props correctly
 */
export type StrictProps<T> = ExtractRequired<T> & ExtractOptional<T>;
