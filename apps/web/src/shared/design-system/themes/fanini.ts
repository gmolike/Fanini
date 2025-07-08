/* eslint-disable @typescript-eslint/naming-convention */
import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';

/**
 * Faninitiative Spandau e.V. Theme
 * @description Haupt-Theme mit Vereinsfarben und Branding
 */
export const faniniTheme = {
  colors: {
    // Primary brand colors
    primary: colors.fanini.blue.DEFAULT,
    primaryForeground: colors.base.white,
    secondary: colors.fanini.red.DEFAULT,
    secondaryForeground: colors.base.white,

    // Background colors
    background: colors.base.white,
    foreground: colors.base.black,

    // Component colors
    card: colors.base.white,
    cardForeground: colors.base.black,
    muted: colors.base.gray[100],
    mutedForeground: colors.base.gray[600],
    accent: colors.fanini.blue[50],
    accentForeground: colors.fanini.blue.DEFAULT,

    // Interactive colors
    border: colors.base.gray[200],
    input: colors.base.gray[100],
    ring: colors.fanini.blue.DEFAULT,

    // Status colors
    destructive: colors.semantic.error,
    destructiveForeground: colors.base.white,
    success: colors.semantic.success,
    successForeground: colors.base.white,
    warning: colors.semantic.warning,
    warningForeground: colors.base.white,

    // Fanini specific
    fanini: colors.fanini,
  },

  spacing,

  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      heading: ['Bebas Neue', 'Inter', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
  },

  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
} as const;

export type FaniniTheme = typeof faniniTheme;
