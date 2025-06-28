import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/events/kalender')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/events/kalender"!</div>
}
