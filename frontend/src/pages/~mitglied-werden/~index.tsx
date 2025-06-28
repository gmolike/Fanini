import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/mitglied-werden/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/mitglied-werden/"!</div>
}
