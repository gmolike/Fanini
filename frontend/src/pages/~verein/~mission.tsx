import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/verein/mission')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/verein/mission"!</div>
}
