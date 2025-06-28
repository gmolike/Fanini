/**
 * Faninitiative Spandau e.V. Color Tokens
 * @description Vereinsfarben und semantische Farben für konsistentes Design
 */
export const colors = {
  // Vereinsfarben
  fanini: {
    blue: {
      DEFAULT: '#34687e',
      50: '#f0f4f6',
      100: '#e1eaed',
      200: '#c3d4db',
      300: '#a4bfc9',
      400: '#6c9bb2',
      500: '#34687e',
      600: '#2f5d71',
      700: '#274d5e',
      800: '#1f3d4a',
      900: '#182f3a',
    },
    red: {
      DEFAULT: '#b94f46',
      50: '#fdf2f2',
      100: '#fce5e4',
      200: '#f9cbca',
      300: '#f5a8a5',
      400: '#ed6a65',
      500: '#b94f46',
      600: '#a7453d',
      700: '#8c3932',
      800: '#732e2a',
      900: '#5f2623',
    },
  },

  // Semantic colors
  semantic: {
    success: '#4a7c59',
    warning: '#d4824b',
    error: '#c73e35',
    info: '#34687e',
  },

  // Base colors
  base: {
    white: '#ffffff',
    black: '#1a2e38',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
} as const

export type ColorToken = typeof colors
