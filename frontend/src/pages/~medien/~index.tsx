import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/medien/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/medien/"!</div>
}
