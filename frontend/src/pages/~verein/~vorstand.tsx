import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/verein/vorstand')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/verein/vorstand"!</div>
}
