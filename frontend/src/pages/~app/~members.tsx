import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/members')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/members"!</div>
}
