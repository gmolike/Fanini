import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/verein/satzung')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/verein/satzung"!</div>
}
