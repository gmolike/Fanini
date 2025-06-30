import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/intern/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/profile"!</div>
}
