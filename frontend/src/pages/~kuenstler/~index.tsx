import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/kuenstler/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/kuenstler/"!</div>
}
