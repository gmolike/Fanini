import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/medien/downloads')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/medien/downloads"!</div>
}
