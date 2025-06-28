import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/creators/$creatorId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/creators/$creatorId"!</div>
}
