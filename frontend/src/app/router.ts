import { createRouter } from '@tanstack/react-router'
import { queryClient } from '@/shared/config'
import { routeTree } from '@/routeTree.gen'

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
