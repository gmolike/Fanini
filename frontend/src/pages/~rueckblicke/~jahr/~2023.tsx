import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/rueckblicke/jahr/2023')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/rueckblicke/jahr/2023"!</div>
}
