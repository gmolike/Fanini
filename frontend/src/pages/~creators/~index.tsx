import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/creators/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/creators/"!</div>
}
