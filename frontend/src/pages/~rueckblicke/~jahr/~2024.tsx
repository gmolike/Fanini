import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/rueckblicke/jahr/2024')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/rueckblicke/jahr/2024"!</div>
}
