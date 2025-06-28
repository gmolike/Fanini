import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/presse/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/presse/"!</div>
}
