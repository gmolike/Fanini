import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/rueckblicke/artikel/$articleId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/rueckblicke/artikel/$articleId"!</div>
}
