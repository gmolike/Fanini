import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/rueckblicke/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/rueckblicke/"!</div>
}
