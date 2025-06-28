export const splitLayoutConfig = {
  base: 'flex min-h-screen',
  variants: {
    default: {
      wrapper: 'flex-row',
      sidebar: 'w-64 flex-shrink-0 border-r bg-card',
      main: 'flex-1 overflow-auto',
    },
    compact: {
      wrapper: 'flex-row',
      sidebar: 'w-16 flex-shrink-0 border-r bg-card',
      main: 'flex-1 overflow-auto',
    },
  },
} as const
