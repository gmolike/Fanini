/**
 * Common constants for form components
 */

/**
 * Default debounce delay in milliseconds
 */
export const DEFAULT_DEBOUNCE_DELAY = 300;

/**
 * Icon sizes mapping
 */
export const ICON_SIZES = {
  sm: 'h-3 w-3',
  default: 'h-4 w-4',
  lg: 'h-5 w-5',
} as const;

/**
 * Common animation transitions
 */
export const TRANSITIONS = {
  default: 'transition-colors duration-200',
  fast: 'transition-all duration-150',
  slow: 'transition-all duration-300',
} as const;

/**
 * Z-index values for layered components
 */
export const Z_INDEX = {
  dropdown: 50,
  modal: 100,
  tooltip: 150,
} as const;
