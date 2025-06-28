import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/verein/geschichte')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/verein/geschichte"!</div>
}
