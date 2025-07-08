// frontend/src/shared/ui/form/utils/propUtils.ts
/**
 * Ensures a value is defined, providing a default if undefined
 *
 * @param value - The value to check
 * @param defaultValue - The default value to use if undefined
 * @returns The value or default
 */
export const ensureDefined = <T>(value: T | undefined, defaultValue: T): T => {
  return value ?? defaultValue;
};
