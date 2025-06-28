/**
 * Faninitiative Spandau Theme Configuration
 * @description Zentrale Theme-Konfiguration mit Vereinsfarben
 */
export const theme = {
  colors: {
    fanini: {
      blue: '#34687e',
      red: '#b94f46',
    },
  },
} as const

export type Theme = typeof theme
