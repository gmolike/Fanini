import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/medien/videos')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/medien/videos"!</div>
}
