import { createRouter } from '@tanstack/react-router'

import { routeTree } from '@/app/routeTree.gen'

import { queryClient } from './queryClient'

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

// Einzige Type-Deklaration hier
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
