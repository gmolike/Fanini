import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/verein/mitglieder')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/verein/mitglieder"!</div>
}
