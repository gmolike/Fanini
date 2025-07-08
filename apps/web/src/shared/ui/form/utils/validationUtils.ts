/**
 * Common validation utilities
 */

/**
 * Check if value is empty (null, undefined, empty string, empty array)
 */
export const isEmpty = (value: unknown): boolean => {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  );
};

/**
 * Check if value has minimum length
 */
export const hasMinLength = (value: string | unknown[], min: number): boolean => {
  if (typeof value === 'string') return value.length >= min;
  if (Array.isArray(value)) return value.length >= min;
  return false;
};

/**
 * Check if value has maximum length
 */
export const hasMaxLength = (value: string | unknown[], max: number): boolean => {
  if (typeof value === 'string') return value.length <= max;
  if (Array.isArray(value)) return value.length <= max;
  return false;
};

/**
 * Check if date is in the past
 */
export const isDateInPast = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d < new Date();
};

/**
 * Check if date is in the future
 */
export const isDateInFuture = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d > new Date();
};
