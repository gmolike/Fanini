/**
 * Format utilities for form fields
 */

/**
 * Format number with locale-specific separators
 */
export const formatNumber = (
  value: number | string | null | undefined,
  locale = 'de-DE',
  options?: Intl.NumberFormatOptions
): string => {
  if (value === null || value === undefined || value === '') return '';

  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '';

  return new Intl.NumberFormat(locale, options).format(num);
};

/**
 * Format currency value
 */
export const formatCurrency = (
  value: number | string | null | undefined,
  currency = 'EUR',
  locale = 'de-DE'
): string => {
  return formatNumber(value, locale, {
    style: 'currency',
    currency,
  });
};

/**
 * Parse localized number string to number
 */
export const parseNumber = (value: string, _locale = 'de-DE'): number | null => {
  if (!value) return null;

  // Replace locale-specific separators
  const normalized = value
    .replace(/\s/g, '') // Remove spaces
    .replace(/\./g, '') // Remove thousand separators
    .replace(/,/g, '.'); // Replace decimal comma with dot

  const num = parseFloat(normalized);
  return isNaN(num) ? null : num;
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');

  // German phone number format
  if (digits.startsWith('49')) {
    const match = /^(\d{2})(\d{3,4})(\d{4,})$/.exec(digits);
    if (match?.[1] && match[2] && match[3]) {
      return `+${match[1]} ${match[2]} ${match[3]}`;
    }
  }

  // Default format
  const match = /^(\d{3,4})(\d{3,4})(\d{4,})$/.exec(digits);
  if (match?.[1] && match[2] && match[3]) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }

  return value;
};
