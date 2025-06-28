import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/medien/fotos')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/medien/fotos"!</div>
}
