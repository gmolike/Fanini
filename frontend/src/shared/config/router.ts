import { createRouter } from '@tanstack/react-router'
import { queryClient } from './queryClient'
import { routeTree } from '@/app/routeTree.gen'

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
