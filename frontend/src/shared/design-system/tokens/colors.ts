export const colors = {
  // Faninitiative Spandau Hauptfarben
  fanini: {
    blue: {
      DEFAULT: '#34687e',
      light: '#4a7e94',
      dark: '#1e5268',
      50: '#e8f0f4',
      100: '#d1e1e9',
      200: '#a3c3d3',
      300: '#75a5bd',
      400: '#4787a7',
      500: '#34687e',
      600: '#2a5365',
      700: '#203e4c',
      800: '#162a33',
      900: '#0c151a',
    },
    red: {
      DEFAULT: '#b94f46',
      light: '#cf655c',
      dark: '#a33930',
      50: '#fef2f1',
      100: '#fde5e3',
      200: '#fbcbc7',
      300: '#f9b1ab',
      400: '#f7978f',
      500: '#b94f46',
      600: '#943f38',
      700: '#6f2f2a',
      800: '#4a201c',
      900: '#25100e',
    },
  },
  // Semantic Colors
  primary: 'var(--color-fanini-blue)',
  secondary: 'var(--color-fanini-red)',
  // Weitere semantic colors...
} as const

export type Colors = typeof colors
