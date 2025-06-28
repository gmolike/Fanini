import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/kuenstler/$artistId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/kuenstler/$artistId"!</div>
}
